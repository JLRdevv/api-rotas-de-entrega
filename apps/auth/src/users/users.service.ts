import {
    ConflictException,
    HttpException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { hashPassword, verifyPassword } from './helpers/password.utils';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(private usersRepository: UsersRepository) {}

    async signup(email: string, password: string) {
        try {
            const isEmailInUse = await this.usersRepository.findByEmail(email);
            if (isEmailInUse) {
                throw new ConflictException('Email already in use');
            }
            const hashedPW = await hashPassword(password);

            // Create entity
            const userEntity = new User();
            userEntity.email = email;
            userEntity.password = hashedPW;

            const user = await this.usersRepository.create(userEntity);
            return user._id;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Failed to reach database');
        }
    }

    async login(email: string, password: string) {
        try {
            const user = await this.usersRepository.findByEmail(email);
            if (!user) {
                throw new UnauthorizedException('Wrong email or password');
            }
            if (!(await verifyPassword(password, user.password)))
                throw new UnauthorizedException('Wrong email or password');

            return user._id;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Failed to reach database');
        }
    }
}
