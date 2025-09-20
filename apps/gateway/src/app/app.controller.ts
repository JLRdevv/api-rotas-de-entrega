import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { type Response } from 'express';
@Controller('/')
export class AppController {
    constructor(private appService: AppService) {}

    @Get('/')
    async health(@Res() res: Response) {
        const response = await this.appService.health();
        return res.status(response.statusCode).json(response.services);
    }
}
