import { Module } from '@nestjs/common';
import { PointsControllerController } from './points-controller.controller';

@Module({
  controllers: [PointsControllerController]
})
export class PointsModule {}
