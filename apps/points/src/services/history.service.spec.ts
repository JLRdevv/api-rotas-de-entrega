import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import { HistoryService } from './history.service';
import { RoutesRepository } from '../repository/routes.repository';
import { dateToString } from '@app/utils';

describe('HistoryService', () => {
    let service: HistoryService;

    const fakeRouteId = '68add69b7dc255b3b6b03f96';
    const fakeRouteObjectId = new ObjectId(fakeRouteId);
    const fakeUserId = '68add69b7dc255b3b6b03f97';
    const fakeUserObjectId = new ObjectId(fakeUserId);
    const fakePointsId = '68add69b7dc255b3b6b03f98';
    const fakePointsObjectId = new ObjectId(fakePointsId);

    let repo: {
        create: jest.Mock;
        getHistory: jest.Mock;
        findById: jest.Mock;
        delete: jest.Mock;
    };

    beforeEach(async () => {
        repo = {
            create: jest.fn(),
            getHistory: jest.fn(),
            findById: jest.fn(),
            delete: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HistoryService,
                {
                    provide: RoutesRepository,
                    useValue: repo,
                },
            ],
        }).compile();

        service = module.get<HistoryService>(HistoryService);
    });

    describe('save', () => {
        it('should persist a route successfully', async () => {
            repo.create.mockResolvedValue({});

            await service.save({
                pointsId: fakePointsId,
                userId: fakeUserId,
                optimizedRoute: [1, 2, 3],
                totalDistance: 100,
            });

            expect(repo.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    pointsId: fakePointsObjectId,
                    userId: fakeUserObjectId,
                    optimizedRoute: [1, 2, 3],
                    totalDistance: 100,
                    createdAt: expect.any(Date) as unknown as Date,
                }),
            );
        });

        it('should throw RpcException if db fails', async () => {
            repo.create.mockRejectedValue(new Error('DB error'));

            await expect(
                service.save({
                    pointsId: fakePointsId,
                    userId: fakeUserId,
                    optimizedRoute: [1, 2, 3],
                    totalDistance: 100,
                }),
            ).rejects.toThrow('Failed to reach database');
        });
    });

    describe('getHistory', () => {
        it('should return formatted history', async () => {
            const now = new Date();
            const repoResult = [
                {
                    _id: fakeRouteObjectId,
                    userId: fakeUserObjectId,
                    pointsId: fakePointsObjectId,
                    optimizedRoute: [1, 2, 3],
                    totalDistance: 200,
                    createdAt: now,
                },
            ];

            repo.getHistory.mockResolvedValue(repoResult);

            const result = await service.getHistory({ userId: fakeUserId });

            expect(repo.getHistory).toHaveBeenCalledWith({
                userId: fakeUserId,
            });
            expect(result).toEqual({
                route: [
                    {
                        _id: fakeRouteId,
                        results: {
                            optimizedRoute: [1, 2, 3],
                            totalDistance: 200,
                        },
                        date: dateToString(now),
                        pointsId: fakePointsId,
                    },
                ],
            });
        });

        it('should apply limit and offset filters', async () => {
            const now = new Date();
            const repoResult = [
                {
                    _id: fakeRouteObjectId,
                    userId: fakeUserObjectId,
                    pointsId: fakePointsObjectId,
                    optimizedRoute: [1, 2, 3],
                    totalDistance: 200,
                    createdAt: now,
                },
            ];

            repo.getHistory.mockResolvedValue(repoResult);

            const result = await service.getHistory({
                userId: fakeUserId,
                filters: { limit: 10, offset: 5 },
            });

            expect(repo.getHistory).toHaveBeenCalledWith({
                userId: fakeUserId,
                filters: { limit: 10, offset: 5 },
            });
            expect(result.route).toHaveLength(1);
            expect(result.route[0]._id).toBe(fakeRouteId);
        });

        it('should filter by date', async () => {
            const dateStart = new Date('2025-01-01T00:00:00.000Z');
            const dateEnd = new Date('2025-01-31T23:59:59.999Z');
            const repoResult = [
                {
                    _id: fakeRouteObjectId,
                    userId: fakeUserObjectId,
                    pointsId: fakePointsObjectId,
                    optimizedRoute: [4, 5, 6],
                    totalDistance: 150,
                    createdAt: new Date('2025-01-15T10:00:00.000Z'),
                },
            ];

            repo.getHistory.mockResolvedValue(repoResult);

            const result = await service.getHistory({
                userId: fakeUserId,
                filters: {
                    date: [dateStart.toISOString(), dateEnd.toISOString()],
                },
            });

            expect(repo.getHistory).toHaveBeenCalledWith({
                userId: fakeUserId,
                filters: {
                    date: [dateStart.toISOString(), dateEnd.toISOString()],
                },
            });
            expect(result.route[0].results.totalDistance).toBe(150);
        });

        it('should filter by pointsId', async () => {
            const now = new Date();
            const repoResult = [
                {
                    _id: fakeRouteObjectId,
                    userId: fakeUserObjectId,
                    pointsId: fakePointsObjectId,
                    optimizedRoute: [7, 8, 9],
                    totalDistance: 300,
                    createdAt: now,
                },
            ];

            repo.getHistory.mockResolvedValue(repoResult);

            const result = await service.getHistory({
                userId: fakeUserId,
                filters: { pointsId: fakePointsId },
            });

            expect(repo.getHistory).toHaveBeenCalledWith({
                userId: fakeUserId,
                filters: { pointsId: fakePointsId },
            });
            expect(result.route[0].pointsId).toBe(fakePointsId);
        });

        it('should return empty array if no history exists', async () => {
            repo.getHistory.mockResolvedValue([]);

            const result = await service.getHistory({ userId: fakeUserId });

            expect(result).toEqual({ route: [] });
        });

        it('should throw RpcException if db fails', async () => {
            repo.getHistory.mockRejectedValue(new Error('DB error'));

            await expect(
                service.getHistory({ userId: fakeUserId }),
            ).rejects.toThrow('Failed to reach database');
        });
    });

    describe('deleteRoute', () => {
        it('should delete a route if it exists', async () => {
            const dbRoute = {
                _id: fakeRouteObjectId,
                userId: fakeUserObjectId,
                pointsId: fakePointsObjectId,
                optimizedRoute: [1, 2, 3],
                totalDistance: 200,
                createdAt: new Date(),
            };

            repo.findById.mockResolvedValue(dbRoute);
            repo.delete.mockResolvedValue({ affected: 1 });

            const result = await service.deleteRoute({
                userId: fakeUserId,
                routeId: fakeRouteId,
            });

            expect(repo.findById).toHaveBeenCalledWith(fakeRouteObjectId);
            expect(repo.delete).toHaveBeenCalledWith(fakeRouteObjectId);
            expect(result).toEqual({ deleted: true });
        });

        it('should throw RpcException 404 if route not found', async () => {
            repo.findById.mockResolvedValue(null);

            await expect(
                service.deleteRoute({
                    userId: fakeUserId,
                    routeId: fakeRouteId,
                }),
            ).rejects.toThrow('Route not found');

            expect(repo.findById).toHaveBeenCalledWith(fakeRouteObjectId);
            expect(repo.delete).not.toHaveBeenCalled();
        });

        it('should throw RpcException 500 if db fails', async () => {
            repo.findById.mockRejectedValue(new Error('DB error'));

            await expect(
                service.deleteRoute({
                    userId: fakeUserId,
                    routeId: fakeRouteId,
                }),
            ).rejects.toThrow('Failed to reach database');
        });
    });
});
