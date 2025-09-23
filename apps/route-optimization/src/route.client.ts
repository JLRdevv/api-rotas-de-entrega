import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    ClientProxy,
    ClientProxyFactory,
    Transport,
} from '@nestjs/microservices';
import {
    FindPointResponse,
    OptimizedRouteResult,
    HistoryRequest,
    HistoryResponse,
    DeleteRouteRequest,
    DeleteRouteResponse,
} from '@app/contracts';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class RouteClient {
    private readonly pointsQueueClient: ClientProxy;
    private readonly routesQueueClient: ClientProxy;

    constructor(private readonly configService: ConfigService) {
        const rmqUrl = this.configService.getOrThrow<string>('RMQ_URL');
        const commonOptions = {
            urls: [rmqUrl],
            queueOptions: {
                durable: true,
            },
        };

        this.pointsQueueClient = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                ...commonOptions,
                queue: 'point-queue',
            },
        });

        this.routesQueueClient = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                ...commonOptions,
                queue: 'routes-queue',
            },
        });
    }

    async getPoint(
        userId: string,
        pointId: string,
    ): Promise<FindPointResponse> {
        const response = await firstValueFrom(
            this.pointsQueueClient
                .send<FindPointResponse>(
                    { cmd: 'getPoint' },
                    { userId, pointId },
                )
                .pipe(timeout(5000)),
        );
        if (!response) {
            throw new NotFoundException(`Points with ID ${pointId} not found.`);
        }
        return response;
    }

    emitRouteCalculated(payload: {
        userId: string;
        pointsId: string;
        calculatedRoute: OptimizedRouteResult;
    }): void {
        this.pointsQueueClient.emit('route_calculated', payload);
    }

    async getHistory(payload: HistoryRequest): Promise<HistoryResponse> {
        const response = await firstValueFrom(
            this.routesQueueClient
                .send<HistoryResponse>({ cmd: 'getHistory' }, payload)
                .pipe(timeout(5000)),
        );
        return response;
    }

    async deleteRoute(
        payload: DeleteRouteRequest,
    ): Promise<DeleteRouteResponse> {
        const response = await firstValueFrom(
            this.routesQueueClient
                .send<DeleteRouteResponse>({ cmd: 'deleteRoute' }, payload)
                .pipe(timeout(5000)),
        );
        return response;
    }
}
