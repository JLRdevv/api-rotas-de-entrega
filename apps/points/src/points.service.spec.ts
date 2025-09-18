import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PointService } from './point.service';
import { PointEntity } from './entities/point.entity';

describe('UsersService', () => {
    let service: PointService;

    let repo: {
        findOne: jest.Mock;
        find: jest.Mock;
        create: jest.Mock;
        save: jest.Mock;
        delete: jest.Mock;
    };

    beforeEach(async () => {
        repo = {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PointService,
                { provide: getRepositoryToken(PointEntity), useValue: repo },
            ],
        }).compile();

        service = module.get(PointService);
    });

    describe('add', () => {
        it('should persist points if all are unique', async () => {
            const points = [
                { id: 3, x: 1, y: 1 },
                { id: 2, x: 2, y: 2 },
                { id: 1, x: 3, y: 3 },
            ];
            const fakeUserId = '68add69b7dc255b3b6b03f96';

            const saveResult = {
                id: { toString: () => 'objectId' },
                points,
                userId: fakeUserId,
            };

            repo.save.mockResolvedValue(saveResult);

            const result = await service.addPoints({
                userId: fakeUserId,
                points,
            });

            expect(result).toEqual({
                _id: 'objectId',
                points,
            });
            expect(repo.save).toHaveBeenCalledWith({
                userId: fakeUserId,
                points,
            });
        });

        it('should throw if points are not unique', async () => {
            const points = [
                { id: 1, x: 1, y: 1 },
                { id: 1, x: 2, y: 2 },
                { id: 1, x: 3, y: 3 },
            ];
            const fakeUserId = '68add69b7dc255b3b6b03f96';

            await expect(
                service.addPoints({ userId: fakeUserId, points }),
            ).rejects.toThrow('Points are not unique');
        });

        it('should throw InternalServerErrorException if db fails', async () => {
            const points = [
                { id: 1, x: 1, y: 1 },
                { id: 2, x: 2, y: 2 },
                { id: 3, x: 3, y: 3 },
            ];
            const fakeUserId = '68add69b7dc255b3b6b03f96';

            repo.save.mockRejectedValue(new Error('DB error'));

            await expect(
                service.addPoints({ userId: fakeUserId, points }),
            ).rejects.toThrow('Failed to reach database');

            expect(repo.save).toHaveBeenCalledWith({
                userId: fakeUserId,
                points,
            });
        });
    });

    describe('getPoints', () => {
        it('should return all points for a specific user', async () => {
            const fakeUserId = '68add69b7dc255b3b6b03f96';
            const points = [
                { id: 1, x: 1, y: 1 },
                { id: 2, x: 2, y: 2 },
                { id: 3, x: 3, y: 3 },
            ];
            const repoResult = [
                {
                    id: 'objectId',
                    userId: fakeUserId,
                    points,
                },
            ];

            repo.find.mockResolvedValue(repoResult);

            const result = await service.getPoints({ userId: fakeUserId });

            expect(repo.find).toHaveBeenCalledWith({
                where: { userId: fakeUserId },
            });
            expect(result).toEqual({
                userPoints: [
                    {
                        _id: 'objectId',
                        points,
                    },
                ],
            });
        });

        it('should return empty array if no points are found for the user', async () => {
            const fakeUserId = '68add69b7dc255b3b6b03f96';

            repo.find.mockResolvedValue([]);

            const result = await service.getPoints({ userId: fakeUserId });

            expect(repo.find).toHaveBeenCalledWith({
                where: { userId: fakeUserId },
            });
            expect(result).toEqual({ userPoints: [] });
        });

        it('should throw InternalServerErrorException if db fails', async () => {
            const fakeUserId = '68add69b7dc255b3b6b03f96';

            repo.find.mockRejectedValue(new Error('DB error'));

            await expect(
                service.getPoints({ userId: fakeUserId }),
            ).rejects.toThrow('Failed to reach database');

            expect(repo.find).toHaveBeenCalledWith({
                where: { userId: fakeUserId },
            });
        });
    });

    describe('getPoint', () => {
        it('should return a point by id', async () => {
            const fakePointId = '68add69b7dc255b3b6b03f96';
            const fakeUserId = '68add69b7dc255b3b6b03f97';
            const points = [
                { id: 1, x: 1, y: 1 },
                { id: 2, x: 2, y: 2 },
            ];
            const repoResult = {
                id: fakePointId,
                points,
            };

            repo.findOne.mockResolvedValue(repoResult);

            const result = await service.getPoint({
                userId: fakeUserId,
                pointId: fakePointId,
            });

            expect(repo.findOne).toHaveBeenCalledWith({
                where: { _id: fakePointId },
            });
            expect(result).toEqual({
                point: {
                    _id: fakePointId,
                    points,
                },
            });
        });

        it('should throw NotFoundException if point not found', async () => {
            const fakePointId = '68add69b7dc255b3b6b03f96';
            const fakeUserId = '68add69b7dc255b3b6b03f96';

            repo.findOne.mockResolvedValue(null);

            await expect(
                service.getPoint({
                    userId: fakeUserId,
                    pointId: fakePointId,
                }),
            ).rejects.toThrow(`Point not found with id ${fakePointId}`);

            expect(repo.findOne).toHaveBeenCalledWith({
                where: { _id: fakePointId },
            });
        });

        it('should throw InternalServerErrorException if db fails', async () => {
            const fakePointId = '68add69b7dc255b3b6b03f96';
            const fakeUserId = '68add69b7dc255b3b6b03f96';

            repo.findOne.mockRejectedValue(new Error('DB error'));

            await expect(
                service.getPoint({
                    userId: fakeUserId,
                    pointId: fakePointId,
                }),
            ).rejects.toThrow('Failed to reach database');

            expect(repo.findOne).toHaveBeenCalledWith({
                where: { _id: fakePointId },
            });
        });
    });

    describe('patchPoint', () => {
        it('should update points if they are unique', async () => {
            const fakePointsId = '68add69b7dc255b3b6b03f96';
            const fakeUserId = '68add69b7dc255b3b6b03f96';
            const bodyPoints = [
                { id: 1, x: 10, y: 10 },
                { id: 3, x: 3, y: 3 },
            ];

            const dbPoints = {
                id: fakePointsId,
                points: [
                    { id: 1, x: 1, y: 1 },
                    { id: 2, x: 2, y: 2 },
                ],
            };
            const expectedPointResult = [
                { id: 1, x: 10, y: 10 },
                { id: 2, x: 2, y: 2 },
                { id: 3, x: 3, y: 3 },
            ];
            const savedResult = {
                id: fakePointsId,
                points: expectedPointResult,
            };

            repo.findOne.mockResolvedValue(dbPoints);
            repo.save.mockResolvedValue(savedResult);

            const result = await service.patchPoint({
                userId: fakeUserId,
                pointsId: fakePointsId,
                points: bodyPoints,
            });

            expect(repo.findOne).toHaveBeenCalledWith({
                where: { _id: fakePointsId },
            });
            expect(repo.save).toHaveBeenCalledWith({
                ...dbPoints,
                points: expectedPointResult,
            });
            expect(result).toEqual({
                pointsId: fakePointsId,
                points: expectedPointResult,
            });
        });

        it('should throw NotFoundException if no points are found', async () => {
            const objectId = '68add69b7dc255b3b6b03f96';
            const fakeUserId = '68add69b7dc255b3b6b03f96';
            const bodyPoints = [];

            repo.findOne.mockResolvedValue(null);

            await expect(
                service.patchPoint({
                    userId: fakeUserId,
                    pointsId: objectId,
                    points: bodyPoints,
                }),
            ).rejects.toThrow('point not found');

            expect(repo.findOne).toHaveBeenCalledWith({
                where: { _id: objectId },
            });
        });

        it('should throw ConflictException if updated points are not unique', async () => {
            const objectId = '68add69b7dc255b3b6b03f96';
            const fakeUserId = '68add69b7dc255b3b6b03f96';
            const bodyPoints = [{ id: 1, x: 1, y: 1 }];
            const dbPoints = {
                id: objectId,
                points: [{ id: 2, x: 1, y: 1 }],
            };

            repo.findOne.mockResolvedValue(dbPoints);

            await expect(
                service.patchPoint({
                    userId: fakeUserId,
                    pointsId: objectId,
                    points: bodyPoints,
                }),
            ).rejects.toThrow('Points are not unique');

            expect(repo.findOne).toHaveBeenCalledWith({
                where: { _id: objectId },
            });
        });

        it('should throw InternalServerErrorException if db fails', async () => {
            const objectId = '68add69b7dc255b3b6b03f96';
            const fakeUserId = '68add69b7dc255b3b6b03f97';
            const bodyPoints = [{ id: 1, x: 1, y: 1 }];

            repo.findOne.mockRejectedValue(new Error('DB error'));

            await expect(
                service.patchPoint({
                    userId: fakeUserId,
                    pointsId: objectId,
                    points: bodyPoints,
                }),
            ).rejects.toThrow('Failed to reach database');

            expect(repo.findOne).toHaveBeenCalledWith({
                where: { _id: objectId },
            });
        });
    });

    describe('deletePoints', () => {
        it('should delete points if pointId exists', async () => {
            const fakePointsId = '68add69b7dc255b3b6b03f96';
            const fakeUserId = '68add69b7dc255b3b6b03f97';
            const dbPoint = { id: fakePointsId, points: [] };

            repo.findOne.mockResolvedValue(dbPoint);
            repo.delete.mockResolvedValue({ affected: 1 });

            const result = await service.deletePoints({
                userId: fakeUserId,
                pointId: fakePointsId,
            });

            expect(repo.findOne).toHaveBeenCalledWith({
                where: { _id: fakePointsId },
            });
            expect(repo.delete).toHaveBeenCalledWith({ id: fakePointsId });
            expect(result).toEqual({ deleted: true });
        });

        it('should throw NotFoundException if point does not exist', async () => {
            const fakePointsId = '68add69b7dc255b3b6b03f96';
            const fakeUserId = '68add69b7dc255b3b6b03f97';

            repo.findOne.mockResolvedValue(null);

            await expect(
                service.deletePoints({
                    userId: fakeUserId,
                    pointId: fakePointsId,
                }),
            ).rejects.toThrow('Points not found');

            expect(repo.findOne).toHaveBeenCalledWith({
                where: { _id: fakePointsId },
            });
            expect(repo.delete).not.toHaveBeenCalled();
        });

        it('should throw InternalServerErrorException if db fails', async () => {
            const fakePointsId = '68add69b7dc255b3b6b03f96';
            const fakeUserId = '68add69b7dc255b3b6b03f97';

            repo.findOne.mockRejectedValue(new Error('DB error'));

            await expect(
                service.deletePoints({
                    userId: fakeUserId,
                    pointId: fakePointsId,
                }),
            ).rejects.toThrow('Failed to reach database');

            expect(repo.findOne).toHaveBeenCalledWith({
                where: { _id: fakePointsId },
            });
        });
    });

    describe('deletePoint', () => {
        it('should delete a single point if pointsId and pointId exist', async () => {
            const fakePointsId = '68add69b7dc255b3b6b03f96';
            const fakeUserId = '68add69b7dc255b3b6b03f97';
            const pointId = 1;
            const points = [
                { id: 1, x: 1, y: 1 },
                { id: 2, x: 2, y: 2 },
            ];
            const dbPoints = {
                id: fakePointsId,
                points,
            };
            const expectedResult = {
                id: fakePointsId,
                points: [points[1]],
            };

            repo.findOne.mockResolvedValue(dbPoints);
            repo.save.mockResolvedValue(expectedResult);

            const result = await service.deletePoint({
                userId: fakeUserId,
                pointsId: fakePointsId,
                pointId,
            });

            expect(repo.findOne).toHaveBeenCalledWith({
                where: { _id: fakePointsId },
            });
            expect(repo.save).toHaveBeenCalledWith(expectedResult);
            expect(result).toEqual({
                pointsId: fakePointsId,
                points: expectedResult.points,
            });
        });

        it('should throw NotFoundException if points set is not found', async () => {
            const fakePointsId = '68add69b7dc255b3b6b03f96';
            const fakeUserId = '68add69b7dc255b3b6b03f97';

            repo.findOne.mockResolvedValue(null);

            await expect(
                service.deletePoint({
                    userId: fakeUserId,
                    pointsId: fakePointsId,
                    pointId: 1,
                }),
            ).rejects.toThrow('Points not found');

            expect(repo.findOne).toHaveBeenCalledWith({
                where: { _id: fakePointsId },
            });
        });

        it('should throw NotFoundException if points set is empty', async () => {
            const fakePointsId = '68add69b7dc255b3b6b03f96';
            const dbPoints = { id: fakePointsId, points: [] };
            const fakeUserId = '68add69b7dc255b3b6b03f97';

            repo.findOne.mockResolvedValue(dbPoints);

            await expect(
                service.deletePoint({
                    userId: fakeUserId,
                    pointsId: fakePointsId,
                    pointId: 1,
                }),
            ).rejects.toThrow('No points in point set');
        });

        it('should throw NotFoundException if specified point does not exist', async () => {
            const fakePointsId = '68add69b7dc255b3b6b03f96';
            const fakeUserId = '68add69b7dc255b3b6b03f97';
            const dbPoints = {
                id: fakePointsId,
                points: [{ id: 2, x: 1, y: 1 }],
            };

            repo.findOne.mockResolvedValue(dbPoints);

            await expect(
                service.deletePoint({
                    userId: fakeUserId,
                    pointsId: fakePointsId,
                    pointId: 1,
                }),
            ).rejects.toThrow('Specified point not found');
        });

        it('should throw InternalServerErrorException if db fails', async () => {
            const fakePointsId = '68add69b7dc255b3b6b03f96';
            const fakeUserId = '68add69b7dc255b3b6b03f97';

            repo.findOne.mockRejectedValue(new Error('DB error'));

            await expect(
                service.deletePoint({
                    userId: fakeUserId,
                    pointsId: fakePointsId,
                    pointId: 1,
                }),
            ).rejects.toThrow('Failed to reach database');
        });
    });
});
