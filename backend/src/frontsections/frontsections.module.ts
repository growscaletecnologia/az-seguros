import { Module } from '@nestjs/common'
import { FrontsectionsService } from './frontsections.service'
import { FrontsectionsController } from './frontsections.controller'

@Module({
  controllers: [FrontsectionsController],
  providers: [FrontsectionsService],
})
export class FrontsectionsModule {}
