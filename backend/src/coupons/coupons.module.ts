import { Module } from '@nestjs/common'
import { CouponsService } from './coupons.service'
import { CouponsController } from './coupons.controller'
import { PrismaClient } from '@prisma/client'

@Module({
  controllers: [CouponsController],
  providers: [CouponsService, PrismaClient],
  exports: [CouponsService],
})
export class CouponsModule {}
