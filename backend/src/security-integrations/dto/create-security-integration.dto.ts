import { ApiProperty } from '@nestjs/swagger'
import { InsurerCodeEnum } from '@prisma/client'
import { IsNotEmpty, IsString, IsInt, IsOptional, IsBoolean } from 'class-validator'

export class CreateSecurityIntegrationDto {
  @ApiProperty({ description: 'Nome da Seguradora' })
  @IsNotEmpty()
  @IsString()
  insurerName: string

  @ApiProperty({ description: 'Tipo de concessão (password, client_credentials, etc.)' })
  @IsNotEmpty()
  @IsString()
  grantType: string

  @ApiProperty({ description: 'ID do cliente' })
  @IsNotEmpty()
  @IsInt()
  clientId: number

  @ApiProperty({ description: 'Segredo do cliente' })
  @IsNotEmpty()
  @IsString()
  clientSecret: string

  @ApiProperty({ description: 'Nome de usuário para autenticação' })
  @IsNotEmpty()
  @IsString()
  username: string

  @ApiProperty({ description: 'Senha do usuário para autenticação' })
  @IsNotEmpty()
  @IsString()
  password: string

  @ApiProperty({ description: 'Escopo de acesso solicitado (opcional)', required: false })
  @IsOptional()
  @IsString()
  scope?: string

  @ApiProperty({ description: 'Status ativo/inativo da integração', required: false })
  @IsOptional()
  @IsBoolean()
  ativa: boolean

  @ApiProperty({ description: 'Markup para cálculo de seguro', required: false })
  @IsOptional()
  @IsInt()
  markUp?: number

  @ApiProperty({ description: 'URL base para autenticação', required: false })
  @IsOptional()
  @IsString()
  baseUrl?: string

  @ApiProperty({ description: 'URL de autenticação', required: false })
  @IsOptional()
  @IsString()
  authUrl?: string

  @ApiProperty({ description: 'Código da Seguradora', required: false })
  @IsOptional()
  @IsString()
  insurerCode?: InsurerCodeEnum
}
