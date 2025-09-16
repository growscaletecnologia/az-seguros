import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsDateString,
  IsNotEmpty,
  Matches,
  IsEnum,
} from 'class-validator'
import { CreateAddressDto } from 'src/address/dto/create-address.dto'
import { Role } from '../../enums/Roles'
import { UserStatus } from '@prisma/client'

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  phone?: string

  @IsString()
  @IsOptional()
  cpfCnpj?: string

  @IsDateString()
  @IsOptional()
  birthDate?: Date

  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  @Matches(/[0-9]/, { message: 'A senha deve conter pelo menos um número' })
  @Matches(/[^\w\s]/, { message: 'A senha deve conter pelo menos um caractere especial' })
  password: string

  @IsString()
  @IsOptional()
  oldPassword?: string

  @IsOptional()
  addresses?: CreateAddressDto[]

  @IsEnum(Role)
  @IsOptional()
  role?: Role

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus

  @IsOptional()
  emailVerifiedAt?: Date | null

  @IsOptional()
  createdAt?: Date
}
