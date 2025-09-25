import { Entity, Column, ObjectIdColumn, ObjectId } from 'typeorm';
import type { Point } from '../interfaces/point.interface';
import { AbstractEntity } from '../../../../libs/common/src/database/abstract-entity';

@Entity('points')
export class PointEntity extends AbstractEntity {
    @ObjectIdColumn()
    userId: ObjectId;

    @Column()
    points: Point[];
}
