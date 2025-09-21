import { Module } from '@nestjs/common';
import { PointsController } from './points.controller';
import { PointService } from './point.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointEntity } from './entities/point.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

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
                entities: [PointEntity],
            }),
        }),
        //LoggerModule,
        TypeOrmModule.forFeature([PointEntity]),
    ],
    controllers: [PointsController],
    providers: [PointService],
    exports: [PointService],
})
export class PointsModule {}
