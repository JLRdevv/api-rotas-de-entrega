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
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { bodyAddPointsDocDto } from './docs/addPoints/body.dto';
import { OkAddPointsDocDto } from './docs/addPoints/ok-response';
import { UnprocessableAddPointDocDto } from './docs/addPoints/unprocessable-response';
import { OkGetPointsDocDto } from './docs/getPoints/ok-response';
import { OkGetPointDocDto } from './docs/getPoint/ok-response';
import { BadGetPointDocDto } from './docs/getPoint/bad-response';
import { NotFoundGetPointDocDto } from './docs/getPoint/not-found-response';
import { BadGetPointsDocDto } from './docs/getPoints/bad-response';
import { NotFoundGetPointsDocDto } from './docs/getPoints/not-found-response';

@Controller('pontos')
@UseGuards(JwtAuthGuard)
export class PointsController {
    constructor(private pointsService: PointsService) {}

    @ApiOperation({ summary: 'Adds point set to the database' })
    @ApiBody({ type: bodyAddPointsDocDto })
    @ApiOkResponse({
        type: OkAddPointsDocDto,
        description: 'Points added with sucess',
    })
    @ApiUnprocessableEntityResponse({
        type: UnprocessableAddPointDocDto,
        description:
            'If user tries to add points with repeated ids or coordinates',
    })
    @Post('/')
    async insertPoints(@Body() body: PointsDataDto, @UserId() userId: string) {
        return await this.pointsService.insertPoints(body.points, userId);
    }

    @ApiOperation({ summary: 'Get all points from user' })
    @ApiOkResponse({
        type: OkGetPointsDocDto,
        description: 'All points from specific user',
    })
    @ApiBadRequestResponse({
        type: BadGetPointsDocDto,
        description: 'If invalid objectId is provided',
    })
    @ApiNotFoundResponse({
        type: NotFoundGetPointsDocDto,
        description: "If provided id doesn't match any points",
    })
    @Get('/')
    async getPoints(@UserId() userId: string) {
        return await this.pointsService.getPoints(userId);
    }

    @ApiOperation({ summary: 'Get specific point from user' })
    @ApiOkResponse({
        type: OkGetPointDocDto,
        description: 'Specific point from user',
    })
    @ApiBadRequestResponse({
        type: BadGetPointDocDto,
        description: 'If invalid objectId is provided',
    })
    @ApiNotFoundResponse({
        type: NotFoundGetPointDocDto,
        description: "If provided id doesn't match any points",
    })
    @Get('/:id')
    async getPoint(@Param('id') pointsId: string, @UserId() userId: string) {
        return await this.pointsService.getPoint(userId, pointsId);
    }

    @ApiOperation({ summary: 'Update points' })
    @ApiBody({ type: bodyAddPointsDocDto })
    @ApiOkResponse({
        type: OkGetPointDocDto,
        description: 'Updated point from user',
    })
    @ApiBadRequestResponse({
        type: BadGetPointDocDto,
        description: 'If invalid objectId is provided',
    })
    @ApiNotFoundResponse({
        type: NotFoundGetPointDocDto,
        description: "If provided id doesn't match any points",
    })
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

    @ApiOperation({ summary: 'Delete whole points set' })
    @ApiNoContentResponse({ description: 'Points set deleted' })
    @ApiBadRequestResponse({
        type: BadGetPointDocDto,
        description: 'If invalid objectId is provided',
    })
    @ApiNotFoundResponse({
        type: NotFoundGetPointDocDto,
        description: "If provided id doesn't match any points",
    })
    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePoints(
        @Param('id') pointsId: string,
        @UserId() userId: string,
    ) {
        return await this.pointsService.deletePoints(userId, pointsId);
    }

    @ApiOperation({ summary: 'Delete specific point' })
    @ApiParam({ name: 'pointsId', type: String, description: 'Points set id' })
    @ApiParam({
        name: 'pointId',
        type: Number,
        description: 'Specific point id',
    })
    @ApiOkResponse({
        type: OkGetPointDocDto,
        description: 'Updated point from user',
    })
    @ApiBadRequestResponse({
        type: BadGetPointDocDto,
        description: 'If invalid objectId is provided',
    })
    @ApiNotFoundResponse({
        type: NotFoundGetPointDocDto,
        description: "If provided id doesn't match any points",
    })
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
