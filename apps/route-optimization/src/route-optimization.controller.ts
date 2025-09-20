import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RouteOptimizationService } from './route-optimization.service';
import type { AddRouteRequest } from '@app/contracts';

@Controller()
export class RouteOptimizationController {
    constructor(private readonly routeOptService: RouteOptimizationService) {}

    @MessagePattern({ cmd: 'addRoute' })
    handleRouteOptimizationRequest(@Payload() data: AddRouteRequest) {
        console.log(`Message 'addRoute' received with payload:`, data);
        return this.routeOptService.calculateAndOptimizeRoute(data);
    }

    @MessagePattern({ cmd: 'health' })
    healthCheck(): boolean {
        return true;
    }
}
