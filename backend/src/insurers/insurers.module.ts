import { Module } from '@nestjs/common'
import { InsurersService } from './insurers.service'
import { InsurersController } from './insurers.controller'

@Module({
  controllers: [InsurersController],
  providers: [InsurersService],
})
export class InsurersModule {}
