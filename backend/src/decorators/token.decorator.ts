import {
  ExecutionContext,
  createParamDecorator,
  InternalServerErrorException,
} from '@nestjs/common'
import { User } from '@prisma/client'

export const GetToken = createParamDecorator((data: string, context: ExecutionContext): User => {
  const request = context.switchToHttp().getRequest()
  if (!request.token) throw new InternalServerErrorException()

  return request.token
})
