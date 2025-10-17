import {
  IsString,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsOptional,
  IsDateString,
  IsBoolean,
} from 'class-validator'
import { Type } from 'class-transformer'
import { IsAfterOrEqualToday } from 'src/common/validators/is-after-or-equal-today.validator'

class PassengerDto {
  @IsString()
  type: string

  @IsString()
  age: number
}

export class QuoteRequestDto {
  @IsString()
  dateFormat: string

  @IsOptional()
  @IsBoolean()
  multitrip?: boolean

  @IsOptional()
  multitrip_days?: number

  @IsDateString()
  @IsAfterOrEqualToday({ message: 'A data de partida deve ser hoje ou posterior.' })
  departure: string

  @IsDateString()
  @IsAfterOrEqualToday({ message: 'A data de chegada deve ser hoje ou posterior.' })
  arrival: string

  @IsString()
  slug: string 

  @IsOptional()
  @IsBoolean()
  priceDetails?: boolean

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PassengerDto)
  passengers: PassengerDto[]


  @IsOptional()
  @IsString()
  couponCode?: string
}
