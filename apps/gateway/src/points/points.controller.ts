import { Controller, Get, Post, Patch, Delete } from '@nestjs/common';
import { PointsService } from './points.service';
@Controller('pontos')
export class PointsController {
    constructor(private pointsService: PointsService) {}

    @Post('/')
    insertPoints() {
        return this.pointsService.insertPoints();
    }

    @Get('/')
    getPoints() {
        return this.pointsService.getPoints();
    }

    @Get('/:id')
    getPoint() {
        return this.pointsService.getPoint();
    }

    @Patch('/:id')
    patchPoints() {}

    @Delete('/:id')
    deletePoints() {
        return this.pointsService.deletePoints();
    }

    @Delete('/:pointsId/:pointId')
    deletePoint() {
        return this.pointsService.deletePoint();
    }
}
