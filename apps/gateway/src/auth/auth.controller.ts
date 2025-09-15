import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { userDataDto } from './dtos/user-data.dto';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signup')
    async signup(@Body() body: userDataDto) {
        return this.authService.signup(body.email, body.password);
    }

    @Post('/login')
    login(@Body() body: userDataDto) {
        return this.authService.login(body.email, body.password);
    }

    @Post('/logout')
    logout() {
        // later
    }
}
