import {
    Injectable,
    Inject,
    BadRequestException,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ObjectId } from 'mongodb';
import {
    type AddRouteRequest,
    type FindPointResponse,
    type OptimizedRouteResult,
} from '@app/contracts';
import { optimizeRoute, validateStartingPoint } from '@app/utils';

@Injectable()
export class RouteOptimizationService {
    constructor(
        @Inject('POINTS_SERVICE') private pointsServiceClient: ClientProxy,
    ) {}

    public async calculateAndOptimizeRoute(
        payload: AddRouteRequest,
    ): Promise<OptimizedRouteResult> {
        const { pointsId, userId, pointId } = payload;

        if (
            !ObjectId.isValid(pointsId) ||
            (userId && !ObjectId.isValid(userId))
        ) {
            throw new BadRequestException(
                'Invalid format for pointsId or userId',
            );
        }

        // Searching for points in the points service
        const findPointResponse = await this.pointsServiceClient
            .send<FindPointResponse>(
                { cmd: 'getPoint' },
                { userId: userId, pointId: pointsId },
            )
            .toPromise();

        const points = findPointResponse?.point?.points;

        if (!points || points.length === 0) {
            throw new NotFoundException(
                `Points with ID ${pointsId} not found.`,
            );
        }
        if (points.length < 2) {
            throw new UnprocessableEntityException(
                'A route requires at least 2 points to be calculated.',
            );
        }

        if (pointId && !validateStartingPoint(points, pointId)) {
            throw new UnprocessableEntityException(
                `The provided start point with id "${pointId}" was not found in the list of points.`,
            );
        }

        // Optimizing the route
        const calculatedRoute = optimizeRoute(
            points,
            pointId || 'not specified',
        );

        // Emitting the calculated route
        this.pointsServiceClient.emit('route_calculated', {
            userId,
            pointsId,
            calculatedRoute,
        });

        return calculatedRoute;
    }
}
