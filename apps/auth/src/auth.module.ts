import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import * as Joi from 'joi';
import { LoggerModule } from '@app/common';
import { JwtModule } from '@nestjs/jwt';

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
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const secret = configService.getOrThrow('JWT_SECRET');
                console.log('=== JWT MODULE FACTORY ===');
                console.log(`JWT_SECRET encontrado: ${!!secret}`);
                console.log(`JWT_SECRET length: ${secret.length}`);
                console.log(
                    `JWT_SECRET preview: ${secret.substring(0, 10)}...`,
                );

                return {
                    secret,
                    signOptions: {
                        expiresIn: '1h',
                    },
                };
            },
        }),
        LoggerModule,
        UsersModule,
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
