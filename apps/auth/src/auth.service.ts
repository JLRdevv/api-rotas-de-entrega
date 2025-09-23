import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signup(email: string, password: string) {
        try {
            const userId = await this.usersService.signup(email, password);

            const payload = { _id: userId.toString() };
            const token = this.jwtService.sign(payload);

            return token;
        } catch (error) {
            throw error;
        }
    }

    async login(email: string, password: string) {
        try {
            const userId = await this.usersService.login(email, password);

            const payload = { _id: userId.toString() };

            const token = this.jwtService.sign(payload);

            return token;
        } catch (error) {
            throw error;
        }
    }

    async whoami(userId: string) {
        try {
            return await this.usersService.whoami(userId);

            
        } catch (error) {
            throw error;
        }
    }
}
