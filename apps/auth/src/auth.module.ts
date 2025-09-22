import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import * as Joi from 'joi';
import { DatabaseModule } from '@app/common';
import { User } from './users/user.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                RMQ_URL: Joi.string().required(),
                AUTH_HTTP_PORT: Joi.number().required(),
                JWT_SECRET: Joi.string().required(),
            }),
        }),
        UsersModule,
        DatabaseModule.forRoot([User]),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
