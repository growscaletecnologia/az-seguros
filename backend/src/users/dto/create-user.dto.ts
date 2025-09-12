import { IsEmail, IsOptional, IsString, MinLength, IsDateString } from 'class-validator'
import { CreateAddressDto } from 'src/address/dto/create-address.dto'

export class CreateUserDto {
  @IsEmail()
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

  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string

  @IsString()
  @IsOptional()
  oldPassword?: string

  // Se for permitir criar o endereço junto:
  @IsOptional()
  addresses?: CreateAddressDto[]
}
