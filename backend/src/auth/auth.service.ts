import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service'
import { RedisService } from '../redis/redis.service'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email)
    if (!user) throw new UnauthorizedException('Credenciais inválidas')

    const isMatch = await bcrypt.compare(pass, user.password)
    if (!isMatch) throw new UnauthorizedException('Credenciais inválidas')

    if (user.status === 'SUSPENDED') throw new ForbiddenException('Conta suspensa')
    if (user.status === 'BLOCKED') throw new ForbiddenException('Conta bloqueada')

    return user
  }

  async login(user: any) {
    const payload = { sub: user.id, role: user.role }

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' })
    const refreshToken = uuidv4()

    // salva no Redis
    const client = this.redisService.getClient()
    await client.set(
      `refresh:${refreshToken}`,
      JSON.stringify({ userId: user.id, role: user.role }),
      'EX',
      60 * 60 * 24 * 7, // 7 dias
    )

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  }
}
