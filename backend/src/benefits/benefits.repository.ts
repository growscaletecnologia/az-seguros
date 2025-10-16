import { Injectable } from '@nestjs/common';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { UpdateBenefitDto } from './dto/update-benefit.dto';
import prisma from 'src/prisma/client';

@Injectable()
export class BenefitsRepository {


//  async createMany(createBenefitDto: CreateBenefitDto[]) {
//     console.log("chegou no repo")
//     console.log(createBenefitDto)
//    const result = await prisma.planBenefit.createMany({
//       data: createBenefitDto.map((benefit) => ({
//         code: benefit.code,
//         categoryName: benefit.categoryName,
//         name: benefit.name,
//         longDescription: benefit.longDescription,
//       })),
//     });
//     console.log("result dentro do repo", result)
//     return result;
//   }

async createMany(createBenefitDto: CreateBenefitDto[]) {
    console.log('DEBUG: Entrando no método createMany do BenefitsRepository');
    console.log('DEBUG: Dados recebidos no método createMany:', JSON.stringify(createBenefitDto, null, 2));

    try {
      // Verificando se os dados estão no formato esperado
      createBenefitDto.forEach((benefit, index) => {
        console.log(`DEBUG: Validando item ${index + 1}:`, benefit);
        if (!benefit.code || !benefit.categoryName || !benefit.name || !benefit.longDescription) {
          console.error(`ERROR: Dados inválidos no item ${index + 1}:`, benefit);
          throw new Error(`Dados inválidos no item ${index + 1}`);
        }
      });

      // Inserindo os dados no banco
      const result = await prisma.planBenefit.createMany({
        data: createBenefitDto.map((benefit) => ({
          code: Number(benefit.code),
          categoryName: benefit.categoryName,
          name: benefit.name,
          longDescription: benefit.longDescription,
        })),
      });

      console.log('DEBUG: Resultado da operação createMany no Prisma:', result);
      return result;
    } catch (error) {
      console.error('ERROR: Ocorreu um erro no método createMany:', error.message);
      console.error('STACK TRACE:', error.stack);
      throw error;
    }
  }

  /**
   * Cria um novo benefício no banco de dados.
   * @param createBenefitDto Dados do benefício a ser criado.
   * @returns O benefício criado.
   */

  async create(createBenefitDto: CreateBenefitDto) {
    return prisma.planBenefit.create({
      data: {
        code: createBenefitDto.code,
        categoryName: createBenefitDto.categoryName,
        name: createBenefitDto.name,
        longDescription: createBenefitDto.longDescription,
      },
    });
  }

  /**
   * Retorna todos os benefícios cadastrados.
   * @returns Lista de benefícios.
   */
  async findAll() {
    return prisma.planBenefit.findMany();
  }

  /**
   * Retorna um benefício específico pelo ID.
   * @param id ID do benefício.
   * @returns O benefício encontrado ou null.
   */
  async findOne(id: number) {
    return prisma.planBenefit.findUnique({
      where: { id },
    });
  }

  /**
   * Atualiza um benefício existente.
   * @param id ID do benefício a ser atualizado.
   * @param updateBenefitDto Dados atualizados do benefício.
   * @returns O benefício atualizado.
   */
  async update(id: number, updateBenefitDto: UpdateBenefitDto) {
    return prisma.planBenefit.update({
      where: { id },
      data: {
        code: updateBenefitDto.code,
        categoryName: updateBenefitDto.categoryName,
        name: updateBenefitDto.name,
        longDescription: updateBenefitDto.longDescription,
      },
    });
  }

  /**
   * Remove um benefício pelo ID.
   * @param id ID do benefício a ser removido.
   * @returns O benefício removido.
   */
  async remove(id: number) {
    return prisma.planBenefit.delete({
      where: { id },
    });
  }
}