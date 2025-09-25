import { Test, TestingModule } from '@nestjs/testing';
import { RpcException } from '@nestjs/microservices';
import { RouteOptimizationService } from './route-optimization.service';
import { RouteClient } from './route.client';
import * as utils from '@app/utils';
import type {
    AddRouteRequest,
    FindPointResponse,
    OptimizedRouteResult,
} from '@app/contracts';

jest.mock('@app/utils', () => ({
    optimizeRoute: jest.fn(),
    validateStartingPoint: jest.fn(),
}));

describe('RouteOptimizationService', () => {
    let service: RouteOptimizationService;
    let routeClient: {
        getPoint: jest.Mock;
        emitRouteCalculated: jest.Mock;
    };

    const mockAddRouteRequest: AddRouteRequest = {
        pointsId: '6331c8a1c9320531c3600c28',
        userId: '6331c8a1c9320531c3600c29',
        pointId: 1,
    };
    const mockFindPointResponse: FindPointResponse = {
        point: {
            _id: '6331c8a1c9320531c3600c28',
            points: [
                { id: 1, x: 0, y: 0 },
                { id: 2, x: 50, y: 30 },
                { id: 3, x: 10, y: 80 },
            ],
        },
    };

    beforeEach(async () => {
        const mockRouteClient = {
            getPoint: jest.fn(),
            emitRouteCalculated: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RouteOptimizationService,
                {
                    provide: RouteClient,
                    useValue: mockRouteClient,
                },
            ],
        }).compile();

        service = module.get<RouteOptimizationService>(
            RouteOptimizationService,
        );
        routeClient = module.get(RouteClient);

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('calculateAndOptimizeRoute', () => {
        it('should successfully calculate and emit the optimized route', async () => {
            const mockCalculatedRoute: OptimizedRouteResult = {
                optimizedRoute: [1, 3, 2, 1],
                totalDistance: 188.8,
            };

            routeClient.getPoint.mockResolvedValue(mockFindPointResponse);
            (utils.validateStartingPoint as jest.Mock).mockReturnValue(true);
            (utils.optimizeRoute as jest.Mock).mockReturnValue(
                mockCalculatedRoute,
            );

            const result =
                await service.calculateAndOptimizeRoute(mockAddRouteRequest);

            expect(routeClient.getPoint).toHaveBeenCalledWith(
                mockAddRouteRequest.userId,
                mockAddRouteRequest.pointsId,
            );
            expect(routeClient.emitRouteCalculated).toHaveBeenCalledWith({
                userId: mockAddRouteRequest.userId,
                pointsId: mockAddRouteRequest.pointsId,
                calculatedRoute: mockCalculatedRoute,
            });
            expect(result).toEqual(mockCalculatedRoute);
        });

        it('should throw RpcException for invalid ObjectId format', async () => {
            const invalidPayload: AddRouteRequest = {
                pointsId: 'invalid',
                userId: 'invalid',
            };
            const expectedError = new RpcException({
                statusCode: 400,
                message: 'Invalid format for pointsId or userId',
            });

            await expect(
                service.calculateAndOptimizeRoute(invalidPayload),
            ).rejects.toThrow(expectedError);
            expect(routeClient.getPoint).not.toHaveBeenCalled();
        });

        it('should throw RpcException if points are not found', async () => {
            routeClient.getPoint.mockResolvedValue(null);
            const expectedError = new RpcException({
                statusCode: 404,
                message: `Points with ID ${mockAddRouteRequest.pointsId} not found.`,
            });

            await expect(
                service.calculateAndOptimizeRoute(mockAddRouteRequest),
            ).rejects.toThrow(expectedError);
        });

        it('should throw RpcException if there are less than 2 points', async () => {
            const singlePointResponse: FindPointResponse = {
                point: { _id: '...', points: [{ id: 1, x: 0, y: 0 }] },
            };
            routeClient.getPoint.mockResolvedValue(singlePointResponse);
            const expectedError = new RpcException({
                statusCode: 422,
                message: 'A route requires at least 2 points to be calculated.',
            });

            await expect(
                service.calculateAndOptimizeRoute(mockAddRouteRequest),
            ).rejects.toThrow(expectedError);
        });

        it('should throw RpcException if the starting point is not valid', async () => {
            routeClient.getPoint.mockResolvedValue(mockFindPointResponse);
            (utils.validateStartingPoint as jest.Mock).mockReturnValue(false);
            const expectedError = new RpcException({
                statusCode: 422,
                message: `The provided start point with id "${mockAddRouteRequest.pointId}" was not found in the list of points.`,
            });

            await expect(
                service.calculateAndOptimizeRoute(mockAddRouteRequest),
            ).rejects.toThrow(expectedError);
        });
    });
});
