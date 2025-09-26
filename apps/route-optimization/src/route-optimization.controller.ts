import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RouteOptimizationService } from './route-optimization.service';
import type {
    AddRouteRequest,
    DeleteRouteRequest,
    HistoryRequest,
} from '@app/contracts';

@Controller()
export class RouteOptimizationController {
    constructor(private readonly routeOptService: RouteOptimizationService) {}

    @MessagePattern({ cmd: 'addRoute' })
    handleRouteOptimizationRequest(@Payload() data: AddRouteRequest) {
        return this.routeOptService.calculateAndOptimizeRoute(data);
    }

    @MessagePattern({ cmd: 'getHistory' })
    handleGetHistory(@Payload() data: HistoryRequest) {
        return this.routeOptService.getHistory(data);
    }

    @MessagePattern({ cmd: 'deleteRoute' })
    handleDeleteRoute(@Payload() data: DeleteRouteRequest) {
        return this.routeOptService.deleteRoute(data);
    }

    @MessagePattern({ cmd: 'health' })
    healthMessage(): boolean {
        return true;
    }

    @Get('health')
    healthHTTP(): boolean {
        return true;
    }
}
