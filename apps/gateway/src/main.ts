import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import cookieSession from 'cookie-session';

async function bootstrap() {
    const app = await NestFactory.create(GatewayModule);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    // uncomment when common lib is done
    // app.useLogger(app.get(Logger));
    const configService = app.get(ConfigService);
    app.use(
        cookieSession({
            keys: [configService.get('COOKIE_SECRET')],
            httpOnly: true,
        }),
    );
    await app.listen(configService.get('HTTP_PORT')!);
}
bootstrap();
