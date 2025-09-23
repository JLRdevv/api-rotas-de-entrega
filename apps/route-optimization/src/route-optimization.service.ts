import {
    Injectable,
    Inject,
    BadRequestException,
    NotFoundException,
    UnprocessableEntityException,
    Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ObjectId } from 'mongodb';
import {
    type AddRouteRequest,
    type FindPointResponse,
    type OptimizedRouteResult,
} from '@app/contracts';
import { optimizeRoute, validateStartingPoint } from '@app/utils';
import { timeout } from 'rxjs';

@Injectable()
export class RouteOptimizationService {
    private readonly logger = new Logger(RouteOptimizationService.name);

    constructor(
        @Inject('POINTS_SERVICE') private pointsServiceClient: ClientProxy,
    ) {}

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
            throw new BadRequestException(
                'Invalid format for pointsId or userId',
            );
        }

        this.logger.log(`Fetching points from points-service...`);

        // Searching for points in the points service
        const findPointResponse = await this.pointsServiceClient
            .send<FindPointResponse>(
                { cmd: 'getPoint' },
                { userId: userId, pointId: pointsId },
            )
            .pipe(timeout(5000))
            .toPromise();

        const points = findPointResponse?.point?.points;

        if (!points || points.length === 0) {
            this.logger.warn(`Points with ID ${pointsId} not found.`);
            throw new NotFoundException(
                `Points with ID ${pointsId} not found.`,
            );
        }
        this.logger.log(`Successfully fetched ${points.length} points.`);

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
        this.logger.log('Optimizing the route...');
        const calculatedRoute = optimizeRoute(
            points,
            pointId || 'not specified',
        );
        this.logger.log('Route optimization finished.');

        // Emitting the calculated route
        this.logger.log("Emitting 'route_calculated' event to points-service.");
        this.pointsServiceClient.emit(
            { cmd: 'addRoute' },
            {
                userId,
                pointsId,
                calculatedRoute,
            },
        );

        return calculatedRoute;
    }
}
