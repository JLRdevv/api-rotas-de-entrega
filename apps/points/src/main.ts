import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { PointsModule } from './points.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
    dotenv.config({ path: 'config/rmq.env' });

    const app = await NestFactory.createMicroservice(PointsModule, {
        transport: Transport.RMQ,
        options: {
            urls: [process.env.RABBITMQ_URL],
            queue: 'points_queue',
            queueOptions: {
                durable: false,
            },
        },
    });
    await app.listen();
}
bootstrap();
