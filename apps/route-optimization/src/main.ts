import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { RouteOptimizationModule } from './route-optimization.module';

async function bootstrap() {
    const app = await NestFactory.createMicroservice(RouteOptimizationModule, {
        transport: Transport.RMQ,
        options: {
            urls: ['amqp://rabbitmq:5672'],
            queue: 'rotas_queue',
            queueOptions: {},
        },
    });
    await app.listen();
}
bootstrap();
