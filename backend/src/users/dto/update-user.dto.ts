import { IsEmail, IsOptional, IsString, MinLength, IsDateString, IsEnum } from 'class-validator'
import { UpdateAddressDto } from 'src/address/dto/update-address.dto'
import { Role, UserStatus } from 'src/enums/Roles'

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string

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

  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  @IsOptional()
  password?: string

  @IsString()
  @IsOptional()
  oldPassword?: string

  @IsOptional()
  addresses?: UpdateAddressDto[]

  @IsEnum(Role)
  @IsOptional()
  role?: Role

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus

  @IsOptional()
  emailVerifiedAt?: Date | null
}
