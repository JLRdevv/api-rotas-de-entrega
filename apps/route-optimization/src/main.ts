import { NestFactory } from '@nestjs/core';
import { RouteOptimizationModule } from './route-optimization.module';

async function bootstrap() {
    const app = await NestFactory.create(RouteOptimizationModule);
    await app.listen(process.env.port ?? 3000);
}
bootstrap();
