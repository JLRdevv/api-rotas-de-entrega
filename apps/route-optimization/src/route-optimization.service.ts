import {
    Injectable,
    Inject,
    BadRequestException,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ObjectId } from 'mongodb';

import { SinglePoint, OptimizedRouteResult } from '@app/contracts';

import { optimizeRoute, validateStartingPoint } from '@app/utils';

interface PointsPayload {
    points: SinglePoint[];
}

@Injectable()
export class RouteOptimizationService {
    constructor(
        // Injeção do cliente RabbitMQ para futura comunicação com o points-service
        @Inject('POINTS_SERVICE') private pointsServiceClient: ClientProxy,
    ) {}

    public async calculateAndOptimizeRoute(payload: {
        pointsId: string;
        userId: string;
        startingPointId?: string | number;
    }): Promise<OptimizedRouteResult> {
        const { pointsId, userId } = payload;
        let { startingPointId } = payload;

        if (!ObjectId.isValid(pointsId) || !ObjectId.isValid(userId)) {
            throw new BadRequestException(
                'Invalid id format for pointsId or userId',
            );
        }

        // --- DESENVOLVIMENTO COM DADOS MOCADOS ---
        console.log('--- DEVELOPMENT MODE: Using mocked data for points ---');
        const mockedPointsPayload: PointsPayload = {
            points: [
                { id: 1, x: 0, y: 0 },
                { id: 2, x: 50, y: 30 },
                { id: 3, x: 10, y: 80 },
                { id: 4, x: 90, y: 20 },
                { id: 5, x: 45, y: 60 },
            ],
        };
        const pointsPayload = mockedPointsPayload;

        /*
    // --- CHAMADA REAL VIA RABBITMQ (usar no futuro) ---
    const pointsPayload: PointsPayload = await this.pointsServiceClient
        .send('get_points_by_id', { id: pointsId, userId }) // O pattern 'get_points_by_id' é um exemplo
        .toPromise();
    */

        if (!pointsPayload) {
            throw new NotFoundException(
                `Points with ID ${pointsId} not found.`,
            );
        }
        if (pointsPayload.points.length <= 2) {
            throw new UnprocessableEntityException(
                'A set of points must contain at least 3 points to be optimized.',
            );
        }

        if (startingPointId) {
            if (!isNaN(Number(startingPointId))) {
                startingPointId = Number(startingPointId);
                if (
                    !validateStartingPoint(
                        pointsPayload.points,
                        startingPointId,
                    )
                ) {
                    throw new UnprocessableEntityException(
                        `The provided start point with id "${startingPointId}" was not found in the list of points.`,
                    );
                }
            }
        } else {
            startingPointId = 'not specified';
        }

        console.log('Calculating optimized route...');
        const calculatedRoute = optimizeRoute(
            pointsPayload.points,
            startingPointId,
        );
        console.log('Calculation finished.');

        return calculatedRoute;
    }
}
