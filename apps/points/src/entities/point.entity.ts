import { Entity, ObjectIdColumn, Column } from 'typeorm'
import { ObjectId } from 'mongodb'

@Entity()
export class Point {
    @ObjectIdColumn()
    id: ObjectId

    @Column()
    name: string

    @Column()
    coordinates: {
        x: number
        y: number
    }
}