import { ApiProperty } from '@nestjs/swagger'
import {
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  IsBoolean,
  Min,
  IsEnum,
} from 'class-validator'

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

enum CouponStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  REDEEMED = 'REDEEMED',
  EXPIRED = 'EXPIRED',
}
export class CreateCouponDto {
  @ApiProperty({ description: 'Código do cupom' })
  @IsString()
  code: string

  @ApiProperty({ description: 'Valor do desconto' })
  @IsNumber()
  @Min(0)
  discount: number

  @ApiProperty({ description: 'Status do cupom', enum: CouponStatus })
  @IsEnum(CouponStatus)
  status: CouponStatus

  @ApiProperty({ description: 'Tipo de desconto (percentual ou valor fixo)', enum: DiscountType })
  @IsEnum(DiscountType)
  discountType: DiscountType

  @ApiProperty({ description: 'Data de expiração do cupom' })
  @IsDateString()
  expiresAt: string

  @ApiProperty({ description: 'ID do usuário que criou o cupom' })
  @IsString()
  userId: string

  @ApiProperty({ description: 'Limite de uso do cupom', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  usageLimit?: number

  @ApiProperty({
    description: 'Indica se o cupom pode ser exibido na tela inicial',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  front_publishable?: boolean

  @ApiProperty({ description: 'Descrição do cupom', required: false })
  @IsOptional()
  @IsString()
  description?: string
}
