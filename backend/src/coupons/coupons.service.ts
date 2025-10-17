import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaClient, CoupomStatus } from '@prisma/client'
import { CreateCouponDto } from './dto/create-coupon.dto'
import { UpdateCouponDto } from './dto/update-coupon.dto'

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Cria um novo cupom de desconto
   * @param createCouponDto Dados do cupom a ser criado
   * @returns O cupom criado
   */
  async create(createCouponDto: CreateCouponDto) {
    // Verifica se já existe um cupom com o mesmo código
    const existingCoupon = await this.prisma.coupom.findUnique({
      where: { code: createCouponDto.code },
    })

    if (existingCoupon) {
      throw new BadRequestException('Já existe um cupom com este código')
    }

    return this.prisma.coupom.create({
      data: {
        code: createCouponDto.code,
        discount: createCouponDto.discount,
        discountType: createCouponDto.discountType,
        expiresAt: new Date(createCouponDto.expiresAt),
        userId: createCouponDto.userId,
        usageLimit: createCouponDto.usageLimit,
        front_publishable: createCouponDto.front_publishable || false,
        description: createCouponDto.description,
        status: createCouponDto.status || CoupomStatus.ACTIVE,
      },
    })
  }

  /**
   * Retorna todos os cupons não excluídos
   * @returns Lista de cupons
   */
  async findAll() {
    return this.prisma.coupom.findMany({
      where: { deleted: false },
      include: {
        usages: true,
      },
    })
  }

  /**
   * Retorna um cupom específico pelo ID
   * @param id ID do cupom
   * @returns O cupom encontrado
   */
  async findOne(id: string) {
    const coupon = await this.prisma.coupom.findFirst({
      where: { id, deleted: false },
      include: {
        usages: true,
      },
    })

    if (!coupon) {
      throw new NotFoundException(`Cupom com ID ${id} não encontrado`)
    }

    return coupon
  }

  /**
   * Busca um cupom pelo código
   * @param code Código do cupom
   * @returns O cupom encontrado
   */
  // No seu serviço, onde o método findByCode está
 async findByCode(code: string) {
    // 1. Busca o cupom APENAS pelo código para verificar sua existência inicial.
    const couponWithUsage = await this.prisma.coupom.findFirst({
        where: {
            code,
            deleted: false, // Mantemos o soft delete fora
        },
        include: {
            // Inclui a contagem de usos
            _count: {
                select: {
                    usages: true,
                },
            },
        },
    });

    // ===============================================
    // VALIDAÇÃO 1: Cupom Não Encontrado (Código Incorreto)
    // ===============================================
    if (!couponWithUsage) {
        throw new NotFoundException(`Cupom com código "${code}" não existe.`);
    }

    const { _count, ...coupon } = couponWithUsage; // Separa a contagem

    // ===============================================
    // VALIDAÇÃO 2: Status (Inativo/Suspenso)
    // ===============================================
    if (coupon.status !== CoupomStatus.ACTIVE) {
        // Retornar 400 Bad Request ou uma exceção personalizada de status
        throw new BadRequestException(`Cupom "${code}" está inativo.`);
    }

    // ===============================================
    // VALIDAÇÃO 3: Data de Expiração
    // ===============================================
    const now = new Date();
    if (coupon.expiresAt < now) {
        // Retornar 400 Bad Request ou uma exceção personalizada de expiração
        throw new BadRequestException(`Cupom "${code}" expirou em ${coupon.expiresAt.toISOString().split('T')[0]}.`);
    }

    // ===============================================
    // VALIDAÇÃO 4: Limite de Uso
    // ===============================================
    const usages = _count.usages;
    const usageLimit = coupon.usageLimit;
    
    if (usageLimit !== null && usages >= usageLimit) {
        // Retornar 400 Bad Request ou uma exceção personalizada de limite
        throw new BadRequestException(`Cupom "${code}" atingiu seu limite máximo de usos (${usageLimit}).`);
    }
    
    // Retorna o cupom válido (e pode incluir o uso restante para o frontend, se desejar)
    return {
        ...coupon,
        usagesLeft: usageLimit !== null ? usageLimit - usages : null,
    }; 
} 
  /**
   * Atualiza um cupom existente
   * @param id ID do cupom
   * @param updateCouponDto Dados para atualização
   * @returns O cupom atualizado
   */
  async update(id: string, updateCouponDto: UpdateCouponDto) {
    // Verifica se o cupom existe
    await this.findOne(id)

    // Verifica se está tentando atualizar para um código que já existe
    if (updateCouponDto.code) {
      const existingCoupon = await this.prisma.coupom.findFirst({
        where: {
          code: updateCouponDto.code,
          id: { not: id },
        },
      })

      if (existingCoupon) {
        throw new BadRequestException('Já existe outro cupom com este código')
      }
    }

    return this.prisma.coupom.update({
      where: { id },
      data: {
        ...(updateCouponDto.code && { code: updateCouponDto.code }),
        ...(updateCouponDto.discount !== undefined && { discount: updateCouponDto.discount }),
        ...(updateCouponDto.discountType && { discountType: updateCouponDto.discountType }),
        ...(updateCouponDto.expiresAt && { expiresAt: new Date(updateCouponDto.expiresAt) }),
        ...(updateCouponDto.status && { status: updateCouponDto.status }),
        ...(updateCouponDto.usageLimit !== undefined && { usageLimit: updateCouponDto.usageLimit }),
        ...(updateCouponDto.front_publishable !== undefined && {
          front_publishable: updateCouponDto.front_publishable,
        }),
        ...(updateCouponDto.description !== undefined && {
          description: updateCouponDto.description,
        }),
        updatedAt: new Date(),
      },
    })
  }

  /**
   * Remove um cupom (exclusão permanente ou soft delete)
   * @param id ID do cupom
   * @param obliterate Se true, realiza exclusão permanente; se false, realiza soft delete
   * @returns Confirmação da remoção
   */
  async remove(id: string, obliterate = false) {
    // Verifica se o cupom existe
    await this.findOne(id)

    if (obliterate) {
      // Exclusão permanente
      // Primeiro exclui os registros de uso do cupom
      await this.prisma.coupomUsage.deleteMany({
        where: { coupomId: id },
      })

      // Depois exclui o cupom
      return this.prisma.coupom.delete({
        where: { id },
      })
    } else {
      // Soft delete
      return this.prisma.coupom.update({
        where: { id },
        data: {
          deleted: true,
          deletedAt: new Date(),
          status: CoupomStatus.INACTIVE,
        },
      })
    }
  }

  /**
   * Registra o uso de um cupom por um usuário
   * @param coupomId ID do cupom
   * @param userId ID do usuário
   * @param orderId ID do pedido (opcional)
   * @returns O registro de uso criado
   */
  async registerCouponUsage(coupomId: string, userId: string, orderId?: string) {
    // Verifica se o cupom existe e está ativo
    const coupon = await this.findOne(coupomId)

    if (coupon.status !== CoupomStatus.ACTIVE) {
      throw new BadRequestException('Este cupom não está ativo')
    }

    if (coupon.expiresAt < new Date()) {
      throw new BadRequestException('Este cupom está expirado')
    }

    // Verifica se o cupom tem limite de uso e se já atingiu
    if (coupon.usageLimit) {
      const usageCount = await this.prisma.coupomUsage.count({
        where: { coupomId },
      })

      if (usageCount >= coupon.usageLimit) {
        throw new BadRequestException('Este cupom atingiu o limite de uso')
      }
    }

    // Registra o uso do cupom
    return this.prisma.coupomUsage.create({
      data: {
        coupomId,
        userId,
        orderId,
      },
    })
  }
}
