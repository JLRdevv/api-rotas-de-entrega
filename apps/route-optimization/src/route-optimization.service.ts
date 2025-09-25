import { Injectable, Logger } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { RpcException } from '@nestjs/microservices';
import {
    type AddRouteRequest,
    type OptimizedRouteResult,
} from '@app/contracts';
import { optimizeRoute, validateStartingPoint } from '@app/utils';
import { RouteClient } from './route.client';

@Injectable()
export class RouteOptimizationService {
    private readonly logger = new Logger(RouteOptimizationService.name);

    constructor(private readonly routeClient: RouteClient) {}

    public async calculateAndOptimizeRoute(
        payload: AddRouteRequest,
    ): Promise<OptimizedRouteResult> {
        this.logger.log(
            `Starting route calculation for pointsId: ${payload.pointsId}`,
        );
        const { pointsId, userId, pointId } = payload;

        if (
            !ObjectId.isValid(pointsId) ||
            (userId && !ObjectId.isValid(userId))
        ) {
            this.logger.warn(`Invalid ID format received: ${pointsId}`);
            throw new RpcException({
                statusCode: 400,
                message: 'Invalid format for pointsId or userId',
            });
        }

        this.logger.log(`Fetching points from points-service...`);
        const findPointResponse = await this.routeClient.getPoint(
            userId,
            pointsId,
        );

        const points = findPointResponse?.point?.points;

        if (!points || points.length === 0) {
            this.logger.warn(`Points with ID ${pointsId} not found.`);

            throw new RpcException({
                statusCode: 404,
                message: `Points with ID ${pointsId} not found.`,
            });
        }
        this.logger.log(`Successfully fetched ${points.length} points.`);

        if (points.length < 2) {
            this.logger.warn(
                `Attempted to calculate a route with ${points.length} points. At least 2 are required.`,
            );
            throw new RpcException({
                statusCode: 422,
                message: 'A route requires at least 2 points to be calculated.',
            });
        }

        if (pointId && !validateStartingPoint(points, pointId)) {
            this.logger.warn(
                `The provided start point with id "${pointId}" was not found in the list of points.`,
            );
            throw new RpcException({
                statusCode: 422,
                message: `The provided start point with id "${pointId}" was not found in the list of points.`,
            });
        }

        this.logger.log('Optimizing the route...');
        const calculatedRoute: OptimizedRouteResult = optimizeRoute(
            points,
            pointId || 'not specified',
        );
        this.logger.log('Route optimization finished.');
        this.logger.log("Emitting 'saveRoute' event to points-service.");
        this.routeClient.emitRouteCalculated({
            userId,
            pointsId,
            optimizedRoute: calculatedRoute.optimizedRoute.map(
                (point) => +point,
            ),
            totalDistance: calculatedRoute.totalDistance,
        });

        return calculatedRoute;
    }
}
