import {
    ClientProxyFactory,
    Transport,
    ClientProxy,
} from '@nestjs/microservices';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, timeout } from 'rxjs';
import {
    AddPointsRequest,
    AddPointsResponse,
    Point,
    GetPointsResponse,
    GetPointsRequest,
    FindPointResponse,
    FindPointRequest,
    PatchPointsResponse,
    PatchPointsRequest,
    DeletePointsResponse,
    DeletePointResponse,
    deletePointRequest,
} from '@app/contracts';
import { handleRpcError } from '../helpers/rpc-error.util';

@Injectable()
export class PointClient {
    private client: ClientProxy;

    constructor(private configService: ConfigService) {
        this.client = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [this.configService.get<string>('RMQ_URL')!],
                queue: 'point-queue',
                queueOptions: { durable: true },
            },
        });
    }

    async addPoints(
        userId: string,
        points: Point[],
    ): Promise<AddPointsResponse> {
        try {
            return await firstValueFrom(
                this.client
                    .send<
                        AddPointsResponse,
                        AddPointsRequest
                    >({ cmd: 'addPoints' }, { userId, points })
                    .pipe(timeout(5000)),
            );
        } catch (error) {
            handleRpcError(error);
        }
    }

    async getPoints(userId: string): Promise<GetPointsResponse> {
        try {
            return await firstValueFrom(
                this.client
                    .send<
                        GetPointsResponse,
                        GetPointsRequest
                    >({ cmd: 'getPoints' }, { userId })
                    .pipe(timeout(5000)),
            );
        } catch (error) {
            handleRpcError(error);
        }
    }

    async getPoint(
        userId: string,
        pointId: string,
    ): Promise<FindPointResponse> {
        try {
            return await firstValueFrom(
                this.client
                    .send<
                        FindPointResponse,
                        FindPointRequest
                    >({ cmd: 'getPoint' }, { userId, pointId })
                    .pipe(timeout(5000)),
            );
        } catch (error) {
            handleRpcError(error);
        }
    }

    async patchPoints(
        userId: string,
        pointsId: string,
        points: Point[],
    ): Promise<PatchPointsResponse> {
        try {
            return await firstValueFrom(
                this.client
                    .send<
                        PatchPointsResponse,
                        PatchPointsRequest
                    >({ cmd: 'patchPoints' }, { userId, pointsId, points })
                    .pipe(timeout(5000)),
            );
        } catch (error) {
            handleRpcError(error);
        }
    }

    async deletePoints(
        userId: string,
        pointId: string,
    ): Promise<DeletePointsResponse> {
        try {
            return await firstValueFrom(
                this.client
                    .send<
                        DeletePointsResponse,
                        FindPointRequest
                    >({ cmd: 'deletePoints' }, { userId, pointId })
                    .pipe(timeout(5000)),
            );
        } catch (error) {
            handleRpcError(error);
        }
    }

    async deletePoint(
        userId: string,
        pointsId: string,
        pointId: number,
    ): Promise<DeletePointResponse> {
        try {
            return await firstValueFrom(
                this.client
                    .send<
                        DeletePointResponse,
                        deletePointRequest
                    >({ cmd: 'deletePoint' }, { userId, pointsId, pointId })
                    .pipe(timeout(5000)),
            );
        } catch (error) {
            handleRpcError(error);
        }
    }

    async healthCheck() {
        try {
            const result = await firstValueFrom(
                this.client.send({ cmd: 'health' }, {}).pipe(timeout(5000)),
            );
            return !!result;
        } catch (error) {
            return false;
        }
    }
}
