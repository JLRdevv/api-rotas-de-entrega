import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({})
export class DatabaseModule {
  static forRoot(entities: any[]): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRoot({
          type: 'mongodb',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT!),
          username: process.env.MONGO_INITDB_ROOT_USERNAME,
          password: process.env.MONGO_INITDB_ROOT_PASSWORD,
          database: process.env.DATABASE_NAME,
          entities,
          synchronize: true,
        }),
      ],
      exports: [TypeOrmModule],
    };
  }
}
