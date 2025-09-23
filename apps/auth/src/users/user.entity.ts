import { AbstractEntity } from '@app/common';
import { Entity, Column } from 'typeorm';

@Entity()
export class User extends AbstractEntity {
    @Column()
    email: string;

    @Column()
    password: string;
}
