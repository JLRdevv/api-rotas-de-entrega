import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RouteOptimizationService } from './route-optimization.service';

@Controller()
export class RouteOptimizationController {
    constructor(private readonly routeOptService: RouteOptimizationService) {}

    // Escuta mensagens no tópico 'optimize_route'
    @MessagePattern('optimize_route')
    handleRouteOptimizationRequest(
        // O decorator @Payload extrai os dados da mensagem do RabbitMQ
        @Payload()
        data: {
            pointsId: string;
            userId: string;
            startingPointId?: string | number;
        },
    ) {
        console.log(`Message 'optimize_route' received with payload:`, data);
        return this.routeOptService.calculateAndOptimizeRoute(data);
    }

    @MessagePattern({ cmd: 'get_history' })
    handleGetHistory(@Payload() data: { queryParams: any; userId: string }) {
        return this.routeOptService.history(data.queryParams, data.userId);
    }

    // NOVO: Handler para deletar a rota
    @MessagePattern({ cmd: 'delete_route' })
    handleDeleteRoute(@Payload() data: { routeId: string; userId: string }) {
        return this.routeOptService.deleteRoute(data.routeId, data.userId);
    }
}
