import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from './user.entity';
import { AbstractRepository } from '@app/common';
import { Logger } from '@nestjs/common';

@Injectable()
export class UsersRepository extends AbstractRepository<User> {
    protected readonly logger = new Logger(UsersRepository.name);

    constructor(
        @InjectRepository(User)
        private readonly repo: MongoRepository<User>,
    ) {
        super(repo);
    }
}
