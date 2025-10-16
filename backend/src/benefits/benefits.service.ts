import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { UpdateBenefitDto } from './dto/update-benefit.dto';
import { BenefitsRepository } from './benefits.repository';
import { AssignBenefitsDto } from './dto/assign.benefit.dto';
import prisma from 'src/prisma/client';

@Injectable()
export class BenefitsService {
  constructor(private readonly benefitsRepository: BenefitsRepository) {}

  /**
   * Cria um novo benefício.
   * @param createBenefitDto Dados do benefício a ser criado.
   * @returns O benefício criado.
   */
  async create(createBenefitDto: CreateBenefitDto) {
    return this.benefitsRepository.create(createBenefitDto);
  }

  /**
   * Cria múltiplos benefícios.
   * @param createBenefitDto Lista de benefícios a serem criados.
   * @returns Resultado da operação de criação em massa.
   */
  async createMany(createBenefitDto: CreateBenefitDto[]) {
    return this.benefitsRepository.createMany(createBenefitDto);
  }

  /**
   * Retorna todos os benefícios cadastrados.
   * @returns Lista de benefícios.
   */
  async findAll() {
    return this.benefitsRepository.findAll();
  }

  /**
   * Retorna um benefício específico pelo ID.
   * @param id ID do benefício.
   * @returns O benefício encontrado ou null.
   */
  async findOne(id: number) {
    return this.benefitsRepository.findOne(id);
  }

  /**
   * Atualiza um benefício existente.
   * @param id ID do benefício a ser atualizado.
   * @param updateBenefitDto Dados atualizados do benefício.
   * @returns O benefício atualizado.
   */
  async update(id: number, updateBenefitDto: UpdateBenefitDto) {
    return this.benefitsRepository.update(id, updateBenefitDto);
  }

  /**
   * Remove um benefício pelo ID.
   * @param id ID do benefício a ser removido.
   * @returns O benefício removido.
   */
  async remove(id: number) {
    return this.benefitsRepository.remove(id);
  }


  async assignBenefits(dto: AssignBenefitsDto) {
    const { planId, benefitIds, skipDuplicates } = dto;

    console.log("bateu na service ", dto)
    // Validação básica
    const plan = await prisma.insurerPlan.findUnique({ where: { id: planId } });
    if (!plan) throw new NotFoundException(`Plano ${planId} não encontrado`);

    const benefits = await prisma.planBenefit.findMany({
      where: { id: { in: benefitIds } },
    });
    if (benefits.length === 0) throw new NotFoundException(`Nenhum benefício válido encontrado`);

    await this.benefitsRepository.assignBenefitsToPlan(planId, benefits.map(b => b.id), skipDuplicates);

    // Retorna o plano com os benefícios
    return this.benefitsRepository.findBenefitsByPlan(planId);
  }
}