import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { PermissionsModule } from './permissions/permissions.module'
import { RolesModule } from './roles/roles.module'
import { RbacModule } from './rbac/rbac.module'

@Module({
  imports: [AuthModule, UsersModule, PermissionsModule, RolesModule, RbacModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
