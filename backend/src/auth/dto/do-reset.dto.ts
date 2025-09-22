import { IsNotEmpty, Matches, MinLength } from 'class-validator'

export class DoResetDto {
  @IsNotEmpty()
  token!: string

  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  @Matches(/[0-9]/, { message: 'A senha deve conter pelo menos um número' })
  @Matches(/[^\w\s]/, { message: 'A senha deve conter pelo menos um caractere especial' })
  newPassword!: string
}
