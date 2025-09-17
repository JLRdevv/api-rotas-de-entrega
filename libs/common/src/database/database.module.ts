import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({})
export class DatabaseModule {
  static forRoot(entities: any[]): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            type: 'mongodb',
            url: configService.get<string>('MONGO_URI'),
            entities: entities,
          }),
        }),
      ],
      exports: [TypeOrmModule],
    };
  }
}
