import { Test, TestingModule } from '@nestjs/testing';
import { RpcException } from '@nestjs/microservices';
import { RouteOptimizationService } from './route-optimization.service';
import { RouteClient } from './route.client';
import * as utils from '@app/utils';
import type {
    AddRouteRequest,
    DeleteRouteRequest,
    FindPointResponse,
    HistoryRequest,
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
        saveHistory: jest.Mock;
        getHistory: jest.Mock;
        deleteRoute: jest.Mock;
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
            ],
        },
    };

    beforeEach(async () => {
        const mockRouteClient = {
            getPoint: jest.fn(),
            saveHistory: jest.fn(),
            getHistory: jest.fn(),
            deleteRoute: jest.fn(),
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
        it('should successfully calculate and save the optimized route', async () => {
            const mockCalculatedRoute: OptimizedRouteResult = {
                optimizedRoute: [1, 2, 1],
                totalDistance: 116.62,
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

            expect(routeClient.saveHistory).toHaveBeenCalledWith({
                userId: mockAddRouteRequest.userId,
                pointsId: mockAddRouteRequest.pointsId,
                optimizedRoute: mockCalculatedRoute.optimizedRoute,
                totalDistance: mockCalculatedRoute.totalDistance,
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
        });
    });

    describe('getHistory', () => {
        it('should call the client to get history and return the result', async () => {
            const payload: HistoryRequest = { userId: 'user-123' };
            const expectedResponse = { route: [] };
            routeClient.getHistory.mockResolvedValue(expectedResponse);

            const result = await service.getHistory(payload);

            expect(routeClient.getHistory).toHaveBeenCalledWith(payload);
            expect(result).toEqual(expectedResponse);
        });
    });

    describe('deleteRoute', () => {
        it('should call the client to delete a route and return the result', async () => {
            const payload: DeleteRouteRequest = {
                userId: 'user-123',
                routeId: 'route-456',
            };
            const expectedResponse = { deleted: true };
            routeClient.deleteRoute.mockResolvedValue(expectedResponse);

            const result = await service.deleteRoute(payload);

            expect(routeClient.deleteRoute).toHaveBeenCalledWith(payload);
            expect(result).toEqual(expectedResponse);
        });
    });
});
