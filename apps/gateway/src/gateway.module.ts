import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PointsModule } from './points/points.module';
import { RoutesModule } from './routes/routes.module';
import { AppModule } from './app/app.module';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        AuthModule,
        PointsModule,
        RoutesModule,
        AppModule,
    ],
})
export class GatewayModule {}
