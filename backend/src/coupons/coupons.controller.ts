import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { CouponsService } from './coupons.service'
import { CreateCouponDto } from './dto/create-coupon.dto'
import { UpdateCouponDto } from './dto/update-coupon.dto'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Criar um novo cupom' })
  @ApiResponse({ status: 201, description: 'Cupom criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponsService.create(createCouponDto)
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar todos os cupons' })
  @ApiResponse({ status: 200, description: 'Lista de cupons retornada com sucesso' })
  findAll() {
    return this.couponsService.findAll()
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Buscar cupom pelo código' })
  @ApiResponse({ status: 200, description: 'Cupom encontrado' })
  @ApiResponse({ status: 404, description: 'Cupom não encontrado' })
  findByCode(@Param('code') code: string) {
    return this.couponsService.findByCode(code)
  }

  @Get('public')
  @ApiOperation({ summary: 'Listar cupons publicáveis na tela inicial' })
  @ApiResponse({ status: 200, description: 'Lista de cupons públicos retornada com sucesso' })
  async findPublicCoupons() {
    const allCoupons = await this.couponsService.findAll()
    return allCoupons.filter((coupon) => coupon.front_publishable)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Buscar cupom pelo ID' })
  @ApiResponse({ status: 200, description: 'Cupom encontrado' })
  @ApiResponse({ status: 404, description: 'Cupom não encontrado' })
  findOne(@Param('id') id: string) {
    return this.couponsService.findOne(id)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Atualizar um cupom' })
  @ApiResponse({ status: 200, description: 'Cupom atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Cupom não encontrado' })
  update(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
    return this.couponsService.update(id, updateCouponDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remover um cupom (soft delete)' })
  @ApiResponse({ status: 200, description: 'Cupom removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Cupom não encontrado' })
  remove(@Param('id') id: string) {
    return this.couponsService.remove(id)
  }

  @Post(':id/use')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Registrar uso de um cupom' })
  @ApiResponse({ status: 201, description: 'Uso de cupom registrado com sucesso' })
  @ApiResponse({ status: 400, description: 'Cupom inválido ou expirado' })
  @ApiResponse({ status: 404, description: 'Cupom não encontrado' })
  registerUsage(@Param('id') id: string, @Body() data: { userId: string; orderId?: string }) {
    return this.couponsService.registerCouponUsage(id, data.userId, data.orderId)
  }
}
