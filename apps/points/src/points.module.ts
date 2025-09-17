import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PointsController } from './points.controller';
import { PointsService } from 'apps/gateway/src/points/points.service';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'POINTS_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: ['amqp://admin:admin123@localhost:5672'],
                    queue: 'points_queue',
                },
            },
        ]),
    ],
    controllers: [PointsController],
    providers: [PointsService],
})
export class PointsModule {}
