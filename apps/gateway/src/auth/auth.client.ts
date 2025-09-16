import {
    ClientProxyFactory,
    Transport,
    ClientProxy,
} from '@nestjs/microservices';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AuthRequest, AuthResponse } from '@app/contracts';

@Injectable()
export class AuthClient {
    private client: ClientProxy;

    constructor(private configService: ConfigService) {
        this.client = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [this.configService.get<string>('RMQ_URL')!],
                queue: 'auth-queue',
                queueOptions: { durable: true },
            },
        });
    }

    async signup(email: string, password: string): Promise<AuthResponse> {
        return await firstValueFrom(
            this.client.send<AuthResponse, AuthRequest>(
                { cmd: 'signup' },
                { email, password },
            ),
        );
    }

    async login(email: string, password: string) {
        return await firstValueFrom(
            this.client.send<AuthResponse, AuthRequest>(
                { cmd: 'login' },
                { email, password },
            ),
        );
    }
}
