import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { RpcException } from '@nestjs/microservices';
import { RoutesRepository } from '../repository/routes.repository';
import {
    DeleteRouteRequest,
    DeleteRouteResponse,
    HistoryRequest,
    HistoryResponse,
    Route,
    SaveHistory,
} from '@app/contracts';
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
                statusCode: 500,
                message: 'Failed to reach database',
            });
        }
    }

    async getHistory(data: HistoryRequest): Promise<HistoryResponse> {
        try {
            const result = await this.routesRepository.getHistory(data);

            const route: Route[] = result.map((route) => ({
                _id: route._id.toString(),
                results: {
                    optimizedRoute: route.optimizedRoute,
                    totalDistance: route.totalDistance,
                },
                date: route.createdAt.toISOString(),
                pointsId: route.pointsId.toString(),
            }));

            return { route };
        } catch {
            throw new RpcException({
                statusCode: 500,
                message: 'Failed to reach database',
            });
        }
    }

    async deleteRoute(data: DeleteRouteRequest): Promise<DeleteRouteResponse> {
        try {
            const route = await this.routesRepository.findById(
                new ObjectId(data.routeId),
            );

            if (
                !route ||
                !route.userId ||
                route.userId.toString() !== data.userId
            ) {
                throw new RpcException({
                    statusCode: 404,
                    message: `Route not found`,
                });
            }
            await this.routesRepository.delete(route._id);

            return { deleted: true };
        } catch (error) {
            if (error instanceof RpcException) throw error;
            throw new RpcException({
                statusCode: 500,
                message: 'Failed to reach database',
            });
        }
    }
}
