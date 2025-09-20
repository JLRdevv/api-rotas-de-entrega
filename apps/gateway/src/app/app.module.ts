import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
<<<<<<< HEAD

@Module({
=======
import { AuthModule } from '../auth/auth.module';
import { PointsModule } from '../points/points.module';
import { RoutesModule } from '../routes/routes.module';

@Module({
    imports: [AuthModule, PointsModule, RoutesModule],
>>>>>>> b41ea1c689d2bb8d829689d413cba67e9d723728
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
