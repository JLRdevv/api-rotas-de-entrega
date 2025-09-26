import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { type Response } from 'express';
import {
    ApiOkResponse,
    ApiOperation,
    ApiResponse,
    ApiServiceUnavailableResponse,
    ApiTags,
} from '@nestjs/swagger';
import { OkHealthDocDto } from './docs/ok-response';
import { MultiHealthDocDto } from './docs/multi-response';
import { UnavailableHealthDocDto } from './docs/unavailable-response';
@ApiTags('health')
@Controller('/')
export class AppController {
    constructor(private appService: AppService) {}

    @ApiOperation({ summary: 'Global health check for all services' })
    @ApiOkResponse({
        type: OkHealthDocDto,
        description: 'If all services are up',
    })
    @ApiResponse({
        status: 207,
        type: MultiHealthDocDto,
        description: 'If at least one service is down',
    })
    @ApiServiceUnavailableResponse({
        type: UnavailableHealthDocDto,
        description: 'If all services down',
    })
    @Get('/')
    async health(@Res() res: Response) {
        const response = await this.appService.health();
        return res.status(response.statusCode).json(response.services);
    }
}
