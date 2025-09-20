<<<<<<< HEAD
import { Entity, Column, ObjectIdColumn, ObjectId } from 'typeorm';
import type { Point } from '../interfaces/point.interface';

@Entity('points')
export class PointEntity {
    @ObjectIdColumn()
    id: ObjectId;

    @Column()
    userId: ObjectId;

    @Column()
    points: Point[];
=======
import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity()
export class Point {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  name: string;

  @Column()
  coordinates: {
    x: number;
    y: number;
  };
>>>>>>> b41ea1c689d2bb8d829689d413cba67e9d723728
}
