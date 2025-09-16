import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PointsModule } from './points/points.module'
import { Point } from './points/entities/point.entity' 

@Module({
<<<<<<< HEAD:src/app.module.ts
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb+srv://chagas:dani@routeoptimizer.nttzkbn.mongodb.net/?retryWrites=true&w=majority&appName=RouteOptimizer',
      synchronize: true,
      entities: [Point]
    }),
    PointsModule,
  ],
=======
    controllers: [AppController],
    providers: [AppService],
>>>>>>> feature/api-gateway:apps/gateway/src/app/app.module.ts
})
export class AppModule {}