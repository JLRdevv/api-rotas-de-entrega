import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthClient } from './auth.client';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [PassportModule],
    controllers: [AuthController],
    providers: [AuthService, AuthClient, JwtStrategy],
})
export class AuthModule {}
