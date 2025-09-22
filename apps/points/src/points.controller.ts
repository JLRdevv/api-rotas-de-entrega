import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PointService } from './point.service';
import { CreatePointDto } from './entities/dto/create-point.dto';

@Controller()
export class PointsController {
    constructor(private readonly pointsService: PointService) {}

    @MessagePattern({ cmd: 'create-point' })
    async createPoint(@Payload() createPointDto: CreatePointDto) {
        return this.pointsService.create(createPointDto);
    }

    @MessagePattern({ cmd: 'get-points-by-id' })
    async getPointsById(@Payload('id') id: string) {
        return this.pointsService.findById(id);
    }

     @MessagePattern({ cmd: 'getHistory' })
    async getHistory(@Payload() data: { userId: string; filters?: any }) {
        return this.pointsService.getHistory(data.userId, data.filters);
    }

    @MessagePattern({ cmd: 'deleteRoute' })
    async deleteRoute(@Payload() data: { userId: string; routeId: string }) {
        return this.pointsService.deleteRoute(data.userId, data.routeId);
    }
}
