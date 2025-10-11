import { Module } from '@nestjs/common'
import { SystemPagesController } from './system-pages.controller'
import { SystemPagesService } from './system-pages.service'

@Module({
  controllers: [SystemPagesController],
  providers: [SystemPagesService],
  exports: [SystemPagesService],
})
export class SystemPagesModule {}
