import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { PointEntity } from '../entities/point.entity';
import { AbstractRepository } from '../../../../libs/common/src/database/abstract-repository';
import { Logger } from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class PointsRepository extends AbstractRepository<PointEntity> {
    protected readonly logger = new Logger(PointsRepository.name);

    constructor(
        @InjectRepository(PointEntity)
        private readonly repo: MongoRepository<PointEntity>,
    ) {
        super(repo);
    }

    async findByUser(userId: ObjectId): Promise<PointEntity[]> {
        return this.repository.find({ where: { userId } });
    }
}
