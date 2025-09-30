import { ExecutionContext, NotFoundException, createParamDecorator } from '@nestjs/common'
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

  if (!request.user) {
    throw new NotFoundException("User doesn't exist")
  }

  // Debug temporário para ver o que está chegando
  console.log('[LoggedUser DEBUG] request.user:', JSON.stringify(request.user, null, 2))

  // O JWT Strategy retorna { userId, role }, então precisamos extrair o userId
  const userId = request.user.userId || request.user.id

  console.log('[LoggedUser DEBUG] userId extraído:', userId)

  if (!userId) {
    throw new NotFoundException('User ID not found in token')
  }

  // Busca o usuário completo no banco de dados
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { addresses: true },
  })

  if (!user) {
    console.log('[LoggedUser DEBUG] Usuário não encontrado com ID:', userId)
    throw new NotFoundException(`User with ID ${userId} not found`)
  }

  console.log('[LoggedUser DEBUG] Usuário encontrado:', user.name, user.id)
  return user
})
