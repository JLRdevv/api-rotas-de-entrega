import { Module } from '@nestjs/common';
import { AppController } from './app/app.controller';
import { AuthController } from './auth/auth.controller';
import { PointsController } from './points/points.controller';
import { RoutesController } from './routes/routes.controller';
import { AuthModule } from './auth/auth.module';
import { PointsModule } from './points/points.module';
import { RoutesModule } from './routes/routes.module';
import { AppModule } from './app/app.module';

@Module({
    imports: [GatewayModule, AuthModule, PointsModule, RoutesModule, AppModule],
    controllers: [
        AuthController,
        PointsController,
        RoutesController,
        AppController,
    ],
})
export class GatewayModule {}
