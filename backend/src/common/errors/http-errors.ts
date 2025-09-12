import { HttpException, HttpStatus } from '@nestjs/common'

export class BadRequestError extends HttpException {
  constructor(message = 'Bad Request') {
    super({ statusCode: HttpStatus.BAD_REQUEST, message }, HttpStatus.BAD_REQUEST)
  }
}

export class ConflictError extends HttpException {
  constructor(message = 'Conflict') {
    super({ statusCode: HttpStatus.CONFLICT, message }, HttpStatus.CONFLICT)
  }
}

export class NotFoundError extends HttpException {
  constructor(message = 'Not Found') {
    super({ statusCode: HttpStatus.NOT_FOUND, message }, HttpStatus.NOT_FOUND)
  }
}

export class UnauthorizedError extends HttpException {
  constructor(message = 'Unauthorized') {
    super({ statusCode: HttpStatus.UNAUTHORIZED, message }, HttpStatus.UNAUTHORIZED)
  }
}

export class ForbiddenError extends HttpException {
  constructor(message = 'Forbidden') {
    super({ statusCode: HttpStatus.FORBIDDEN, message }, HttpStatus.FORBIDDEN)
  }
}
