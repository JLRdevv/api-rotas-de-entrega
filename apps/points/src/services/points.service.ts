import { Injectable, Logger } from '@nestjs/common';
import { Point } from '../interfaces/point.interface';
import {
    AddPointsRequest,
    AddPointsResponse,
    GetPointsResponse,
    GetPointsRequest,
    FindPointRequest,
    FindPointResponse,
    PatchPointsRequest,
    PatchPointsResponse,
    DeletePointRequest,
    DeletePointsResponse,
    DeletePointResponse,
} from '@app/contracts';
import {
    validatePointsUniqueness,
    sortIds,
    updatePoints,
} from '../utils/points.util';
import { ObjectId } from 'mongodb';
import { PointsRepository } from '../repository/points.repository';
import { PointEntity } from '../entities/point.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class PointsService {
    private readonly logger = new Logger(PointsService.name);

    constructor(private readonly pointsRepository: PointsRepository) {}

    async addPoints({
        userId,
        points,
    }: AddPointsRequest): Promise<AddPointsResponse> {
        try {
            if (!validatePointsUniqueness(points))
                throw new RpcException({
                    statusCode: 422, // Unprocessable Entity
                    message: 'Points are not unique',
                });
            points = sortIds(points);

            const newPoints = new PointEntity();
            newPoints.userId = new ObjectId(userId);
            newPoints.points = points;

            const result = await this.pointsRepository.create(newPoints);

            return {
                _id: result._id.toString(),
                points: result.points,
            };
        } catch (error) {
            if (error instanceof RpcException) throw error;
            throw new RpcException({
                statusCode: 500,
                message: 'Failed to reach database',
            });
        }
    }

    async getPoints(data: GetPointsRequest): Promise<GetPointsResponse> {
        try {
            const result = await this.pointsRepository.findByUser(
                new ObjectId(data.userId),
            );
            const response = result.map((point) => ({
                _id: point._id.toString(),
                points: point.points,
            }));

            return { userPoints: response };
        } catch {
            throw new RpcException({
                statusCode: 500,
                message: 'Failed to reach database',
            });
        }
    }

    async getPoint(data: FindPointRequest): Promise<FindPointResponse> {
        try {

            if (!ObjectId.isValid(data.pointId)) {
                throw new RpcException({
                    statusCode: 400,
                    message: `Invalid ID format received: ${data.pointId}`,
                });
            }

            const result = await this.pointsRepository.findById(
                new ObjectId(data.pointId),
            );

            if (!this.isValidPoint(result, data.userId)) {
                throw new RpcException({
                    statusCode: 404,
                    message: `Point not found with id ${data.pointId}`,
                });
            }

            return {
                point: {
                    _id: result._id.toString(),
                    points: result.points,
                },
            };
        } catch (error) {
            if (error instanceof RpcException) throw error;
            throw new RpcException({
                statusCode: 500,
                message: 'Failed to reach database',
            });
        }
    }

    async patchPoint(data: PatchPointsRequest): Promise<PatchPointsResponse> {
        try {
            if (!ObjectId.isValid(data.pointsId)) {
                throw new RpcException({
                    statusCode: 400,
                    message: `Invalid ID format received: ${data.pointsId}`,
                });
            }

            const dbPoints = await this.pointsRepository.findById(
                new ObjectId(data.pointsId),
            );
            if (!this.isValidPoint(dbPoints, data.userId)) {
                throw new RpcException({
                    statusCode: 404,
                    message: `point not found`,
                });
            }

            const newPoints: Point[] = updatePoints(
                data.points,
                dbPoints.points,
            );
            if (!validatePointsUniqueness(newPoints)) {
                throw new RpcException({
                    statusCode: 422, // Unprocessable Entity
                    message: 'Points are not unique',
                });
            }

            dbPoints.points = newPoints;
            const result = await this.pointsRepository.update(
                dbPoints._id,
                dbPoints,
            );

            return {
                pointsId: result._id.toString(),
                points: result.points,
            };
        } catch (error) {
            if (error instanceof RpcException) throw error;
            throw new RpcException({
                statusCode: 500,
                message: 'Failed to reach database',
            });
        }
    }

    async deletePoints(data: FindPointRequest): Promise<DeletePointsResponse> {
        try {
            const point = await this.pointsRepository.findById(
                new ObjectId(data.pointId),
            );

            if (!this.isValidPoint(point, data.userId)) {
                throw new RpcException({
                    statusCode: 404,
                    message: `Points not found`,
                });
            }
            await this.pointsRepository.delete(point._id);

            return { deleted: true };
        } catch (error) {
            if (error instanceof RpcException) throw error;
            throw new RpcException({
                statusCode: 500,
                message: 'Failed to reach database',
            });
        }
    }

    async deletePoint(data: DeletePointRequest): Promise<DeletePointResponse> {
        try {
            const point = await this.pointsRepository.findById(
                new ObjectId(data.pointsId),
            );

            if (!this.isValidPoint(point, data.userId)) {
                throw new RpcException({
                    statusCode: 404,
                    message: `Points not found`,
                });
            }

            if (point.points.length == 0)
                throw new RpcException({
                    statusCode: 404,
                    message: 'No points in point set',
                });

            const updatedPoints = point.points.filter(
                (value) => value.id != data.pointId,
            );

            if (updatedPoints.length == point.points.length)
                throw new RpcException({
                    statusCode: 404,
                    message: 'Specified point not found',
                });

            point.points = updatedPoints;
            const result = await this.pointsRepository.update(point._id, {
                points: point.points,
            });

            return {
                pointsId: result._id.toString(),
                points: result.points,
            };
        } catch (error) {
            if (error instanceof RpcException) throw error;
            throw new RpcException({
                statusCode: 500,
                message: 'Failed to reach database',
            });
        }
    }

    isValidPoint(point: PointEntity, userId: string): boolean {
        return !!point && !!point.userId && point.userId.toString() === userId;
    }
}
