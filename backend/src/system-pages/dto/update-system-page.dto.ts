import { ApiProperty } from '@nestjs/swagger'
import { SystemPageStatus, SystemPageType } from '@prisma/client'
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator'

export class UpdateSystemPageDto {
  @IsString()
  @IsOptional()
  @MaxLength(255, {
    message: 'O título deve ter no máximo 255 caracteres.',
  })
  @ApiProperty({ example: 'Termos de Uso Atualizados' })
  title?: string

  @IsString()
  @IsOptional()
  @MaxLength(255, {
    message: 'O slug deve ter no máximo 255 caracteres.',
  })
  @ApiProperty({ example: 'termos-de-uso' })
  slug?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '<h1>Termos de Uso Atualizados</h1><p>Conteúdo dos termos...</p>' })
  content?: string

  @IsEnum(SystemPageType)
  @IsOptional()
  @ApiProperty({ enum: SystemPageType, example: SystemPageType.TERMS })
  type?: SystemPageType

  @IsEnum(SystemPageStatus)
  @IsOptional()
  @ApiProperty({ enum: SystemPageStatus, example: SystemPageStatus.PUBLISHED })
  status?: SystemPageStatus
}
