import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PointService } from './point.service';
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
    constructor(private readonly pointService: PointService) {}

    @MessagePattern({ cmd: 'addPoints' })
    addPoints(@Payload() data: AddPointsRequest): Promise<AddPointsResponse> {
        return this.pointService.addPoints(data);
    }

    @MessagePattern({ cmd: 'getPoints' })
    getPoints(@Payload() data: GetPointsRequest): Promise<GetPointsResponse> {
        return this.pointService.getPoints(data);
    }

    @MessagePattern({ cmd: 'getPoint' })
    getPoint(@Payload() data: FindPointRequest): Promise<FindPointResponse> {
        return this.pointService.getPoint(data);
    }

    @MessagePattern({ cmd: 'patchPoints' })
    patchPoints(
        @Payload() data: PatchPointsRequest,
    ): Promise<PatchPointsResponse> {
        return this.pointService.patchPoint(data);
    }

    @MessagePattern({ cmd: 'deletePoints' })
    deletePoints(
        @Payload() data: FindPointRequest,
    ): Promise<DeletePointsResponse> {
        return this.pointService.deletePoints(data);
    }

    @MessagePattern({ cmd: 'deletePoint' })
    deletePoint(
        @Payload() data: DeletePointRequest,
    ): Promise<DeletePointResponse> {
        return this.pointService.deletePoint(data);
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
