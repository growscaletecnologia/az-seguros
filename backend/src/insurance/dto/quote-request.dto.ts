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
  multitrip?: boolean

  @IsOptional()
  multitrip_days?: number

  @IsDateString()
  departure: string

  @IsDateString()
  arrival: string

  @IsString()
  destinyGroup: string

  @IsBoolean()
  @IsOptional()
  priceDetails?: boolean

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PassengerDto)
  passengers: PassengerDto[]

  // @IsString()
  // @IsOptional()
  // currency?: string

  // @IsOptional()
  // previewMode?: boolean
}
