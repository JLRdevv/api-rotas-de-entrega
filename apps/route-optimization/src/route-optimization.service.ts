import {
    Injectable,
    Inject,
    BadRequestException,
    NotFoundException,
    UnprocessableEntityException,
    InternalServerErrorException,
    HttpException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ObjectId } from 'mongodb';
import { SinglePoint, OptimizedRouteResult } from '@app/contracts';
import { optimizeRoute, validateStartingPoint } from '@app/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from './route.entity';
import { historyFilters } from '@app/contracts'
import { dateFiltering } from '@app/utils';


interface PointsPayload {
    points: SinglePoint[];
}

@Injectable()
export class RouteOptimizationService {
    constructor(
        // Injeção do cliente RabbitMQ para futura comunicação com o points-service
        @Inject('POINTS_SERVICE') private pointsServiceClient: ClientProxy,
        @InjectRepository(Route) private routeRepo: Repository<Route>,
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

        // // --- DESENVOLVIMENTO COM DADOS MOCADOS ---
        // console.log('--- DEVELOPMENT MODE: Using mocked data for points ---');
        // const mockedPointsPayload: PointsPayload = {
        //     points: [
        //         { id: 1, x: 0, y: 0 },
        //         { id: 2, x: 50, y: 30 },
        //         { id: 3, x: 10, y: 80 },
        //         { id: 4, x: 90, y: 20 },
        //         { id: 5, x: 45, y: 60 },
        //     ],
        // };
        // const pointsPayload = mockedPointsPayload;

// CHAMADA REAL VIA RABBITMQ  
    const pointsPayload: PointsPayload = await this.pointsServiceClient
        .send('get_points_by_id', { id: pointsId, userId })
        .toPromise() as PointsPayload;
        console.log('points received');
    

        if (!pointsPayload || !pointsPayload.points) {
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

        const numericRoute = calculatedRoute.optimizedRoute.filter(
            (point): point is number => typeof point === 'number',
        );

        const date = new Date();
        const routeEntity = this.routeRepo.create({
            results: {
                // Usa o array filtrado e seguro
                optimizedRoute: numericRoute, 
                totalDistance: calculatedRoute.totalDistance,
            },
            date,
            pointsId,
            userId,
        });

        console.log('Save route in Db');
        const savedEntity = await this.routeRepo.save(routeEntity);

        return savedEntity.results;
    }

    //Get history
    async history(queryParams: historyFilters, userId: string) {
        if (!ObjectId.isValid(userId))
            throw new BadRequestException('Invalid id');
        try {
            let filters: Record<string, any> = {
                userId,
            };
            if (queryParams.pointsId) {
                filters = {
                    ...filters,
                    pointsId: queryParams.pointsId,
                };
            }
            if (Array.isArray(queryParams.date)) {
                const { from, to } = dateFiltering(queryParams.date);
                filters = {
                    ...filters,
                    date: {
                        $gte: from,
                        $lte: to,
                    },
                };
            }
            const route = await this.routeRepo.find({
                where: filters,
                skip: queryParams.offset,
                take: queryParams.limit,
                order: { date: 'DESC' },
            });
            if (route.length == 0)
                throw new NotFoundException('No routes found');
            return route;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Failed to reach database');
        }
    }
    //Delete route
    public async deleteRoute(routeId: string, userId: string): Promise<{ deleted: boolean }> {
        if (!ObjectId.isValid(routeId) || !ObjectId.isValid(userId)) {
            throw new BadRequestException('Invalid id');
        }
        try {
            const route = await this.routeRepo.findOne({
                where: { _id: new ObjectId(routeId), userId },
            });

            if (!route) {
                throw new NotFoundException('Route not found');
            }

            await this.routeRepo.delete({ _id: new ObjectId(routeId) });
            return { deleted: true };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Failed to reach database');
        }
    }
}
