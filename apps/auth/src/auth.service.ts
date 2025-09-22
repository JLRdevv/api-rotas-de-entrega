import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
            return this.jwtService.sign({ _id: userId });
        } catch {
            throw new InternalServerErrorException(
                'Error while creating jwt token',
            );
        }
    }

    async login(email: string, password: string) {
        try {
            const userId = await this.usersService.login(email, password);
            return this.jwtService.sign({ _id: userId });
        } catch {
            throw new InternalServerErrorException(
                'Error while creating jwt token',
            );
        }
    }
}
