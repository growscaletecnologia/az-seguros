
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateBenefitDto {
  @IsNumber()
  code: number

  @IsString()
  categoryName: string


  @IsString()
  name: string

  @IsOptional()
  @IsString()
  longDescription: string
    
}


