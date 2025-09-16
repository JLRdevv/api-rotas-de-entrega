import {
    ClientProxyFactory,
    Transport,
    ClientProxy,
} from '@nestjs/microservices';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, timeout } from 'rxjs';
import {
    AddRouteRequest,
    AddRouteRequestWithStartPoint,
    AddRouteResponse,
    DeleteRouteRequest,
    DeleteRouteResponse,
    historyFilters,
    HistoryRequest,
    HistoryResponse,
} from '@app/contracts';
import { handleRpcError } from '../helpers/rpc-error.util';

@Injectable()
export class RouteClient {
    private client: ClientProxy;

    constructor(private configService: ConfigService) {
        this.client = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [this.configService.get<string>('RMQ_URL')!],
                queue: 'routes-queue',
                queueOptions: { durable: true },
            },
        });
    }

    async addRoute(
        pointsId: string,
        userId: string,
    ): Promise<AddRouteResponse> {
        try {
            return await firstValueFrom(
                this.client
                    .send<
                        AddRouteResponse,
                        AddRouteRequest
                    >({ cmd: 'addRoute' }, { pointsId, userId })
                    .pipe(timeout(5000)),
            );
        } catch (error) {
            handleRpcError(error);
        }
    }

    async addRouteWithStartingPoint(
        pointsId: string,
        userId: string,
        pointId: number,
    ): Promise<AddRouteResponse> {
        try {
            return await firstValueFrom(
                this.client
                    .send<
                        AddRouteResponse,
                        AddRouteRequestWithStartPoint
                    >({ cmd: 'addRoute' }, { pointsId, userId, pointId })
                    .pipe(timeout(5000)),
            );
        } catch (error) {
            handleRpcError(error);
        }
    }

    async getHistory(
        userId: string,
        filters: historyFilters = {},
    ): Promise<HistoryResponse> {
        try {
            return await firstValueFrom(
                this.client
                    .send<
                        HistoryResponse,
                        HistoryRequest
                    >({ cmd: 'getHistory' }, { userId, filters })
                    .pipe(timeout(5000)),
            );
        } catch (error) {
            handleRpcError(error);
        }
    }

    async deleteRoute(
        userId: string,
        routeId: string,
    ): Promise<DeleteRouteResponse> {
        try {
            return await firstValueFrom(
                this.client
                    .send<
                        DeleteRouteResponse,
                        DeleteRouteRequest
                    >({ cmd: 'deleteRoute' }, { userId, routeId })
                    .pipe(timeout(5000)),
            );
        } catch (error) {
            handleRpcError(error);
        }
    }
}
