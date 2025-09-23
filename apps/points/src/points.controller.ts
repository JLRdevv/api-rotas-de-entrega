import { Controller, Get } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { PointsService } from './points.service';
import type {
    AddPointsRequest,
    AddPointsResponse,
    GetPointsRequest,
    GetPointsResponse,
    FindPointRequest,
    FindPointResponse,
    PatchPointsRequest,
    PatchPointsResponse,
    DeletePointsResponse,
    DeletePointResponse,
    DeletePointRequest,
} from '@app/contracts';

@Controller()
export class PointsController {
    constructor(private readonly pointsService: PointsService) {}

    @MessagePattern({ cmd: 'addPoints' })
    addPoints(@Payload() data: AddPointsRequest): Promise<AddPointsResponse> {
        return this.pointsService.addPoints(data);
    }

    @MessagePattern({ cmd: 'getPoints' })
    getPoints(@Payload() data: GetPointsRequest): Promise<GetPointsResponse> {
        return this.pointsService.getPoints(data);
    }

    @MessagePattern({ cmd: 'getPoint' })
    getPoint(@Payload() data: FindPointRequest): Promise<FindPointResponse> {
        return this.pointsService.getPoint(data);
    }

    @MessagePattern({ cmd: 'patchPoints' })
    patchPoints(
        @Payload() data: PatchPointsRequest,
    ): Promise<PatchPointsResponse> {
        return this.pointsService.patchPoint(data);
    }

    @MessagePattern({ cmd: 'deletePoints' })
    deletePoints(
        @Payload() data: FindPointRequest,
    ): Promise<DeletePointsResponse> {
        return this.pointsService.deletePoints(data);
    }

    @MessagePattern({ cmd: 'deletePoint' })
    deletePoint(
        @Payload() data: DeletePointRequest,
    ): Promise<DeletePointResponse> {
        return this.pointsService.deletePoint(data);
    }

    @MessagePattern({ cmd: 'health' })
    healthMessage(): boolean {
        return true;
    }

    @Get('health')
    healthHTTP(): boolean {
        return true;
    }

    @EventPattern({ cmd: 'addRoute' })
    async createPoint(@Payload() createPointDto: CreatePointDto) {
        return this.pointsService.create(createPointDto);
    }
}
