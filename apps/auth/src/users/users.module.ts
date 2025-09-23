import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'mongodb',
                url: configService.getOrThrow<string>('MONGO_URI'),
                synchronize: true,
                entities: [User],
            }),
        }),
    TypeOrmModule.forFeature([User]),
    LoggerModule
  ],
  providers: [UsersService, UsersRepository],
  exports: [UsersService]
})
export class UsersModule {}
