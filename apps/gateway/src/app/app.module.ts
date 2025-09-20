import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { PointsModule } from '../points/points.module';
import { RoutesModule } from '../routes/routes.module';

@Module({
    imports: [AuthModule, PointsModule, RoutesModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
