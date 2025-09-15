import {
    ClientProxyFactory,
    Transport,
    ClientProxy,
} from '@nestjs/microservices';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
}
