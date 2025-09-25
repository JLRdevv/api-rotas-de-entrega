import { Controller, Post, Body, Res, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { userDataDto } from './dtos/user-data.dto';
import { type Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserId } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signup')
    async signup(
        @Body() body: userDataDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const token = await this.authService.signup(body.email, body.password);
        if (token) {
            res.cookie('Authentication', token, {
                httpOnly: true,
            });
            return { token };
        }
    }

    @Post('/login')
    async login(
        @Body() body: userDataDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const token = await this.authService.login(body.email, body.password);
        if (token) {
            res.cookie('Authentication', token, {
                httpOnly: true,
            });
            return { token };
        }
    }

    @Post('/logout')
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('Authentication', {
            httpOnly: true,
        });
        return true;
    }

    @UseGuards(JwtAuthGuard)
    @Get('/whoami')
    async whoami(@UserId() userId: string) {
        return await this.authService.whoami(userId);
    }
}
