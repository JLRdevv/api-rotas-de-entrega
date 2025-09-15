import { Test, TestingModule } from '@nestjs/testing';
import { PointsControllerController } from './points-controller.controller';

describe('PointsControllerController', () => {
  let controller: PointsControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PointsControllerController],
    }).compile();

    controller = module.get<PointsControllerController>(PointsControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
