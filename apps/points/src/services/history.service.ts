import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { RpcException } from '@nestjs/microservices';
import { RoutesRepository } from '../repository/routes.repository';
import { SaveHistory } from '@app/contracts';
import { RouteEntity } from '../entities/route.entity';

@Injectable()
export class HistoryService {
    constructor(private readonly routesRepository: RoutesRepository) {}

    async save({
        pointsId,
        userId,
        optimizedRoute,
        totalDistance,
    }: SaveHistory) {
        try {
            const route = Object.assign(new RouteEntity(), {
                pointsId: new ObjectId(pointsId),
                userId: new ObjectId(userId),
                optimizedRoute: optimizedRoute,
                totalDistance: totalDistance,
                createdAt: new Date(),
            });

            await this.routesRepository.create(route);
        } catch {
            throw new RpcException({
                status: 500,
                message: 'Failed to reach database',
            });
        }
    }
}
