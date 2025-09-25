import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PointsModule } from './points.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from 'libs/common/src/all-exceptions.filter';

async function bootstrap() {
    const app = await NestFactory.create(PointsModule);
    const configService = app.get(ConfigService);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalFilters(new AllExceptionsFilter());
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
            urls: [configService.getOrThrow<string>('RMQ_URL')],
            queue: 'points_queue',
            queueOptions: { durable: true },
        },
    });

    await app.startAllMicroservices();
    await app.listen(configService.get('HTTP_PORT')!);
}
bootstrap().catch((err) => {
    console.error('Bootstrap failed', err);
    process.exit(1);
});
