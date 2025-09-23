import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UsersRepository } from './users.repository';
import { hashPassword, verifyPassword } from './helpers/password.utils';
import { User } from './user.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersService {
    constructor(private usersRepository: UsersRepository) {}

    async signup(email: string, password: string) {
        try {
            const isEmailInUse = await this.usersRepository.findByEmail(email);
            if (isEmailInUse) {
                throw new RpcException({
                    statusCode: 409,
                    message: 'Email already in use',
                });
            }
            const hashedPW = await hashPassword(password);

            // Create entity
            const userEntity = new User();
            userEntity.email = email;
            userEntity.password = hashedPW;

            const user = await this.usersRepository.create(userEntity);
            return user._id;
        } catch (error) {
            if (error instanceof RpcException) throw error;
            throw new RpcException({
                statusCode: 500,
                message: 'Failed to reach database',
            });
        }
    }

    async login(email: string, password: string) {
        try {
            const user = await this.usersRepository.findByEmail(email);
            if (!user) {
                throw new RpcException({
                    statusCode: 401,
                    message: 'Wrong email or password',
                });
            }
            if (!(await verifyPassword(password, user.password)))
                throw new RpcException({
                    statusCode: 401,
                    message: 'Wrong email or password',
                });
            return user._id;
        } catch (error) {
            if (error instanceof RpcException) throw error;
            throw new RpcException({
                statusCode: 500,
                message: 'Failed to reach database',
            });
        }
    }

    async whoami(userId: string) {
        try {
            const user = await this.usersRepository.findById(
                new ObjectId(userId),
            );
            if (!user) {
                throw new RpcException({
                    statusCode: 401,
                    message: 'User does not exist',
                });
            }
            
            return {
                _id: user._id,
                email: user.email,
            };
        } catch (error) {
            if (error instanceof RpcException) throw error;
            throw new RpcException({
                statusCode: 500,
                message: 'Failed to reach database',
            });
        }
    }
}
