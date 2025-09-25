import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
    const app = await NestFactory.create(AuthModule);
    const configService = app.get(ConfigService);
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
            urls: [configService.getOrThrow<string>('RMQ_URL')],
            queue: 'auth_queue',
            queueOptions: { durable: true },
        },
    });
    app.useLogger(app.get(Logger));
    await app.startAllMicroservices();
    await app.listen(configService.getOrThrow('AUTH_HTTP_PORT'));
}
bootstrap().catch((err) => {
    console.error('Bootstrap failed', err);
    process.exit(1);
});
