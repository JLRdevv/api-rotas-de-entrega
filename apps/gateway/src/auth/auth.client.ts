import {
    ClientProxyFactory,
    Transport,
    ClientProxy,
} from '@nestjs/microservices';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, timeout } from 'rxjs';
import { AuthRequest, AuthResponse } from '@app/contracts';
import { handleRpcError } from '../helpers/rpc-error.util';

@Injectable()
export class AuthClient {
    private client: ClientProxy;
    constructor(private configService: ConfigService) {
        this.client = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [this.configService.get<string>('RMQ_URL')!],
                queue: 'auth_queue',
                queueOptions: { durable: true },
            },
        });
    }

    async signup(email: string, password: string): Promise<AuthResponse> {
        try {
            return await firstValueFrom(
                this.client
                    .send<
                        AuthResponse,
                        AuthRequest
                    >({ cmd: 'signup' }, { email, password })
                    .pipe(timeout(5000)),
            );
        } catch (error) {
            handleRpcError(error);
        }
    }

    async login(email: string, password: string): Promise<AuthResponse> {
        try {
            return await firstValueFrom(
                this.client
                    .send<
                        AuthResponse,
                        AuthRequest
                    >({ cmd: 'login' }, { email, password })
                    .pipe(timeout(5000)),
            );
        } catch (error) {
            handleRpcError(error);
        }
    }

    async whoami(userId: string) {
        try {
            return await firstValueFrom(
                this.client
                    .send({ cmd: 'whoami' }, { userId })
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
