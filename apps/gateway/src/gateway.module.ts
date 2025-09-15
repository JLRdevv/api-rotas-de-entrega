import { Module } from '@nestjs/common';
import { AppController } from './app/app.controller';
import { AuthController } from './auth/auth.controller';
import { PointsController } from './points/points.controller';
import { RoutesController } from './routes/routes.controller';
import { AuthModule } from './auth/auth.module';
import { PointsModule } from './points/points.module';
import { RoutesModule } from './routes/routes.module';
import { AppModule } from './app/app.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        GatewayModule,
        AuthModule,
        PointsModule,
        RoutesModule,
        AppModule,
        ConfigModule.forRoot({ isGlobal: true }),
    ],
    controllers: [
        AuthController,
        PointsController,
        RoutesController,
        AppController,
    ],
})
export class GatewayModule {}
