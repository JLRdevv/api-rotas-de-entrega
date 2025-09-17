import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointsController } from './points.controller';
import { PointService } from './point.service';
import { Point } from './entities/point.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Point])],
  controllers: [PointsController],
  providers: [PointService],
  exports: [PointService],
})
export class PointsModule {}
