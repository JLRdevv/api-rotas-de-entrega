import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { AbstractRepository } from '../../../../libs/common/src/database/abstract-repository';
import { Logger } from '@nestjs/common';
import { RouteEntity } from '../entities/route.entity';

@Injectable()
export class RoutesRepository extends AbstractRepository<RouteEntity> {
    protected readonly logger = new Logger(RoutesRepository.name);

    constructor(
        @InjectRepository(RouteEntity)
        private readonly repo: MongoRepository<RouteEntity>,
    ) {
        super(repo);
    }
}
