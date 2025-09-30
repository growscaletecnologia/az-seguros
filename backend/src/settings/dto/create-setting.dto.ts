import { IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateSettingDto {
  @ApiProperty({
    description: 'Chave única da configuração',
    example: 'site_title',
    required: false,
  })
  @IsOptional()
  @IsString()
  key?: string

  @ApiProperty({
    description: 'Valor da configuração',
    example: 'AZ Seguros - Sua proteção em viagem',
    required: false,
  })
  @IsOptional()
  @IsString()
  value?: string

  @ApiProperty({
    description: 'Descrição da configuração',
    example: 'Título principal do site',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({
    description: 'Código GTM para o head',
    example: '<!-- Google Tag Manager -->...',
    required: false,
  })
  @IsOptional()
  @IsString()
  gtm_head_code?: string

  @ApiProperty({
    description: 'Código GTM para o body',
    example: '<!-- Google Tag Manager (noscript) -->...',
    required: false,
  })
  @IsOptional()
  @IsString()
  gtm_body_code?: string
}
