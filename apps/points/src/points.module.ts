import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PointsController } from './points.controller';
import { PointService } from './point.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointEntity } from './entities/point.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'mongodb',
                url: configService.getOrThrow<string>('MONGO_URL'),
                synchronize: true,
                entities: [PointEntity],
            }),
        }),
        //LoggerModule,
        TypeOrmModule.forFeature([PointEntity]),
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
                    },
                }),
            },
        ]),
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                RMQ_URL: Joi.string().required(),
                HTTP_PORT: Joi.number().required(),
                MONGO_URL: Joi.string().required(),
            }),
        }),
    ],
    controllers: [PointsController],
    providers: [PointService],
    exports: [PointService],
})
export class PointsModule {}
