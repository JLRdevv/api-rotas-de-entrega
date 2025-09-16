import { Test, TestingModule } from '@nestjs/testing';
import { RouteOptimizationController } from './route-optimization.controller';
import { RouteOptimizationService } from './route-optimization.service';

describe('RouteOptimizationController', () => {
  let routeOptimizationController: RouteOptimizationController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RouteOptimizationController],
      providers: [RouteOptimizationService],
    }).compile();

    routeOptimizationController = app.get<RouteOptimizationController>(RouteOptimizationController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(routeOptimizationController.getHello()).toBe('Hello World!');
    });
  });
});
