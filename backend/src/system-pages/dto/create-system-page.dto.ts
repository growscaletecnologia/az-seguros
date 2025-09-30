import { ApiProperty } from '@nestjs/swagger'
import { SystemPageStatus, SystemPageType } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateSystemPageDto {
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  @MaxLength(255, {
    message: 'O título deve ter no máximo 255 caracteres.',
  })
  @ApiProperty({ example: 'Termos de Uso' })
  title: string

  @IsString()
  @IsNotEmpty({ message: 'O slug é obrigatório.' })
  @MaxLength(255, {
    message: 'O slug deve ter no máximo 255 caracteres.',
  })
  @ApiProperty({ example: 'termos-de-uso' })
  slug: string

  @IsString()
  @IsNotEmpty({ message: 'O conteúdo é obrigatório.' })
  @ApiProperty({ example: '<h1>Termos de Uso</h1><p>Conteúdo dos termos...</p>' })
  content: string

  @IsEnum(SystemPageType)
  @IsNotEmpty({ message: 'O tipo da página é obrigatório.' })
  @ApiProperty({ enum: SystemPageType, example: SystemPageType.TERMS })
  type: SystemPageType

  @IsEnum(SystemPageStatus)
  @IsOptional()
  @ApiProperty({ enum: SystemPageStatus, example: SystemPageStatus.PUBLISHED })
  status?: SystemPageStatus
}