import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class SessionCheckDto {
  @ApiProperty({
    description: 'ID da sessão a ser verificada',
    example: 'session:123456:1758543992',
  })
  @IsNotEmpty({ message: 'O ID da sessão é obrigatório' })
  @IsString({ message: 'O ID da sessão deve ser uma string' })
  sessionId: string
}