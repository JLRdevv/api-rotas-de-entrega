import { Entity, Column, ObjectIdColumn, ObjectId } from 'typeorm';
import { AbstractEntity } from '../../../../libs/common/src/database/abstract-entity';

@Entity('route')
export class RouteEntity extends AbstractEntity {
    @ObjectIdColumn()
    pointsId: ObjectId;

    @ObjectIdColumn()
    userId: ObjectId;

    @Column()
    optimizedRoute: number[];

    @Column()
    totalDistance: number;

    @Column()
    createdAt: Date;
}
