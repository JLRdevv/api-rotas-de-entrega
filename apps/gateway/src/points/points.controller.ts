import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { PointsService } from './points.service';
import { PointsDataDto } from './dtos/points-data.dto';
import { UserId } from '../auth/decorators/current-user.decorator';
import { DeletePointDto } from './dtos/delete-point.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('pontos')
@UseGuards(JwtAuthGuard)
export class PointsController {
    constructor(private pointsService: PointsService) {}

    @Post('/')
    async insertPoints(@Body() body: PointsDataDto, @UserId() userId: string) {
        return await this.pointsService.insertPoints(body.points, userId);
    }

    @Get('/')
    async getPoints(@UserId() userId: string) {
        return await this.pointsService.getPoints(userId);
    }

    @Get('/:id')
    async getPoint(@Param('id') pointsId: string, @UserId() userId: string) {
        console.log(pointsId);
        console.log(pointsId);
        return await this.pointsService.getPoint(userId, pointsId);
    }

    @Patch('/:id')
    async patchPoints(
        @Body() body: PointsDataDto,
        @Param('id') pointsId: string,
        @UserId() userId: string,
    ) {
        return await this.pointsService.patchPoints(
            userId,
            pointsId,
            body.points,
        );
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePoints(
        @Param('id') pointsId: string,
        @UserId() userId: string,
    ) {
        return await this.pointsService.deletePoints(userId, pointsId);
    }

    @Delete('/:pointsId/:pointId')
    async deletePoint(
        @Param() params: DeletePointDto,
        @UserId() userId: string,
    ) {
        return await this.pointsService.deletePoint(
            userId,
            params.pointsId,
            params.pointId,
        );
    }
}
