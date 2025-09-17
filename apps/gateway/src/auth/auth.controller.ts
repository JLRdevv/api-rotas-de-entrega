import { Controller, Post, Body, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { userDataDto } from './dtos/user-data.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signup')
    async signup(@Body() body: userDataDto, @Session() session) {
        const token = await this.authService.signup(body.email, body.password);
        if (token) {
            session.token = token;
            return token;
        }
    }

    @Post('/login')
    async login(@Body() body: userDataDto, @Session() session) {
        const token = await this.authService.login(body.email, body.password);
        if (token) {
            session.token = token;
            return token;
        }
    }

    @Post('/logout')
    logout(@Session() session) {
        session.token = null;
        return true;
    }
}
