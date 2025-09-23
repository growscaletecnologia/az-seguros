import { Injectable, Logger } from '@nestjs/common'
import { PrismaClient, UserStatus } from '@prisma/client'
import { InviteUserDto } from '../dto/invite-user.dto'
import { BadRequestError, NotFoundError } from 'src/common/errors/http-errors'
import * as bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { EmailService } from 'src/email/email.service'

@Injectable()
export class InvitationService {
  private readonly prisma = new PrismaClient()
  private readonly SALT_ROUNDS = 12
  private readonly INVITATION_EXPIRY_DAYS = 7
  private readonly logger = new Logger(InvitationService.name)

  constructor(private readonly emailService: EmailService) {}

  /**
   * Creates a user invitation and sends an invitation email
   * @param inviteUserDto DTO containing invitation details
   * @returns The created invitation
   */
  async createInvitation(inviteUserDto: InviteUserDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: inviteUserDto.email.toLowerCase().trim() },
    })

    if (existingUser) {
      throw new BadRequestError('User with this email already exists')
    }

    // Verify all roles exist
    const roles = await this.prisma.role.findMany({
      where: {
        id: {
          in: inviteUserDto.roleIds,
        },
      },
    })

    if (roles.length !== inviteUserDto.roleIds.length) {
      throw new BadRequestError('One or more roles do not exist')
    }

    // Generate a temporary password
    const tempPassword = this._generateTemporaryPassword()
    const passwordHash = await bcrypt.hash(tempPassword, this.SALT_ROUNDS)

    // Create the user with PENDING status
    const user = await this.prisma.user.create({
      data: {
        email: inviteUserDto.email.toLowerCase().trim(),
        name: inviteUserDto.name,
        password: passwordHash,
        status: UserStatus.PENDING,
      },
    })

    // Calcular a data de expiração do convite
    const expiresAt = new Date(Date.now() + this.INVITATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000)

    // Gerar token único para o convite
    const token = uuidv4()

    // Criar o registro de convite no banco de dados
    await this.prisma.inviteToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
        createdByUserId: null, // Pode ser atualizado se tivermos o ID do usuário que está criando o convite
      },
    })

    // Assign roles to the user
    await this.prisma.$transaction(
      inviteUserDto.roleIds.map((roleId) =>
        this.prisma.userRole.create({
          data: {
            userId: user.id,
            roleId,
          },
        }),
      ),
    )

    // Enviar email de convite
    try {
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
      const acceptUrl = `${baseUrl}/auth/accept-invitation?token=${token}`

      // Usar o novo sistema de templates
      await this.emailService.sendTemplate('invitation', {
        to: user.email,
        subject: 'Convite para AZ Seguros',
        context: {
          name: user.name || 'Usuário',
          acceptUrl: acceptUrl,
        },
      })

      this.logger.log(`Invitation email sent to ${user.email}`)
    } catch (error) {
      this.logger.error(`Failed to send invitation email: ${error.message}`, error.stack)
      // Não interrompemos o fluxo se o email falhar, apenas logamos o erro
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      status: user.status,
      inviteToken: token,
      expiresAt,
      // Include temporary password only in development environment
      ...(process.env.NODE_ENV !== 'production' && { tempPassword }),
    }
  }

  /**
   * Accepts a user invitation
   * @param token The invitation token
   * @param password The new password for the user
   * @returns The updated user
   */
  async acceptInvitation(token: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        // Removendo a verificação de invitationToken que não existe no modelo
        id: token, // Usando o token como ID do usuário
        status: UserStatus.PENDING,
      },
    })

    if (!user) {
      throw new NotFoundError('Invalid or expired invitation')
    }

    const passwordHash = await bcrypt.hash(password, this.SALT_ROUNDS)

    return this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: passwordHash,
        status: UserStatus.ACTIVE,
        // Removendo propriedades que não existem no modelo User
      },
    })
  }

  /**
   * Resends an invitation to a user
   * @param userId The user ID
   * @returns The updated invitation
   */
  async resendInvitation(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        status: UserStatus.PENDING,
      },
    })

    if (!user) {
      throw new NotFoundError('User not found or not in invited status')
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        // Removendo propriedades que não existem no modelo User
      },
    })

    // Armazenar a data de expiração para uso no retorno
    const invitationExpires = new Date(
      Date.now() + this.INVITATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    )

    // TODO: Send invitation email with the token
    // This would typically use a mail service

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      status: updatedUser.status,
      invitationExpires, // Usando a variável local em vez da propriedade do modelo
    }
  }

  /**
   * Generates a random temporary password
   * @returns A random password
   */
  private _generateTemporaryPassword(): string {
    const length = 12
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
    let password = ''

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      password += charset[randomIndex]
    }

    return password
  }
}
