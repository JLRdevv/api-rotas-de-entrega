import { Test, TestingModule } from '@nestjs/testing';
import { RouteOptimizationService } from './route-optimization.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Route } from './route.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { lastValueFrom, of } from 'rxjs';

// Mock do ClientProxy para não depender do RabbitMQ
const mockPointsServiceClient = {
    send: jest.fn(),
};


const mockRouteRepo = {
 create: jest.fn(),
 save: jest.fn(),
 find: jest.fn(),
 findOne: jest.fn(),
 delete: jest.fn(),
};

describe('RouteOptimizationService', () => {
    let service: RouteOptimizationService;
    let repo: Repository<Route>;

      beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [
            RouteOptimizationService,
            {
              provide: 'POINTS_SERVICE',
              useValue: mockPointsServiceClient,
            },
            {
              // Provide do mock repo
              provide: getRepositoryToken(Route),
              useValue: mockRouteRepo,
            },
          ],
        }).compile();

        service = module.get<RouteOptimizationService>(RouteOptimizationService);
        repo = module.get<Repository<Route>>(getRepositoryToken(Route));

        jest.clearAllMocks();
      });

      it('should be defined', () => {
        expect(service).toBeDefined();
      });

      describe('calculateAndOptimizeRoute', () => {
        const mockPointsPayload = {
            points: [
                { id: 1, x: 0, y: 0 },
                { id: 2, x: 50, y: 30 },
                { id: 3, x: 10, y: 80 },
            ],
        };

        it('should calculate, save and return the optimized route', async () => {
          const payload = {
            pointsId: '632f1b9b9b9b9b9b9b9b9b9b',
            userId: '632f1b9b9b9b9b9b9b9b9b9c',
          };

        mockPointsServiceClient.send.mockReturnValue(of(mockPointsPayload));
        mockRouteRepo.create.mockImplementation((dto) => dto); // Simula o create
        mockRouteRepo.save.mockResolvedValue({ ...payload, results: { optimizedRoute: [1, 3, 2], totalDistance: 100 } });

          const result = await service.calculateAndOptimizeRoute(payload);

        expect(mockPointsServiceClient.send).toHaveBeenCalledWith('get_points_by_id', expect.any(Object));
        expect(mockRouteRepo.save).toHaveBeenCalled();
          expect(result).toHaveProperty('totalDistance');
          expect(result).toHaveProperty('optimizedRoute');
        });

        it('should throw BadRequestException for invalid IDs', async () => {
          const payload = { pointsId: 'invalid', userId: 'invalid' };
          await expect(service.calculateAndOptimizeRoute(payload)).rejects.toThrow(BadRequestException);
        });
      });

    describe('history', () => {
        it('should return an array of routes', async () => {
            const mockRoutes = [{ _id: '1', results: {} }, { _id: '2', results: {} }];
            mockRouteRepo.find.mockResolvedValue(mockRoutes);

            const result = await service.history({}, '632f1b9b9b9b9b9b9b9b9b9c');

            expect(mockRouteRepo.find).toHaveBeenCalled();
            expect(result).toEqual(mockRoutes);
        });

        it('should throw NotFoundException if no routes are found', async () => {
            mockRouteRepo.find.mockResolvedValue([]);
            await expect(service.history({}, '632f1b9b9b9b9b9b9b9b9b9c')).rejects.toThrow(NotFoundException);
        });
    });

    describe('deleteRoute', () => {
        it('should delete a route and return { deleted: true }', async () => {
            const routeId = '632f1b9b9b9b9b9b9b9b9b9b';
            const userId = '632f1b9b9b9b9b9b9b9b9b9c';
            
            mockRouteRepo.findOne.mockResolvedValue({ _id: routeId, userId });

            const result = await service.deleteRoute(routeId, userId);

            expect(mockRouteRepo.findOne).toHaveBeenCalled();
            expect(mockRouteRepo.delete).toHaveBeenCalled();
            expect(result).toEqual({ deleted: true });
        });

        it('should throw NotFoundException if route to delete is not found', async () => {
            mockRouteRepo.findOne.mockResolvedValue(null);
            await expect(service.deleteRoute('632f1b9b9b9b9b9b9b9b9b9b', '632f1b9b9b9b9b9b9b9b9b9c')).rejects.toThrow(NotFoundException);
        });
     });
});