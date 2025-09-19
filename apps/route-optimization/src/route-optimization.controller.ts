import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RouteOptimizationService } from './route-optimization.service';

import type {
    AddRouteRequest,
    HistoryRequest,
    DeleteRouteRequest,
} from '@app/contracts';

@Controller()
export class RouteOptimizationController {
    constructor(private readonly routeOptService: RouteOptimizationService) {}

    @MessagePattern({ cmd: 'addRoute' })
    handleRouteOptimizationRequest(@Payload() data: AddRouteRequest) {
        console.log(`Message 'addRoute' received with payload:`, data);
        return this.routeOptService.calculateAndOptimizeRoute(data);
    }

    @MessagePattern({ cmd: 'getHistory' })
    handleGetHistory(@Payload() data: HistoryRequest) {
        return this.routeOptService.history(data.filters || {}, data.userId);
    }

    @MessagePattern({ cmd: 'deleteRoute' })
    handleDeleteRoute(@Payload() data: DeleteRouteRequest) {
        return this.routeOptService.deleteRoute(data.routeId, data.userId);
    }
}
