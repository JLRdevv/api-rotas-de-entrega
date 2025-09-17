import { Test, TestingModule } from '@nestjs/testing';
import { RouteOptimizationController } from './route-optimization.controller';
import { RouteOptimizationService } from './route-optimization.service';
import { ClientProxy } from '@nestjs/microservices';

// Mocka o service para que o controller possa ser testado de forma isolada
const mockOptimizationService = {
    calculateAndOptimizeRoute: jest.fn().mockResolvedValue({
        optimizedRoute: [1, 3, 2, 1],
        totalDistance: 150.25,
    }),
};

describe('RouteOptimizationController', () => {
    let controller: RouteOptimizationController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RouteOptimizationController],
            providers: [
                // Fornece o service mockado em vez do real
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

    it('should call the service with the correct payload', async () => {
        const payload = {
            pointsId: 'some-points-id',
            userId: 'some-user-id',
        };
        await controller.handleRouteOptimizationRequest(payload);

        // Verifica se o método do service foi chamado com os dados corretos
        expect(
            mockOptimizationService.calculateAndOptimizeRoute,
        ).toHaveBeenCalledWith(payload);
    });
});
