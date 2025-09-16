import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthClient } from './auth.client';

@Injectable()
export class AuthService {
    constructor(private authClient: AuthClient) {}

    async signup(email: string, password: string) {
        const response =  await this.authClient.signup(email, password);
        return response.token
    }

    async login(email: string, password: string) {
        const response =  await this.authClient.login(email, password);
        return response.token
    }
}
