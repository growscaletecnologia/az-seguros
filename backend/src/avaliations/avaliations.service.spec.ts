import { Test, TestingModule } from '@nestjs/testing'
import { AvaliationsService } from './avaliations.service'

describe('AvaliationsService', () => {
  let service: AvaliationsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AvaliationsService],
    }).compile()

    service = module.get<AvaliationsService>(AvaliationsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
