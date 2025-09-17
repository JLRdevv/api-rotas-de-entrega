import { Test, TestingModule } from '@nestjs/testing';
import { RouteOptimizationService } from './route-optimization.service';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';
import { OptimizedRouteResult } from '@app/contracts';

// Mock do ClientProxy para não depender do RabbitMQ
const mockPointsServiceClient = {
    send: jest.fn(),
};

describe('RouteOptimizationService', () => {
    let service: RouteOptimizationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RouteOptimizationService,
                {
                    provide: 'POINTS_SERVICE',
                    useValue: mockPointsServiceClient,
                },
            ],
        }).compile();

        service = module.get<RouteOptimizationService>(
            RouteOptimizationService,
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('calculateAndOptimizeRoute', () => {
        it('should calculate a route successfully using mocked data', async () => {
            const payload = {
                pointsId: '632f1b9b9b9b9b9b9b9b9b9b',
                userId: '632f1b9b9b9b9b9b9b9b9b9c',
            };

            const result: OptimizedRouteResult =
                await service.calculateAndOptimizeRoute(payload);

            // Verifica se o resultado tem o formato esperado
            expect(result).toBeDefined();
            expect(result).toHaveProperty('totalDistance');
            expect(result).toHaveProperty('optimizedRoute');
            expect(result.totalDistance).toBeGreaterThan(0);
            expect(Array.isArray(result.optimizedRoute)).toBe(true);
            expect(result.optimizedRoute.length).toBeGreaterThan(3);
        });

        it('should throw an error for invalid IDs', async () => {
            const payload = {
                pointsId: 'invalid-id',
                userId: 'invalid-id',
            };

            // Verifica se o método lança uma exceção para IDs inválidos
            await expect(
                service.calculateAndOptimizeRoute(payload),
            ).rejects.toThrow('Invalid id format for pointsId or userId');
        });
    });
});
