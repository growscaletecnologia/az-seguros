import { Module, MiddlewareConsumer, RequestMethod, forwardRef } from '@nestjs/common'
import { EffectivePermissionsService } from './services/effective-permissions.service'
import { PermissionGuard } from './guards/permission.guard'
import { AutoPermissionMiddleware } from './middleware/auto-permission.middleware'
import { PrismaClient } from '@prisma/client'
import { PermissionsModule } from '../permissions/permissions.module'
import { RolesModule } from '../roles/roles.module'
import { JwtModule } from '@nestjs/jwt'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [
    PermissionsModule,
    RolesModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecret',
      signOptions: { expiresIn: '7d' },
    }),
    forwardRef(() => AuthModule),
  ],
  providers: [EffectivePermissionsService, PermissionGuard, PrismaClient, AutoPermissionMiddleware],
  exports: [EffectivePermissionsService, PermissionGuard, AutoPermissionMiddleware],
})
export class RbacModule {
  configure(consumer: MiddlewareConsumer) {
    // Aplica o middleware a todas as rotas
    consumer.apply(AutoPermissionMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
