import { Module } from '@nestjs/common'
import { PermissionsService } from './permissions.service'
import { PermissionsController } from './permissions.controller'
import { PrismaClient } from '@prisma/client'

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService, PrismaClient],
  exports: [PermissionsService],
})
export class PermissionsModule {}
