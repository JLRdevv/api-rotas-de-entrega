import { Module } from '@nestjs/common';
import { RouteOptimizationController } from './route-optimization.controller';
import { RouteOptimizationService } from './route-optimization.service';

@Module({
    imports: [],
    controllers: [RouteOptimizationController],
    providers: [RouteOptimizationService],
})
export class RouteOptimizationModule {}
