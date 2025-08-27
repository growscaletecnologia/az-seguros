import { Test, TestingModule } from '@nestjs/testing';
import { InsurersService } from './insurers.service';

describe('InsurersService', () => {
  let service: InsurersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InsurersService],
    }).compile();

    service = module.get<InsurersService>(InsurersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
