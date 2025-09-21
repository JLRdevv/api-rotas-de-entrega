import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PointService } from './points.service';
import { PointEntity } from './entities/point.entity';
import { ObjectId } from 'mongodb';

describe('UsersService', () => {
    let service: PointService;

    const fakePointsId = '68add69b7dc255b3b6b03f96';
    const fakePointsObjectId = new ObjectId(fakePointsId);
    const fakeUserId = '68add69b7dc255b3b6b03f96';
    const fakeUserObjectId = new ObjectId(fakeUserId);
    const points = [
        { id: 3, x: 1, y: 1 },
        { id: 2, x: 2, y: 2 },
        { id: 1, x: 3, y: 3 },
    ];

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
            const saveResult = {
                id: fakePointsObjectId,
                points,
                userId: fakeUserObjectId,
            };

            repo.save.mockResolvedValue(saveResult);

            const result = await service.addPoints({
                userId: fakeUserId,
                points,
            });

            expect(result).toEqual({
                _id: fakePointsId,
                points,
            });
            expect(repo.save).toHaveBeenCalledWith({
                userId: fakeUserObjectId,
                points,
            });
        });

        it('should throw if points are not unique', async () => {
            const duplicatedPoints = [
                { id: 1, x: 2, y: 2 },
                { id: 2, x: 2, y: 2 },
            ];

            await expect(
                service.addPoints({
                    userId: fakeUserId,
                    points: duplicatedPoints,
                }),
            ).rejects.toThrow('Points are not unique');
        });

        it('should throw InternalServerErrorException if db fails', async () => {
            repo.save.mockRejectedValue(new Error('DB error'));

            await expect(
                service.addPoints({ userId: fakeUserId, points }),
            ).rejects.toThrow('Failed to reach database');

            expect(repo.save).toHaveBeenCalledWith({
                userId: fakeUserObjectId,
                points,
            });
        });
    });

    describe('getPoints', () => {
        it('should return all points for a specific user', async () => {
            const repoResult = [
                {
                    id: fakePointsObjectId,
                    userId: fakeUserObjectId,
                    points,
                },
            ];

            repo.find.mockResolvedValue(repoResult);

            const result = await service.getPoints({ userId: fakeUserId });

            expect(repo.find).toHaveBeenCalledWith({
                where: { userId: fakeUserObjectId },
            });
            expect(result).toEqual({
                userPoints: [
                    {
                        _id: fakePointsId,
                        points,
                    },
                ],
            });
        });

        it('should return empty array if no points are found for the user', async () => {
            repo.find.mockResolvedValue([]);

            const result = await service.getPoints({ userId: fakeUserId });

            expect(repo.find).toHaveBeenCalledWith({
                where: { userId: fakeUserObjectId },
            });
            expect(result).toEqual({ userPoints: [] });
        });

        it('should throw InternalServerErrorException if db fails', async () => {
            repo.find.mockRejectedValue(new Error('DB error'));

            await expect(
                service.getPoints({ userId: fakeUserId }),
            ).rejects.toThrow('Failed to reach database');

            expect(repo.find).toHaveBeenCalledWith({
                where: { userId: fakeUserObjectId },
            });
        });
    });

    describe('getPoint', () => {
        it('should return a point by id', async () => {
            const points = [
                { id: 1, x: 1, y: 1 },
                { id: 2, x: 2, y: 2 },
            ];
            const repoResult = {
                id: fakePointsObjectId,
                points,
            };

            repo.findOne.mockResolvedValue(repoResult);

            const result = await service.getPoint({
                userId: fakeUserId,
                pointId: fakePointsId,
            });

            expect(repo.findOne).toHaveBeenCalledWith({
                where: { _id: fakePointsObjectId },
            });
            expect(result).toEqual({
                point: {
                    _id: fakePointsId,
                    points,
                },
            });
        });

        it('should throw NotFoundException if point not found', async () => {
            repo.findOne.mockResolvedValue(null);

            await expect(
                service.getPoint({
                    userId: fakeUserId,
                    pointId: fakePointsId,
                }),
            ).rejects.toThrow(`Point not found with id ${fakePointsId}`);

            expect(repo.findOne).toHaveBeenCalledWith({
                where: { _id: fakePointsObjectId },
            });
        });

        it('should throw InternalServerErrorException if db fails', async () => {
            repo.findOne.mockRejectedValue(new Error('DB error'));

            await expect(
                service.getPoint({
                    userId: fakeUserId,
                    pointId: fakePointsId,
                }),
            ).rejects.toThrow('Failed to reach database');

            expect(repo.findOne).toHaveBeenCalledWith({
                where: { _id: fakePointsObjectId },
            });
        });
    });

    describe('patchPoint', () => {
        it('should update points if they are unique', async () => {
            const bodyPoints = [
                { id: 1, x: 10, y: 10 },
                { id: 3, x: 3, y: 3 },
            ];

            const dbPoints = {
                id: fakePointsObjectId,
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
                id: fakePointsObjectId,
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
                where: { _id: fakePointsObjectId },
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
            const bodyPoints = [];

            repo.findOne.mockResolvedValue(null);

            await expect(
                service.patchPoint({
                    userId: fakeUserId,
                    pointsId: fakePointsId,
                    points: bodyPoints,
                }),
            ).rejects.toThrow('point not found');

            expect(repo.findOne).toHaveBeenCalledWith({
                where: { _id: fakePointsObjectId },
            });
        });

        it('should throw ConflictException if updated points are not unique', async () => {
            const bodyPoints = [{ id: 1, x: 1, y: 1 }];
            const dbPoints = {
                id: fakePointsObjectId,
                points: [{ id: 2, x: 1, y: 1 }],
            };

            repo.findOne.mockResolvedValue(dbPoints);

            await expect(
                service.patchPoint({
                    userId: fakeUserId,
                    pointsId: fakePointsId,
                    points: bodyPoints,
                }),
            ).rejects.toThrow('Points are not unique');

            expect(repo.findOne).toHaveBeenCalledWith({
                where: { _id: fakePointsObjectId },
            });
        });

        it('should throw InternalServerErrorException if db fails', async () => {
            const bodyPoints = [{ id: 1, x: 1, y: 1 }];

            repo.findOne.mockRejectedValue(new Error('DB error'));

            await expect(
                service.patchPoint({
                    userId: fakeUserId,
                    pointsId: fakePointsId,
                    points: bodyPoints,
                }),
            ).rejects.toThrow('Failed to reach database');

            expect(repo.findOne).toHaveBeenCalledWith({
                where: { _id: fakePointsObjectId },
            });
        });
    });

    describe('deletePoints', () => {
        it('should delete points if pointId exists', async () => {
            const dbPoint = { id: fakePointsId, points: [] };

            repo.findOne.mockResolvedValue(dbPoint);
            repo.delete.mockResolvedValue({ affected: 1 });

            const result = await service.deletePoints({
                userId: fakeUserId,
                pointId: fakePointsId,
            });

            expect(repo.findOne).toHaveBeenCalledWith({
                where: { _id: fakePointsObjectId },
            });
            expect(repo.delete).toHaveBeenCalledWith({
                id: fakePointsObjectId,
            });
            expect(result).toEqual({ deleted: true });
        });

        it('should throw NotFoundException if point does not exist', async () => {
            repo.findOne.mockResolvedValue(null);

            await expect(
                service.deletePoints({
                    userId: fakeUserId,
                    pointId: fakePointsId,
                }),
            ).rejects.toThrow('Points not found');

            expect(repo.findOne).toHaveBeenCalledWith({
                where: { _id: fakePointsObjectId },
            });
            expect(repo.delete).not.toHaveBeenCalled();
        });

        it('should throw InternalServerErrorException if db fails', async () => {
            repo.findOne.mockRejectedValue(new Error('DB error'));

            await expect(
                service.deletePoints({
                    userId: fakeUserId,
                    pointId: fakePointsId,
                }),
            ).rejects.toThrow('Failed to reach database');

            expect(repo.findOne).toHaveBeenCalledWith({
                where: { _id: fakePointsObjectId },
            });
        });
    });

    describe('deletePoint', () => {
        it('should delete a single point if pointsId and pointId exist', async () => {
            const pointId = 1;
            const points = [
                { id: 1, x: 1, y: 1 },
                { id: 2, x: 2, y: 2 },
            ];
            const dbPoints = {
                id: fakePointsObjectId,
                points,
            };
            const expectedResult = {
                id: fakePointsObjectId,
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
                where: { _id: fakePointsObjectId },
            });
            expect(repo.save).toHaveBeenCalledWith(expectedResult);
            expect(result).toEqual({
                pointsId: fakePointsId,
                points: expectedResult.points,
            });
        });

        it('should throw NotFoundException if points set is not found', async () => {
            repo.findOne.mockResolvedValue(null);

            await expect(
                service.deletePoint({
                    userId: fakeUserId,
                    pointsId: fakePointsId,
                    pointId: 1,
                }),
            ).rejects.toThrow('Points not found');

            expect(repo.findOne).toHaveBeenCalledWith({
                where: { _id: fakePointsObjectId },
            });
        });

        it('should throw NotFoundException if points set is empty', async () => {
            const dbPoints = { id: fakePointsObjectId, points: [] };

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
            const dbPoints = {
                id: fakePointsObjectId,
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
