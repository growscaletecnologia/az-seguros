import { Test, TestingModule } from '@nestjs/testing';
import { InsurersController } from './insurers.controller';
import { InsurersService } from './insurers.service';

describe('InsurersController', () => {
  let controller: InsurersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InsurersController],
      providers: [InsurersService],
    }).compile();

    controller = module.get<InsurersController>(InsurersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
