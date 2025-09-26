import { Entity, Column, ObjectId } from 'typeorm';
import { AbstractEntity } from '../../../../libs/common/src/database/abstract-entity';

@Entity('route')
export class RouteEntity extends AbstractEntity {
    @Column()
    pointsId: ObjectId;

    @Column()
    userId: ObjectId;

    @Column()
    optimizedRoute: number[];

    @Column()
    totalDistance: number;

    @Column()
    createdAt: Date;
}
