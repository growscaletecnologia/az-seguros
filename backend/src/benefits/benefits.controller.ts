import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BenefitsService } from './benefits.service';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { UpdateBenefitDto } from './dto/update-benefit.dto';

@Controller('benefits')
export class BenefitsController {
  constructor(private readonly benefitsService: BenefitsService) {}

  /**
   * Endpoint para criar um novo benefício.
   * @param createBenefitDto Dados do benefício a ser criado.
   * @returns O benefício criado.
   */
  @Post()
  create(@Body() createBenefitDto: CreateBenefitDto) {
    return this.benefitsService.create(createBenefitDto);
  }

  /**
   * Endpoint para criar múltiplos benefícios.
   * @param createBenefitDto Lista de benefícios a serem criados.
   * @returns Resultado da operação de criação em massa.
   */
  @Post('bulk')
  createMany(@Body() createBenefitDto: CreateBenefitDto[]) {
    return this.benefitsService.createMany(createBenefitDto);
  }

  /**
   * Endpoint para listar todos os benefícios.
   * @returns Lista de benefícios.
   */
  @Get()
  findAll() {
    return this.benefitsService.findAll();
  }

  /**
   * Endpoint para buscar um benefício específico pelo ID.
   * @param id ID do benefício.
   * @returns O benefício encontrado ou null.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.benefitsService.findOne(+id);
  }

  /**
   * Endpoint para atualizar um benefício existente.
   * @param id ID do benefício a ser atualizado.
   * @param updateBenefitDto Dados atualizados do benefício.
   * @returns O benefício atualizado.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBenefitDto: UpdateBenefitDto) {
    return this.benefitsService.update(+id, updateBenefitDto);
  }

  /**
   * Endpoint para remover um benefício pelo ID.
   * @param id ID do benefício a ser removido.
   * @returns O benefício removido.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.benefitsService.remove(+id);
  }
}