<<<<<<< HEAD
import { Controller, Post, Body, Session } from '@nestjs/common';
=======
import { Controller, Post, Body, Res } from '@nestjs/common';
>>>>>>> b41ea1c689d2bb8d829689d413cba67e9d723728
import { AuthService } from './auth.service';
import { userDataDto } from './dtos/user-data.dto';
import { type Response } from 'express';

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
            return token;
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
            return token;
        }
    }

    @Post('/logout')
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('Authentication', {
            httpOnly: true,
        });
        return true;
    }
}
