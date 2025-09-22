import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from './user.entity';
import { AbstractRepository } from '@app/common';

@Injectable()
export class UsersRepository extends AbstractRepository<User> {
  protected readonly logger = new Logger(UsersRepository.name);

  constructor(
    @InjectRepository(User)
    userRepository: MongoRepository<User>,
  ) {
    super(userRepository);
  }
}
