import { Module } from '@nestjs/common';
import { RoutesControllerController } from './routes-controller/routes-controller.controller';
import { RoutesControllerController } from './routes-controller.controller';

@Module({
  controllers: [RoutesControllerController]
})
export class RoutesModule {}
