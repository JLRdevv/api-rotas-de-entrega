import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { RouteOptimizationModule } from './route-optimization.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
    const appContext = await NestFactory.createApplicationContext(
        RouteOptimizationModule,
    );

    const configService = appContext.get(ConfigService);
    const rmqUrl = configService.get<string>('RMQ_URL');
    const queueName = 'routes-queue';

    const app = await NestFactory.createMicroservice(RouteOptimizationModule, {
        transport: Transport.RMQ,
        options: {
            urls: [rmqUrl],
            queue: queueName,
            queueOptions: {
                durable: true,
            },
        },
    });

    app.useLogger(app.get(Logger));

    await app.listen();

    console.log(
        `Route-optimization microservice is listening on queue: ${queueName}`,
    );
}
void bootstrap();
