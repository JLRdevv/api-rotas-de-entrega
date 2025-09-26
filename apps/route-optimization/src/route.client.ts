import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    ClientProxy,
    ClientProxyFactory,
    RpcException,
    Transport,
} from '@nestjs/microservices';
import {
    FindPointResponse,
    HistoryRequest,
    HistoryResponse,
    DeleteRouteRequest,
    DeleteRouteResponse,
    SaveHistory,
} from '@app/contracts';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class RouteClient {
    private readonly pointsQueueClient: ClientProxy;

    constructor(private readonly configService: ConfigService) {
        const rmqUrl = this.configService.getOrThrow<string>('RMQ_URL');

        this.pointsQueueClient = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [rmqUrl],
                queue: 'points_queue',
                queueOptions: {
                    durable: true,
                },
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
            throw new RpcException({
                statusCode: 404,
                message: `Points with ID ${pointId} not found.`,
            });
        }
        return response;
    }

    saveHistory(payload: SaveHistory): void {
        this.pointsQueueClient.emit<any, SaveHistory>(
            { cmd: 'saveHistory' },
            payload,
        );
    }

    async getHistory(payload: HistoryRequest): Promise<HistoryResponse> {
        return firstValueFrom(
            this.pointsQueueClient
                .send<
                    HistoryResponse,
                    HistoryRequest
                >({ cmd: 'getHistory' }, payload)
                .pipe(timeout(5000)),
        );
    }

    async deleteRoute(
        payload: DeleteRouteRequest,
    ): Promise<DeleteRouteResponse> {
        return firstValueFrom(
            this.pointsQueueClient
                .send<
                    DeleteRouteResponse,
                    DeleteRouteRequest
                >({ cmd: 'deleteRoute' }, payload)
                .pipe(timeout(5000)),
        );
    }
}
