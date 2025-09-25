import { Module } from '@nestjs/common';
import { PointsController } from './points.controller';
import { PointsService } from './services/points.service';
import { PointsRepository } from './repository/points.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointEntity } from './entities/point.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { RouteEntity } from './entities/route.entity';
import { RoutesRepository } from './repository/routes.repository';
import { HistoryService } from './services/history.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                RMQ_URL: Joi.string().required(),
                HTTP_PORT: Joi.number().required(),
                MONGO_URL: Joi.string().required(),
            }),
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'mongodb',
                url: configService.getOrThrow<string>('MONGO_URL'),
                synchronize: true,
                entities: [PointEntity, RouteEntity],
            }),
        }),
        //LoggerModule,
        TypeOrmModule.forFeature([PointEntity, RouteEntity]),
    ],
    controllers: [PointsController],
    providers: [
        PointsRepository,
        RoutesRepository,
        PointsService,
        HistoryService,
    ],
    exports: [PointsService],
})
export class PointsModule {}
