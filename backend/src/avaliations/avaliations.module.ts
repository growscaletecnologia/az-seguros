import { Module } from '@nestjs/common'
import { AvaliationsService } from './avaliations.service'
import { AvaliationsController } from './avaliations.controller'

@Module({
  controllers: [AvaliationsController],
  providers: [AvaliationsService],
})
export class AvaliationsModule {}
