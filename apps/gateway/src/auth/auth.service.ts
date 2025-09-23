import { Injectable } from '@nestjs/common';
import { AuthClient } from './auth.client';

@Injectable()
export class AuthService {
    constructor(private authClient: AuthClient) {}

    async signup(email: string, password: string) {
        return await this.authClient.signup(email, password);
    }

    async login(email: string, password: string) {
        return await this.authClient.login(email, password);
    }

    async whoami(userId: string) {
        return await this.authClient.whoami(userId);
    }
}
