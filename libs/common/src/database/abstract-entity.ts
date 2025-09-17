import { ObjectId } from 'mongodb';
import { ObjectIdColumn } from 'typeorm';

export abstract class AbstractEntity {
  @ObjectIdColumn()
  _id: ObjectId;
}
