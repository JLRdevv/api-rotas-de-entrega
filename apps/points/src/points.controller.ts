import { Controller, Get } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { PointsService } from './services/points.service';
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
    SaveHistory,
} from '@app/contracts';
import { HistoryService } from './services/history.service';

@Controller()
export class PointsController {
    constructor(
        private readonly pointsService: PointsService,
        private readonly historyService: HistoryService,
    ) {}

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

    @EventPattern({ cmd: 'saveHistory' })
    saveHistory(@Payload() route: SaveHistory) {
        return this.historyService.save(route);
    }
}
