import { PrimaryGeneratedColumn } from 'typeorm';

export abstract class AbstractDocument {
  @PrimaryGeneratedColumn('uuid')
  _id: string;
}
