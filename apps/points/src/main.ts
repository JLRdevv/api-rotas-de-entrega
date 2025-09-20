import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { PointsModule } from './points.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(PointsModule);
    const configService = app.get(ConfigService);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.connectMicroservice({
        transport: Transport.RMQ,
        options: {
            urls: [configService.get('RMQ_URL')],
            queue: 'points_queue',
            queueOptions: { durable: false },
        },
    });

    await app.startAllMicroservices();
    await app.listen(configService.get('HTTP_PORT')!);
}
bootstrap().catch((err) => {
    console.error('Bootstrap failed', err);
    process.exit(1);
});
