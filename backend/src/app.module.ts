import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { PermissionsModule } from './permissions/permissions.module'
import { RolesModule } from './roles/roles.module'
import { RbacModule } from './rbac/rbac.module'
import { CouponsModule } from './coupons/coupons.module'
import { PostsModule } from './posts/posts.module'
import { CategoriesModule } from './categories/categories.module'
import { TagsModule } from './tags/tags.module'
import { SystemPagesModule } from './system-pages/system-pages.module'

import { LoggerMiddleware } from './middleware/logger'
import { AutoPermissionMiddleware } from './rbac/middleware/auto-permission.middleware'
import { SettingsModule } from './modules/settings/settings.module'
import { AvaliationsModule } from './avaliations/avaliations.module'
import { LogsModule } from './logs/logs.module'
import { FrontsectionsModule } from './frontsections/frontsections.module'

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PermissionsModule,
    RolesModule,
    RbacModule,
    CouponsModule,
    PostsModule,
    CategoriesModule,
    TagsModule,
    LogsModule,
    SystemPagesModule,
    SettingsModule,
    AvaliationsModule,
    FrontsectionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Aplicar middlewares na ordem correta:
    // 1. AutoPermissionMiddleware (para anexar usuário ao request)
    // 2. LoggerMiddleware (para capturar informações do usuário)
    consumer.apply(AutoPermissionMiddleware).forRoutes('*').apply(LoggerMiddleware).forRoutes('*')
  }
}
