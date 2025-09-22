import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UsersModule } from '../users/users.module'
import { JwtStrategy } from './strategies/jwt.strategy'
import { RedisModule } from 'src/redis/redis.module'
import { EmailModule } from 'src/email/email.module'
import { SessionService } from './session.service'

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecret',
      signOptions: { expiresIn: '15m' },
    }),
    RedisModule,
    EmailModule,
  ],
  providers: [AuthService, JwtStrategy, SessionService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule, PassportModule, SessionService],
})
export class AuthModule {}
