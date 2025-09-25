import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from './user.entity';
import { AbstractRepository } from '@app/common';
import { Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersRepository extends AbstractRepository<User> {
    protected readonly logger = new Logger(UsersRepository.name);

    constructor(
        @InjectRepository(User)
        private readonly repo: MongoRepository<User>,
    ) {
        super(repo);
    }

    async findByEmail(email: string) {
        try {
            const users = await this.repository.find({ where: { email } });
            return users[0] ?? null;
        } catch {
            throw new RpcException({
                statusCode: 500,
                message: 'Failed to reach database',
            });
        }
    }
}
