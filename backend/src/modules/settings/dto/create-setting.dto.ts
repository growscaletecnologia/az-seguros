import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateSettingDto {
  @ApiProperty({ description: 'Chave única da configuração' })
  @IsString()
  @IsNotEmpty()
  key: string

  @ApiProperty({ description: 'Valor da configuração' })
  @IsString()
  @IsNotEmpty()
  value: string

  @ApiProperty({ description: 'Descrição da configuração', required: false })
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({ description: 'Código GTM para o head', required: false })
  @IsString()
  @IsOptional()
  gtm_head_code?: string

  @ApiProperty({ description: 'Código GTM para o body', required: false })
  @IsString()
  @IsOptional()
  gtm_body_code?: string
}
