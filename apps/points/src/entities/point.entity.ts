import { Entity, Column, ObjectIdColumn, ObjectId } from 'typeorm';
import type { Point } from '../interfaces/point.interface';

@Entity('points')
export class PointEntity {
    @ObjectIdColumn()
    id: ObjectId;

    @ObjectIdColumn()
    userId: ObjectId;

    @Column()
    points: Point[];
}
