import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class GtmSettingsDto {
  @ApiProperty({ description: 'Código GTM para o head' })
  @IsString()
  @IsNotEmpty()
  gtm_head_code: string

  @ApiProperty({ description: 'Código GTM para o body' })
  @IsString()
  @IsNotEmpty()
  gtm_body_code: string
}
