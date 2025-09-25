import { Module } from '@nestjs/common';
import { RouteOptimizationController } from './route-optimization.controller';
import { RouteOptimizationService } from './route-optimization.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggerModule } from '@app/common';
import * as Joi from 'joi';
import { RouteClient } from './route.client';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                RMQ_URL: Joi.string().required(),
            }),
        }),
        LoggerModule,
        ClientsModule.registerAsync([
            {
                name: 'POINTS_SERVICE',
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [configService.getOrThrow<string>('RMQ_URL')],
                        queue: 'points_queue',
                        queueOptions: {
                            durable: true,
                        },
                    },
                }),
            },
        ]),
    ],
    controllers: [RouteOptimizationController],
    providers: [RouteOptimizationService, RouteClient],
})
export class RouteOptimizationModule {}
