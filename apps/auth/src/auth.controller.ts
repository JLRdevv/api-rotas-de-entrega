import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { type AuthRequest } from '@app/contracts';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @MessagePattern({ cmd: 'signup' })
    async signup(@Payload() payload: AuthRequest) {
        return await this.authService.signup(payload.email, payload.password);
    }

    @MessagePattern({ cmd: 'login' })
    async login(@Payload() payload: AuthRequest) {
        return await this.authService.login(payload.email, payload.password);
    }

    @MessagePattern({ cmd: 'whoami' })
    async whoami(@Payload() payload: { userId: string }) {
        return await this.authService.whoami(payload.userId)
    }

    @MessagePattern({ cmd: 'health' })
    health() {
        return 'up';
    }
}
