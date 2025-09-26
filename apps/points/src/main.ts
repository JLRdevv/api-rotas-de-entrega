import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PointsModule } from './points.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(PointsModule);
    const configService = app.get(ConfigService);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
            urls: [configService.getOrThrow<string>('RMQ_URL')],
            queue: 'points_queue',
            queueOptions: { durable: true },
        },
    });
    app.useLogger(app.get(Logger));

    await app.startAllMicroservices();
    await app.listen(configService.get('HTTP_PORT')!);
}
bootstrap().catch((err) => {
    console.error('Bootstrap failed', err);
    process.exit(1);
});
