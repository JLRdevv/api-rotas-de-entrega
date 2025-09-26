import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(GatewayModule);
    const cookieParser = require('cookie-parser');
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useLogger(app.get(Logger));
    const config = new DocumentBuilder()
        .setTitle('Desafio 4')
        .setDescription('Api escalável de otimização de rotas de entrega')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    const configService = app.get(ConfigService);
    await app.listen(configService.get('HTTP_PORT')!);
}
bootstrap();
