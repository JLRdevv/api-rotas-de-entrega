import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { AbstractDocument } from './abstract-document';
import { Logger, NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<T extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly repository: MongoRepository<T>) {}

  async find(): Promise<T[]> {
    return this.repository.find();
  }

  async findById(_id: ObjectId): Promise<T> {
    const entity = await this.repository.findOneBy(_id);
    if (!entity) {
      this.logger.warn(
        `Nenhum registro encontrado com id ${_id.toHexString()}`,
      );
      throw new NotFoundException(
        `Nenhum registro encontrado com id ${_id.toHexString()}`,
      );
    }
    return entity;
  }

  async create(entity: T): Promise<T> {
    const result = await this.repository.insertOne(entity);
    return this.findById(result.insertedId);
  }

  async update(_id: ObjectId, partialEntity: Partial<T>): Promise<T> {
    const result = await this.repository.updateOne(_id, {
      $set: partialEntity,
    });
    if (result.matchedCount === 0) {
      this.logger.warn(
        `Nenhum registro encontrado com id ${_id.toHexString()}`,
      );
      throw new NotFoundException(
        `Nenhum registro encontrado com id ${_id.toHexString()}`,
      );
    }
    return this.findById(_id);
  }

  async delete(_id: ObjectId): Promise<void> {
    const result = await this.repository.deleteOne(_id);
    if (result.deletedCount === 0) {
      this.logger.warn(
        `Nenhum registro encontrado com id ${_id.toHexString()}`,
      );
      throw new NotFoundException(
        `Nenhum registro encontrado com id ${_id.toHexString()}`,
      );
    }
  }
}
