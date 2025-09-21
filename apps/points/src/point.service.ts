import {
    Injectable,
    NotFoundException,
    ConflictException,
    HttpException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { PointEntity } from './entities/point.entity';
import { Point } from './interfaces/point.interface';
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
} from './utils/points.util';
import { ObjectId } from 'mongodb';

@Injectable()
export class PointService {
    constructor(
        @InjectRepository(PointEntity)
        private readonly pointsRepository: MongoRepository<PointEntity>,
    ) {}

    async addPoints({
        userId,
        points,
    }: AddPointsRequest): Promise<AddPointsResponse> {
        try {
            if (!validatePointsUniqueness(points))
                throw new ConflictException('Points are not unique');
            points = sortIds(points);
            const result = await this.pointsRepository.save({ userId, points });

            return {
                _id: result.id.toString(),
                points: result.points,
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Failed to reach database');
        }
    }

    async getPoints(data: GetPointsRequest): Promise<GetPointsResponse> {
        try {
            const result = await this.pointsRepository.find({
                where: { userId: data.userId },
            });

            const response = result.map((point) => ({
                _id: point.id.toString(),
                points: point.points,
            }));

            return { userPoints: response };
        } catch {
            throw new InternalServerErrorException('Failed to reach database');
        }
    }

    async getPoint(data: FindPointRequest): Promise<FindPointResponse> {
        try {
            const result = await this.pointsRepository.findOne({
                where: { _id: new ObjectId(data.pointId) },
            });

            if (!result) {
                throw new NotFoundException(
                    `Point not found with id ${data.pointId}`,
                );
            }

            return {
                point: {
                    _id: result.id.toString(),
                    points: result.points,
                },
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Failed to reach database');
        }
    }

    async patchPoint(data: PatchPointsRequest): Promise<PatchPointsResponse> {
        try {
            const dbPoints = await this.pointsRepository.findOne({
                where: { _id: new ObjectId(data.pointsId) },
            });
            if (!dbPoints) throw new NotFoundException('point not found');

            const newPoints: Point[] = updatePoints(
                data.points,
                dbPoints.points,
            );
            if (!validatePointsUniqueness(newPoints))
                throw new ConflictException('Points are not unique');

            dbPoints.points = newPoints;
            const result = await this.pointsRepository.save(dbPoints);

            return {
                pointsId: result.id.toString(),
                points: result.points,
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Failed to reach database');
        }
    }

    async deletePoints(data: FindPointRequest): Promise<DeletePointsResponse> {
        try {
            const point = await this.pointsRepository.findOne({
                where: { _id: new ObjectId(data.pointId) },
            });

            if (!point) throw new NotFoundException('Points not found');
            await this.pointsRepository.delete({ id: point.id });

            return { deleted: true };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Failed to reach database');
        }
    }

    async deletePoint(data: DeletePointRequest): Promise<DeletePointResponse> {
        try {
            const point = await this.pointsRepository.findOne({
                where: { _id: new ObjectId(data.pointsId) },
            });

            if (!point) throw new NotFoundException('Points not found');

            if (point.points.length == 0)
                throw new NotFoundException('No points in point set');

            const updatedPoints = point.points.filter(
                (value) => value.id != data.pointId,
            );

            if (updatedPoints.length == point.points.length)
                throw new NotFoundException('Specified point not found');

            point.points = updatedPoints;
            const result = await this.pointsRepository.save(point);
            return {
                pointsId: result.id.toString(),
                points: result.points,
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Failed to reach database');
        }
    }
}
