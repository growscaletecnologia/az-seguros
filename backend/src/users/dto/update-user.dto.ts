import { IsEmail, IsOptional, IsString, MinLength, IsDateString } from 'class-validator'
import { UpdateAddressDto } from 'src/address/dto/update-address.dto'

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
}
