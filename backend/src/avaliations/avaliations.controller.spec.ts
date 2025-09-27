import { Test, TestingModule } from '@nestjs/testing'
import { AvaliationsController } from './avaliations.controller'
import { AvaliationsService } from './avaliations.service'

describe('AvaliationsController', () => {
  let controller: AvaliationsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvaliationsController],
      providers: [AvaliationsService],
    }).compile()

    controller = module.get<AvaliationsController>(AvaliationsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
