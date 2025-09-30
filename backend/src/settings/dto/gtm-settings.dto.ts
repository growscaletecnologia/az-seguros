import { IsString, IsOptional, MaxLength, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/**
 * DTO para validação das configurações do Google Tag Manager
 */
export class GtmSettingsDto {
  @ApiProperty({
    description: 'Código GTM para inserção no head da página',
    example:
      "<!-- Google Tag Manager -->\n<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\nnew Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\nj=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\n'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);\n})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>\n<!-- End Google Tag Manager -->",
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Código GTM do head deve ser uma string' })
  @MaxLength(5000, { message: 'Código GTM do head não pode exceder 5000 caracteres' })
  @Matches(/^$|<!-- Google Tag Manager.*?-->[\s\S]*?<!-- End Google Tag Manager.*?-->/, {
    message: 'Código GTM do head deve seguir o formato padrão do Google Tag Manager',
  })
  gtm_head_code: string

  @ApiProperty({
    description: 'Código GTM para inserção no body da página (noscript)',
    example:
      '<!-- Google Tag Manager (noscript) -->\n<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"\nheight="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>\n<!-- End Google Tag Manager (noscript) -->',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Código GTM do body deve ser uma string' })
  @MaxLength(2000, { message: 'Código GTM do body não pode exceder 2000 caracteres' })
  @Matches(
    /^$|<!-- Google Tag Manager \(noscript\).*?-->[\s\S]*?<!-- End Google Tag Manager \(noscript\).*?-->/,
    { message: 'Código GTM do body deve seguir o formato padrão do Google Tag Manager (noscript)' },
  )
  gtm_body_code: string
}

/**
 * DTO para resposta das configurações GTM
 */
export class GtmSettingsResponseDto {
  @ApiProperty({
    description: 'Código GTM para o head',
    example: '<!-- Google Tag Manager -->...',
  })
  gtm_head_code: string

  @ApiProperty({
    description: 'Código GTM para o body',
    example: '<!-- Google Tag Manager (noscript) -->...',
  })
  gtm_body_code: string

  @ApiProperty({
    description: 'ID do GTM extraído do código (se disponível)',
    example: 'GTM-XXXXXXX',
    required: false,
  })
  gtm_id?: string

  @ApiProperty({
    description: 'Data da última atualização',
    example: '2024-01-15T10:30:00Z',
  })
  updated_at: Date
}
