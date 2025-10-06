import { IsString, IsArray, ArrayMinSize, ValidateNested, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

class PassengerDto {
  @IsString()
  age: number;
}

export class QuoteRequestDto {
  @IsString()
  destination: string;

  @IsDateString()
  travelStart: string;

  @IsDateString()
  travelEnd: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PassengerDto)
  passengers: PassengerDto[];

  @IsString()
  @IsOptional()
  currency?: string;

  @IsOptional()
  previewMode?: boolean;
}