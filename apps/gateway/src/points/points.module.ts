import { Module } from '@nestjs/common';
import { PointsController } from './points.controller';
import { PointsService } from './points.service';
import { PointClient } from './point.client';

@Module({
    controllers: [PointsController],
    providers: [PointsService, PointClient],
})
export class PointsModule {}
