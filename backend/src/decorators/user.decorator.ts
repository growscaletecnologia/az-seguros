import { ExecutionContext, NotFoundException, createParamDecorator, Logger } from '@nestjs/common'
import { User } from '@prisma/client'
import prisma from 'src/prisma/client'

/**
 * Decorator para obter o usuário logado a partir do token JWT
 * 
 * Este decorator extrai o userId do objeto request.user (fornecido pelo JwtStrategy)
 * e retorna o objeto de usuário completo do banco de dados.
 * 
 * Uso: @LoggedUser() user: User
 */
export const LoggedUser = createParamDecorator(async (data: string, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest()
  const logger = new Logger('LoggedUser')

  if (!request.user) {
    logger.error('User não encontrado no request')
    throw new NotFoundException("User doesn't exist")
  }

  // O JWT Strategy retorna { userId, role }, então precisamos extrair o userId
  const userId = request.user.userId || request.user.id

  if (!userId) {
    logger.error('userId não encontrado no token', request.user)
    throw new NotFoundException('User ID not found in token')
  }

  // Busca o usuário completo no banco de dados
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { addresses: true },
    })

    if (!user) {
      logger.error(`Usuário com ID ${userId} não encontrado no banco de dados`)
      throw new NotFoundException(`User with ID ${userId} not found`)
    }

    logger.log(`Usuário ${user.name} (${user.id}) carregado com sucesso`)
    return user
  } catch (error) {
    logger.error(`Erro ao buscar usuário: ${error.message}`)
    throw error
  }
})
