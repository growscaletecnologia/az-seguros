import { Module, forwardRef } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { RbacModule } from '../rbac/rbac.module'
import { PrismaClient } from '@prisma/client'
import { InvitationService } from './services/invitation.service'
import { InvitationController } from './controllers/invitation.controller'
import { EmailModule } from '../email/email.module'

@Module({
  imports: [
    forwardRef(() => RbacModule),
    EmailModule
  ],
  controllers: [UsersController, InvitationController],
  providers: [UsersService, InvitationService, PrismaClient],
  exports: [UsersService, InvitationService],
})
export class UsersModule {}
