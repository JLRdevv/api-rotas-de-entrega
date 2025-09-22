import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Point } from './entities/point.entity';
import { CreatePointDto } from './entities/dto/create-point.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class PointService {
    constructor(
        @InjectRepository(Point)
        private readonly pointsRepository: MongoRepository<Point>,
    ) {}

    async create(createPointDto: CreatePointDto): Promise<Point> {
        const newPoint = this.pointsRepository.create(createPointDto);
        return this.pointsRepository.save(newPoint);
    }

    async findById(id: string): Promise<Point> {
        const objectId = new ObjectId(id);
        const point = await this.pointsRepository.findOneBy({ _id: objectId });

        if (!point) {
            throw new NotFoundException(
                `Ponto com o ID "${id}" não encontrado.`,
            );
        }
        return point;
    }

    async getHistory(userId: string, filters: any): Promise<any> {
        const history = await this.pointsServiceClient
            .send({ cmd: 'getHistory' }, { userId, filters })
            .toPromise();

        return history;
    }

    async deleteRoute(userId: string, routeId: string): Promise<any> {
        const result = await this.pointsServiceClient
            .send({ cmd: 'deleteRoute' }, { userId, routeId })
            .toPromise();

        return result;
    }
}
