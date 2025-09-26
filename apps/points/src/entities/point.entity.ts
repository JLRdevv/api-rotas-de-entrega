import { Entity, Column, ObjectId } from 'typeorm';
import type { Point } from '../interfaces/point.interface';
import { AbstractEntity } from '../../../../libs/common/src/database/abstract-entity';

@Entity('points')
export class PointEntity extends AbstractEntity {
    @Column()
    userId: ObjectId;

    @Column()
    points: Point[];
}
