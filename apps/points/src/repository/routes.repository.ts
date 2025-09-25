/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { AbstractRepository } from '../../../../libs/common/src/database/abstract-repository';
import { Logger } from '@nestjs/common';
import { RouteEntity } from '../entities/route.entity';
import { ObjectId } from 'mongodb';
import { HistoryRequest } from '@app/contracts';

@Injectable()
export class RoutesRepository extends AbstractRepository<RouteEntity> {
    protected readonly logger = new Logger(RoutesRepository.name);

    constructor(
        @InjectRepository(RouteEntity)
        private readonly repo: MongoRepository<RouteEntity>,
    ) {
        super(repo);
    }

    async getHistory(query: HistoryRequest): Promise<RouteEntity[]> {
        const filter: any = {
            userId: new ObjectId(query.userId),
        };

        if (query.filters?.pointsId)
            filter.pointsId = new ObjectId(query.filters.pointsId);

        if (query.filters?.date?.length === 1) {
            filter.createdAt = new Date(query.filters.date[0]);
        } else if (query.filters?.date?.length === 2) {
            const [start, end] = query.filters.date;
            filter.createdAt = {
                $gte: new Date(start),
                $lte: new Date(end),
            };
        }

        const cursor = this.repo
            .createCursor<RouteEntity>(filter)
            .skip(query.filters?.offset ?? 0)
            .limit(query.filters?.limit ?? 10)
            .sort({ createdAt: -1 });

        return cursor.toArray();
    }
}
