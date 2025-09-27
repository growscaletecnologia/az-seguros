import { ApiProperty } from '@nestjs/swagger'
import {
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator'

export class CreateAvaliationDto {
  @ApiProperty({ description: 'Nome do usuário que fez a avaliação' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string

  @ApiProperty({ description: 'Avaliação de 1 a 5 estrelas' })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number

  @ApiProperty({ description: 'Comentário da avaliação' })
  @IsString()
  @MaxLength(1000)
  comment: string

  @ApiProperty({ description: 'Local/destino da viagem (opcional)', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string

  @ApiProperty({
    description: 'Iniciais ou URL para avatar do usuário (opcional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string

  @ApiProperty({ description: 'Controla se a avaliação está visível', default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean
}
