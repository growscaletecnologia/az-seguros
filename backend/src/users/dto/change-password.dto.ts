// users/dto/change-password.dto.ts
import { IsNotEmpty, MinLength, Matches } from 'class-validator'

export class ChangePasswordDto {
  @IsNotEmpty() currentPassword: string
  @MinLength(6)
  @Matches(/[0-9]/, { message: 'A nova senha deve conter pelo menos um número' })
  @Matches(/[^\w\s]/, { message: 'A nova senha deve conter pelo menos um caractere especial' })
  newPassword: string
}
