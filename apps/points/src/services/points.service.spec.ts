import { Test, TestingModule } from '@nestjs/testing';
import { PointsService } from './points.service';
import { PointsRepository } from '../repository/points.repository';
import { ObjectId } from 'mongodb';

describe('UsersService', () => {
    let service: PointsService;

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
        findById: jest.Mock;
        findByUser: jest.Mock;
        create: jest.Mock;
        update: jest.Mock;
        delete: jest.Mock;
    };

    beforeEach(async () => {
        repo = {
            findById: jest.fn(),
            findByUser: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PointsService,
                {
                    provide: PointsRepository,
                    useValue: repo,
                },
            ],
        }).compile();

        service = module.get<PointsService>(PointsService);
    });

    describe('add', () => {
        it('should persist points if all are unique', async () => {
            const saveResult = {
                _id: fakePointsObjectId,
                points,
                userId: fakeUserObjectId,
            };

            repo.create.mockResolvedValue(saveResult);

            const result = await service.addPoints({
                userId: fakeUserId,
                points,
            });

            expect(result).toEqual({
                _id: fakePointsId,
                points,
            });
            expect(repo.create).toHaveBeenCalledWith({
                _id: undefined,
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

        it('should throw RcpException if db fails', async () => {
            repo.create.mockRejectedValue(new Error('DB error'));

            await expect(
                service.addPoints({ userId: fakeUserId, points }),
            ).rejects.toThrow('Failed to reach database');

            expect(repo.create).toHaveBeenCalledWith({
                userId: fakeUserObjectId,
                points,
            });
        });
    });

    describe('getPoints', () => {
        it('should return all points for a specific user', async () => {
            const repoResult = [
                {
                    _id: fakePointsObjectId,
                    userId: fakeUserObjectId,
                    points,
                },
            ];

            repo.findByUser.mockResolvedValue(repoResult);

            const result = await service.getPoints({ userId: fakeUserId });

            expect(repo.findByUser).toHaveBeenCalledWith(fakeUserObjectId);
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
            repo.findByUser.mockResolvedValue([]);

            const result = await service.getPoints({ userId: fakeUserId });

            expect(repo.findByUser).toHaveBeenCalledWith(fakeUserObjectId);
            expect(result).toEqual({ userPoints: [] });
        });

        it('should throw RcpException if db fails', async () => {
            repo.findByUser.mockRejectedValue(new Error('DB error'));

            await expect(
                service.getPoints({ userId: fakeUserId }),
            ).rejects.toThrow('Failed to reach database');

            expect(repo.findByUser).toHaveBeenCalledWith(fakeUserObjectId);
        });
    });

    describe('getPoint', () => {
        it('should return a point by id', async () => {
            const points = [
                { id: 1, x: 1, y: 1 },
                { id: 2, x: 2, y: 2 },
            ];
            const repoResult = {
                _id: fakePointsObjectId,
                points,
            };

            repo.findById.mockResolvedValue(repoResult);

            const result = await service.getPoint({
                userId: fakeUserId,
                pointId: fakePointsId,
            });

            expect(repo.findById).toHaveBeenCalledWith(fakePointsObjectId);
            expect(result).toEqual({
                point: {
                    _id: fakePointsId,
                    points,
                },
            });
        });

        it('should throw NotFoundException if point not found', async () => {
            repo.findById.mockResolvedValue(null);

            await expect(
                service.getPoint({
                    userId: fakeUserId,
                    pointId: fakePointsId,
                }),
            ).rejects.toThrow(`Point not found with id ${fakePointsId}`);

            expect(repo.findById).toHaveBeenCalledWith(fakePointsObjectId);
        });

        it('should throw RcpException if db fails', async () => {
            repo.findById.mockRejectedValue(new Error('DB error'));

            await expect(
                service.getPoint({
                    userId: fakeUserId,
                    pointId: fakePointsId,
                }),
            ).rejects.toThrow('Failed to reach database');

            expect(repo.findById).toHaveBeenCalledWith(fakePointsObjectId);
        });
    });

    describe('patchPoint', () => {
        it('should update points if they are unique', async () => {
            const bodyPoints = [
                { id: 1, x: 10, y: 10 },
                { id: 3, x: 3, y: 3 },
            ];

            const dbPoints = {
                _id: fakePointsObjectId,
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
                _id: fakePointsObjectId,
                points: expectedPointResult,
            };

            repo.findById.mockResolvedValue(dbPoints);
            repo.update.mockResolvedValue(savedResult);

            const result = await service.patchPoint({
                userId: fakeUserId,
                pointsId: fakePointsId,
                points: bodyPoints,
            });

            expect(repo.findById).toHaveBeenCalledWith(fakePointsObjectId);
            expect(repo.update).toHaveBeenCalledWith(dbPoints._id, dbPoints);
            expect(result).toEqual({
                pointsId: fakePointsId,
                points: expectedPointResult,
            });
        });

        it('should throw NotFoundException if no points are found', async () => {
            const bodyPoints = [];

            repo.findById.mockResolvedValue(null);

            await expect(
                service.patchPoint({
                    userId: fakeUserId,
                    pointsId: fakePointsId,
                    points: bodyPoints,
                }),
            ).rejects.toThrow('point not found');

            expect(repo.findById).toHaveBeenCalledWith(fakePointsObjectId);
        });

        it('should throw ConflictException if updated points are not unique', async () => {
            const bodyPoints = [{ id: 1, x: 1, y: 1 }];
            const dbPoints = {
                _id: fakePointsObjectId,
                points: [{ id: 2, x: 1, y: 1 }],
            };

            repo.findById.mockResolvedValue(dbPoints);

            await expect(
                service.patchPoint({
                    userId: fakeUserId,
                    pointsId: fakePointsId,
                    points: bodyPoints,
                }),
            ).rejects.toThrow('Points are not unique');

            expect(repo.findById).toHaveBeenCalledWith(fakePointsObjectId);
        });

        it('should throw RcpException if db fails', async () => {
            const bodyPoints = [{ id: 1, x: 1, y: 1 }];

            repo.findById.mockRejectedValue(new Error('DB error'));

            await expect(
                service.patchPoint({
                    userId: fakeUserId,
                    pointsId: fakePointsId,
                    points: bodyPoints,
                }),
            ).rejects.toThrow('Failed to reach database');

            expect(repo.findById).toHaveBeenCalledWith(fakePointsObjectId);
        });
    });

    describe('deletePoints', () => {
        it('should delete points if pointId exists', async () => {
            const dbPoint = { _id: fakePointsObjectId, points: [] };

            repo.findById.mockResolvedValue(dbPoint);
            repo.delete.mockResolvedValue({ affected: 1 });

            const result = await service.deletePoints({
                userId: fakeUserId,
                pointId: fakePointsId,
            });

            expect(repo.findById).toHaveBeenCalledWith(fakePointsObjectId);
            expect(repo.delete).toHaveBeenCalledWith(fakePointsObjectId);
            expect(result).toEqual({ deleted: true });
        });

        it('should throw NotFoundException if point does not exist', async () => {
            repo.findById.mockResolvedValue(null);

            await expect(
                service.deletePoints({
                    userId: fakeUserId,
                    pointId: fakePointsId,
                }),
            ).rejects.toThrow('Points not found');

            expect(repo.findById).toHaveBeenCalledWith(fakePointsObjectId);
            expect(repo.delete).not.toHaveBeenCalled();
        });

        it('should throw RcpException if db fails', async () => {
            repo.findById.mockRejectedValue(new Error('DB error'));

            await expect(
                service.deletePoints({
                    userId: fakeUserId,
                    pointId: fakePointsId,
                }),
            ).rejects.toThrow('Failed to reach database');

            expect(repo.findById).toHaveBeenCalledWith(fakePointsObjectId);
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
                _id: fakePointsObjectId,
                points,
            };
            const expectedResult = {
                _id: fakePointsObjectId,
                points: [points[1]],
            };

            repo.findById.mockResolvedValue(dbPoints);
            repo.update.mockResolvedValue(expectedResult);

            const result = await service.deletePoint({
                userId: fakeUserId,
                pointsId: fakePointsId,
                pointId,
            });

            expect(repo.findById).toHaveBeenCalledWith(fakePointsObjectId);
            expect(repo.update).toHaveBeenCalledWith(
                dbPoints._id,
                expectedResult,
            );
            expect(result).toEqual({
                pointsId: fakePointsId,
                points: expectedResult.points,
            });
        });

        it('should throw NotFoundException if points set is not found', async () => {
            repo.findById.mockResolvedValue(null);

            await expect(
                service.deletePoint({
                    userId: fakeUserId,
                    pointsId: fakePointsId,
                    pointId: 1,
                }),
            ).rejects.toThrow('Points not found');

            expect(repo.findById).toHaveBeenCalledWith(fakePointsObjectId);
        });

        it('should throw NotFoundException if points set is empty', async () => {
            const dbPoints = { _id: fakePointsObjectId, points: [] };

            repo.findById.mockResolvedValue(dbPoints);

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
                _id: fakePointsObjectId,
                points: [{ id: 2, x: 1, y: 1 }],
            };

            repo.findById.mockResolvedValue(dbPoints);

            await expect(
                service.deletePoint({
                    userId: fakeUserId,
                    pointsId: fakePointsId,
                    pointId: 1,
                }),
            ).rejects.toThrow('Specified point not found');
        });

        it('should throw RcpException if db fails', async () => {
            repo.findById.mockRejectedValue(new Error('DB error'));

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
