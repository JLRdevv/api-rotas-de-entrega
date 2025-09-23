/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { RouteOptimizationService } from './route-optimization.service';
import {
    BadRequestException,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import type {
    AddRouteRequest,
    FindPointResponse,
    OptimizedRouteResult,
} from '@app/contracts';
import * as utils from '@app/utils';
import { of } from 'rxjs';

jest.mock('@app/utils', () => {
    const originalModule = jest.requireActual('@app/utils');
    return {
        __esModule: true,
        ...originalModule,
        optimizeRoute: jest.fn(),
    };
});

const mockedOptimizeRoute =
    utils.optimizeRoute as jest.Mock<OptimizedRouteResult>;

describe('RouteOptimizationService', () => {
    let service: RouteOptimizationService;

    const mockPointsServiceClient = {
        send: jest.fn(),
        emit: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RouteOptimizationService,
                {
                    provide: 'POINTS_SERVICE',
                    useValue: mockPointsServiceClient,
                },
            ],
        }).compile();

        service = module.get<RouteOptimizationService>(
            RouteOptimizationService,
        );
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('calculateAndOptimizeRoute', () => {
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
        const mockCalculatedRoute: OptimizedRouteResult = {
            optimizedRoute: [1, 3, 2, 1],
            totalDistance: 188.8,
        };

        it('should fetch points, calculate route, emit event, and return result', async () => {
            // Arrange
            mockPointsServiceClient.send.mockReturnValue(
                of(mockFindPointResponse),
            );
            mockedOptimizeRoute.mockReturnValue(mockCalculatedRoute);

            // Act
            const result =
                await service.calculateAndOptimizeRoute(mockAddRouteRequest);

            // Assert
            expect(mockPointsServiceClient.send).toHaveBeenCalledWith(
                { cmd: 'getPoint' },
                {
                    userId: mockAddRouteRequest.userId,
                    pointId: mockAddRouteRequest.pointsId,
                },
            );
            expect(mockedOptimizeRoute).toHaveBeenCalledWith(
                mockFindPointResponse.point.points,
                mockAddRouteRequest.pointId,
            );
            expect(mockPointsServiceClient.emit).toHaveBeenCalledWith(
                'route_calculated',
                {
                    userId: mockAddRouteRequest.userId,
                    pointsId: mockAddRouteRequest.pointsId,
                    calculatedRoute: mockCalculatedRoute,
                },
            );
            expect(result).toEqual(mockCalculatedRoute);
        });

        it('should throw BadRequestException for invalid IDs', async () => {
            const invalidPayload: AddRouteRequest = {
                pointsId: 'invalid',
                userId: 'invalid',
            };
            await expect(
                service.calculateAndOptimizeRoute(invalidPayload),
            ).rejects.toThrow(BadRequestException);
        });

        it('should throw NotFoundException if points-service returns no points', async () => {
            mockPointsServiceClient.send.mockReturnValue(of(null));
            await expect(
                service.calculateAndOptimizeRoute(mockAddRouteRequest),
            ).rejects.toThrow(NotFoundException);
        });

        it('should throw UnprocessableEntityException if there are less than 2 points', async () => {
            const singlePointResponse: FindPointResponse = {
                point: { _id: '...', points: [{ id: 1, x: 0, y: 0 }] },
            };
            mockPointsServiceClient.send.mockReturnValue(
                of(singlePointResponse),
            );
            await expect(
                service.calculateAndOptimizeRoute(mockAddRouteRequest),
            ).rejects.toThrow(UnprocessableEntityException);
        });
    });
});
