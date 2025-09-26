import {
    Controller,
    Get,
    Delete,
    Param,
    Query,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { RoutesService } from './routes.service';
import { UserId } from '../auth/decorators/current-user.decorator';
import { GetRouteStartIdDto } from './dtos/get-route-start-id.dto';
import { HistoryQueryParamsDto } from './dtos/history-query-params.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { OkGetRouteDocDto } from './docs/addRoute/ok-response';
import { BadGetRouteDocDto } from './docs/addRoute/bad-response';
import { NotFoundGetRouteDocDto } from './docs/addRoute/not-found-response';
import { UnprocessableGetRouteWSPDocDto } from './docs/addRouteWSP/unprocessable-response';
import { OkHistoryDocDto } from './docs/history/ok-response';

@Controller('rotas')
@UseGuards(JwtAuthGuard)
export class RoutesController {
    constructor(private routesService: RoutesService) {}

    @ApiOperation({ summary: 'Get calculated routes history' })
    @ApiOkResponse({
        type: OkHistoryDocDto,
        description: 'User routes history',
    })
    @Get('/historico')
    async getHistory(
        @Query() queryParams: HistoryQueryParamsDto,
        @UserId() userId: string,
    ) {
        return await this.routesService.getHistory(userId, queryParams);
    }

    @ApiOperation({ summary: 'Optimizes route' })
    @ApiParam({ name: 'id', type: String, description: 'Points set id' })
    @ApiOkResponse({
        type: OkGetRouteDocDto,
        description: 'Calculated route',
    })
    @ApiBadRequestResponse({
        type: BadGetRouteDocDto,
        description: 'If invalid objectId is provided',
    })
    @ApiNotFoundResponse({
        type: NotFoundGetRouteDocDto,
        description: "If provided id doesn't match any points",
    })
    @Get('/:id')
    async getRoute(@Param('id') pointsId: string, @UserId() userId: string) {
        return await this.routesService.getRoute(userId, pointsId);
    }

    @ApiOperation({ summary: 'Optimizes route' })
    @ApiParam({ name: 'pointsId', type: String, description: 'Points set id' })
    @ApiParam({
        name: 'pointId',
        type: String,
        description: 'Specific point id',
    })
    @ApiOkResponse({
        type: OkGetRouteDocDto,
        description: 'Calculated route',
    })
    @ApiBadRequestResponse({
        type: BadGetRouteDocDto,
        description: 'If invalid objectId is provided',
    })
    @ApiNotFoundResponse({
        type: NotFoundGetRouteDocDto,
        description: "If provided id doesn't match any points",
    })
    @ApiUnprocessableEntityResponse({
        type: UnprocessableGetRouteWSPDocDto,
        description: 'If provided point id does not match any specific point',
    })
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

    @ApiOperation({ summary: 'Optimizes route' })
    @ApiParam({ name: 'routeId', type: String, description: 'Route id' })
    @ApiOkResponse({
        description: 'Route deleted with sucess',
    })
    @ApiBadRequestResponse({
        type: BadGetRouteDocDto,
        description: 'If invalid objectId is provided',
    })
    @ApiNotFoundResponse({
        type: NotFoundGetRouteDocDto,
        description: "If provided id doesn't match any routes",
    })
    @Delete('/:routeId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteRoute(
        @Param('routeId') routeId: string,
        @UserId() userId: string,
    ) {
        return await this.routesService.deleteRoute(userId, routeId);
    }
}
