import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PointsModule } from './points/points.module';
import { RoutesModule } from './routes/routes.module';
import { AppModule } from './app/app.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from '@app/common';
import * as Joi from 'joi';

@Module({
    imports: [
        ThrottlerModule.forRoot([
            {
                ttl: 60000,
                limit: 120,
            },
        ]),
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                HTTP_PORT: Joi.number().required(),
                RMQ_URL: Joi.string().required(),
                JWT_SECRET: Joi.string().required(),
                COOKIE_SECRET: Joi.string().required(),
            }),
        }),
        LoggerModule,
        AuthModule,
        PointsModule,
        RoutesModule,
        AppModule
    ],
})
export class GatewayModule {}
