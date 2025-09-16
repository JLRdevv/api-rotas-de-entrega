import { Module } from '@nestjs/common';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';
import { RouteClient } from './route.client';

@Module({
    controllers: [RoutesController],
    providers: [RoutesService, RouteClient],
})
export class RoutesModule {}
