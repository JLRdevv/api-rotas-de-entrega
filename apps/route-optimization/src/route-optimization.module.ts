import { Module } from '@nestjs/common';
import { RouteOptimizationController } from './route-optimization.controller';
import { RouteOptimizationService } from './route-optimization.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        // Este registro permite que o serviço injete o 'ClientProxy'
        // para ENVIAR mensagens para o points-service no futuro.
        ClientsModule.register([
            {
                name: 'POINTS_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: ['amqp://rabbitmq:5672'],
                    queue: 'points_queue',
                    queueOptions: {
                        durable: false,
                    },
                },
            },
        ]),
    ],
    controllers: [RouteOptimizationController],
    providers: [RouteOptimizationService],
})
export class RouteOptimizationModule {}
