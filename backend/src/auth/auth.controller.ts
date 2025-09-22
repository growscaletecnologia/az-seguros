import { Controller, Post, Body, UseGuards, Req, Query, Get } from '@nestjs/common'
import { AuthService } from './auth.service'
import { DoResetDto } from './dto/do-reset.dto'
import { RequestPasswordResetDto } from './dto/request-password-reset.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password)
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
}
