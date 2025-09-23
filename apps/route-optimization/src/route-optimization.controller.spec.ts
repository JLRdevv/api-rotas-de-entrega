import { Test, TestingModule } from '@nestjs/testing';
import { RouteOptimizationController } from './route-optimization.controller';
import { RouteOptimizationService } from './route-optimization.service';
import { ClientProxy } from '@nestjs/microservices';

// Mocka o service para que o controller possa ser testado de forma isolada
const mockOptimizationService = {
  calculateAndOptimizeRoute: jest.fn(),
  history: jest.fn(),
  deleteRoute: jest.fn(),
};

describe('RouteOptimizationController', () => {
  let controller: RouteOptimizationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RouteOptimizationController],
      providers: [
        {
          provide: RouteOptimizationService,
          useValue: mockOptimizationService,
        },
      ],
    }).compile();

    controller = module.get<RouteOptimizationController>(
      RouteOptimizationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('handleRouteOptimizationRequest should call the service with the correct payload', async () => {
    const payload = {
      pointsId: 'some-points-id',
      userId: 'some-user-id',
    };
    await controller.handleRouteOptimizationRequest(payload as any);
    expect(
      mockOptimizationService.calculateAndOptimizeRoute,
    ).toHaveBeenCalledWith(payload);
  });

  it('handleGetHistory should call the service with the correct payload', async () => {
    const payload = {
        userId: 'some-user-id',
        filters: { limit: 10 }
    };
    await controller.handleGetHistory(payload);
    expect(mockOptimizationService.history).toHaveBeenCalledWith(payload.filters, payload.userId);
  });

  it('handleDeleteRoute should call the service with the correct payload', async () => {
    const payload = {
        routeId: 'some-route-id',
        userId: 'some-user-id',
    };
    await controller.handleDeleteRoute(payload);
    expect(mockOptimizationService.deleteRoute).toHaveBeenCalledWith(payload.routeId, payload.userId);
  });
});
