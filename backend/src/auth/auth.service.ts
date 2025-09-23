import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service'
import { RedisService } from '../redis/redis.service'
import { v4 as uuidv4 } from 'uuid'
import { EmailService } from 'src/email/email.service'
import { User } from 'generated/prisma'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private readonly email: EmailService,
    private readonly redis: RedisService,
  ) {}

  // // ----- VERIFICAÇÃO DE E-MAIL -----
  // async sendVerificationEmail(userId: string) {
  //   const user = await this.usersService.findOne(userId)
  //   if (!user) throw new NotFoundException('Usuário não encontrado')
  //   if (user.emailVerifiedAt) return { message: 'E-mail já verificado' }

  //   const token = uuidv4()
  //   const client = this.redis.getClient()
  //   await client.set(`emailVerify:${token}`, JSON.stringify({ userId }), 'EX', VERIFY_TTL_SECONDS)

  //   const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`
  //   await this.email.sendHtml(
  //     user.email,
  //     'Confirme seu e-mail',
  //     verifyTemplate(user.name, verifyUrl),
  //   )
  //   return { message: 'E-mail de verificação enviado' }
  // }

  async verifyEmail(token: string) {
    const client = this.redis.getClient()
    const data = await client.get(`emailVerify:${token}`)
    if (!data) throw new BadRequestException('Token inválido ou expirado')

    const { userId } = JSON.parse(data)
    await this.usersService.verifyEmail(userId)
    await client.del(`emailVerify:${token}`)
    return { message: 'E-mail verificado com sucesso' }
  }

  // // ----- RESET DE SENHA -----
  // async requestPasswordReset(email: string) {
  //   const user = await this.usersService.findByEmail(email)
  //   // resposta neutra para não revelar se o e-mail existe
  //   const generic = { message: 'Se o e-mail existir, enviaremos instruções de redefinição.' }
  //   if (!user) return generic

  //   const token = uuidv4()
  //   const client = this.redis.getClient()
  //   await client.set(
  //     `pwdReset:${token}`,
  //     JSON.stringify({ userId: user.id }),
  //     'EX',
  //     RESET_TTL_SECONDS,
  //   )

  //   const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`
  //   await this.email.sendHtml(user.email, 'Redefinir senha', resetTemplate(user.name, resetUrl))
  //   return generic
  // }

  async doPasswordReset(token: string, newPassword: string) {
    const client = this.redis.getClient()
    const data = await client.get(`pwdReset:${token}`)
    if (!data) throw new BadRequestException('Token inválido ou expirado')

    const { id } = JSON.parse(data)
    await this.usersService.setPasswordById(id, newPassword)
    await client.del(`pwdReset:${token}`)
    return { message: 'Senha redefinida com sucesso' }
  }

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email)
    if (!user) throw new UnauthorizedException('Credenciais inválidas')
    const isMatch = await bcrypt.compare(pass, user.password)
    if (!isMatch) throw new UnauthorizedException('Credenciais inválidas')

    if (user.status === 'SUSPENDED') throw new ForbiddenException('Conta suspensa')
    if (user.status === 'BLOCKED') throw new ForbiddenException('Conta bloqueada')
    return user
  }

  async login(user: User) {
    const payload = { sub: user.id, role: user.role }
    const accessToken = this.jwtService.sign(payload, { expiresIn: '7d' })
    const refreshToken = uuidv4()

    // salva no Redis
    const client = this.redisService.getClient()
    await client.set(
      `refresh:${refreshToken}`,
      JSON.stringify({ userId: user.id, role: user.role }),
      'EX',
      60 * 60 * 24 * 7, // 7 dias
    )

    // Cria uma sessão para o usuário
    const sessionId = await this.redis.getClient().get(`user:${user.id}:session`)
    if (sessionId) {
      // Invalida sessão anterior se existir
      await this.redis.getClient().del(sessionId)
    }

    // Cria nova sessão
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
    const newSessionId = `session:${user.id}:${Date.now()}`
    await this.redis.getClient().set(
      newSessionId,
      JSON.stringify({
        userId: user.id,
        userData,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      }),
      'EX',
      60 * 60 * 24 * 7, // 7 dias
    )

    // Armazena referência da sessão ativa para o usuário
    await this.redis
      .getClient()
      .set(`user:${user.id}:session`, newSessionId, 'EX', 60 * 60 * 24 * 7)

    return {
      accessToken,
      refreshToken,
      sessionId: newSessionId,
      user: userData,
    }
  }
}
