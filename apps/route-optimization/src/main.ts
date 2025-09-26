import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { RouteOptimizationModule } from './route-optimization.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(RouteOptimizationModule);
    const configService = app.get(ConfigService);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
            urls: [configService.getOrThrow<string>('RMQ_URL')],
            queue: 'routes_queue',
            queueOptions: { durable: true },
        },
    });

    app.useLogger(app.get(Logger));

    await app.startAllMicroservices();
    await app.listen(configService.get('HTTP_PORT')!);
}
void bootstrap();
