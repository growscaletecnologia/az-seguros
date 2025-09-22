import { Controller, Post, Body, UseGuards, Req, Query, Get } from '@nestjs/common'
import { AuthService } from './auth.service'
import { DoResetDto } from './dto/do-reset.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { SessionService } from './session.service'
import { SessionCheckDto } from './dto/session.dto'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    console.log(body.email, body.password)
    const user = await this.authService.validateUser(body.email, body.password)
    console.log('user', user)
    return this.authService.login(user)
  }

  // precisa estar autenticado para enviar verificação novamente
  @UseGuards(JwtAuthGuard)
  // @Post('send-verification')
  // async sendVerification(@Req() req: any) {
  //   return this.authService.sendVerificationEmail(req.user.userId)
  // }

  // o front vai chamar essa rota quando o usuário clicar no link do e-mail
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token)
  }

  // pedido de reset (mensagem sempre neutra)
  // @Post('request-password-reset')
  // async requestReset(@Body() dto: RequestPasswordResetDto) {
  //   return this.authService.requestPasswordReset(dto.email)
  // }

  // realizar o reset com token + nova senha
  @Post('reset-password')
  async doReset(@Body() dto: DoResetDto) {
    return this.authService.doPasswordReset(dto.token, dto.newPassword)
  }

  @ApiOperation({ summary: 'Verifica se a sessão está ativa' })
  @ApiResponse({ status: 200, description: 'Sessão válida' })
  @ApiResponse({ status: 401, description: 'Sessão inválida ou expirada' })
  @Post('session/check')
  async checkSession(@Body() dto: SessionCheckDto) {
    const session = await this.sessionService.validateSession(dto.sessionId)
    if (!session) {
      return { valid: false, message: 'Sessão inválida ou expirada' }
    }
    return { valid: true, user: session.userData }
  }

  @ApiOperation({ summary: 'Verifica se o usuário tem sessão ativa' })
  @ApiResponse({ status: 200, description: 'Retorna status da sessão do usuário' })
  @UseGuards(JwtAuthGuard)
  @Get('session/user')
  async getUserSession(@Req() req: any) {
    const userId = req.user.sub
    const session = await this.sessionService.getUserActiveSession(userId)
    if (!session) {
      return { active: false, message: 'Usuário não possui sessão ativa' }
    }
    return { active: true, lastActivity: session.lastActivity }
  }

  @ApiOperation({ summary: 'Invalida a sessão atual do usuário' })
  @ApiResponse({ status: 200, description: 'Sessão invalidada com sucesso' })
  @UseGuards(JwtAuthGuard)
  @Post('session/logout')
  async logout(@Req() req: any) {
    const userId = req.user.sub
    await this.sessionService.invalidateAllUserSessions(userId)
    return { message: 'Logout realizado com sucesso' }
  }
}
