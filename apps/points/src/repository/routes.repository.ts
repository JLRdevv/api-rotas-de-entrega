/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { AbstractRepository } from '../../../../libs/common/src/database/abstract-repository';
import { Logger } from '@nestjs/common';
import { RouteEntity } from '../entities/route.entity';
import { ObjectId } from 'mongodb';
import { HistoryRequest } from '@app/contracts';
import { dateFiltering } from '@app/utils';

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

        if (query.filters?.date && query.filters?.date?.length > 0) {
            const dateFilter = dateFiltering(query.filters?.date);
            filter.createdAt = {
                $gte: dateFilter.from,
                $lte: dateFilter.to,
            };
        }
        const cursor = this.repo
            .createCursor<RouteEntity>(filter)
            .sort({ createdAt: -1 })
            .skip(query.filters?.offset ?? 0)
            .limit(query.filters?.limit ?? 10);

        return cursor.toArray();
    }
}
