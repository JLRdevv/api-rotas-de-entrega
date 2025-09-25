import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RouteOptimizationService } from './route-optimization.service';
import type { AddRouteRequest } from '@app/contracts';
import { Get } from '@nestjs/common';

@Controller()
export class RouteOptimizationController {
    constructor(private readonly routeOptService: RouteOptimizationService) {}

    @MessagePattern({ cmd: 'addRoute' })
    handleRouteOptimizationRequest(@Payload() data: AddRouteRequest) {
        return this.routeOptService.calculateAndOptimizeRoute(data);
    }

    @MessagePattern({ cmd: 'health' })
    healthCheck(): boolean {
        return true;
    }

    @Get('health')
    healthHTTP(): boolean {
        return true;
    }
}
