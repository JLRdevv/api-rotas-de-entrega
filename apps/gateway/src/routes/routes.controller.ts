import {
    Controller,
    Get,
    Delete,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import { RoutesService } from './routes.service';
import { UserId } from '../auth/decorators/current-user.decorator';
import { GetRouteStartIdDto } from './dtos/get-route-start-id.dto';
import { HistoryQueryParamsDto } from './dtos/history-query-params.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('rotas')
@UseGuards(JwtAuthGuard)
export class RoutesController {
    constructor(private routesService: RoutesService) {}

    @Get('/historico')
    async getHistory(
        @Query() queryParams: HistoryQueryParamsDto,
        @UserId() userId: string,
    ) {
        return await this.routesService.getHistory(userId, queryParams);
    }

    @Get('/:id')
    async getRoute(@Param('id') pointsId: string, @UserId() userId: string) {
        return await this.routesService.getRoute(userId, pointsId);
    }

    @Get('/:pointsId/:pointId')
    async getRouteWStartPoint(
        @Param() params: GetRouteStartIdDto,
        @UserId() userId: string,
    ) {
        return await this.routesService.getRoute(
            userId,
            params.pointsId,
            params.pointId,
        );
    }

    @Delete('/:routeId')
    async deleteRoute(
        @Param('routeId') routeId: string,
        @UserId() userId: string,
    ) {
        return await this.routesService.deleteRoute(userId, routeId);
    }
}
