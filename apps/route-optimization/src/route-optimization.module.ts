import { Module } from '@nestjs/common';
import { RouteOptimizationController } from './route-optimization.controller';
import { RouteOptimizationService } from './route-optimization.service';
import { ConfigModule } from '@nestjs/config';
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
    ],
    controllers: [RouteOptimizationController],
    providers: [RouteOptimizationService, RouteClient],
})
export class RouteOptimizationModule {}
