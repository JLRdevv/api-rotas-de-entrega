import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { AuthModule } from './auth/auth.module';
import { PointsModule } from './points/points.module';
import { RoutesModule } from './routes/routes.module';

@Module({
  imports: [GatewayModule, AuthModule, PointsModule, RoutesModule],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
