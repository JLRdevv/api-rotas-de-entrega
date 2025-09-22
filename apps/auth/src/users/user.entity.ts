import { AbstractEntity } from '@app/common';
import { Column } from 'typeorm';

export class User extends AbstractEntity {
    @Column()
    email: string;

    @Column()
    password: string;
}
