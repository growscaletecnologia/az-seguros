import { IsOptional, IsString } from 'class-validator'

export class UpdateAddressDto {
  @IsString()
  @IsOptional()
  id?: string

  @IsString()
  @IsOptional()
  street?: string

  @IsString()
  @IsOptional()
  city?: string

  @IsString()
  @IsOptional()
  state?: string

  @IsString()
  @IsOptional()
  zipCode?: string

  @IsString()
  @IsOptional()
  country?: string
}
