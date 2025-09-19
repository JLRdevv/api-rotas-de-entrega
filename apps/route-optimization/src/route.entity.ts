/* eslint-disable prettier/prettier */
import { Entity, Column, ObjectIdColumn, ObjectId } from 'typeorm';

interface Results {
    optimizedRoute: number[];
    totalDistance: number;
}

@Entity()
export class Route {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    results: Results;

    @Column()
    date: Date;

    @Column()
    pointsId: string;

    @Column()
    userId: string;
}
