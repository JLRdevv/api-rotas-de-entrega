import { Module } from '@nestjs/common';
import { AuthsControllerController } from './auths-controller.controller';
import { AuthControllerController } from './auth-controller.controller';

@Module({
  controllers: [AuthsControllerController, AuthControllerController]
})
export class AuthModule {}
