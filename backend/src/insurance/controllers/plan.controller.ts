import {
  Controller,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  HttpStatus,
  HttpCode,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common'
import { PlanService } from '../services/plan.service'

@Controller('insurer/plans')
export class PlanController {
  private readonly logger = new Logger(PlanController.name)

  constructor(private readonly planService: PlanService) {}

  /**
   * Sincroniza os planos de todas as seguradoras ativas
   */
  @Get('sync')
  @HttpCode(HttpStatus.OK)
  async syncPlans() {
    try {
      const startTime = Date.now()
      this.logger.log('Received plan sync request')

      const result = await this.planService.syncPlans()
      const duration = Date.now() - startTime

      this.logger.log(
        `Plan sync completed in ${duration}ms with ${result.data.insurers.successful} successful insurers`,
      )

      return result
    } catch (error) {
      this.handleControllerError(error, 'syncPlans')
    }
  }

  /**
   * Lista todos os planos com paginação
   * Exemplo: GET /insurer/plans?page=1&perPage=20
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page') page = '1',
    @Query('perPage') perPage = '10',
  ) {
    try {
      const result = await this.planService.findAll(Number(page), Number(perPage))
      return result
    } catch (error) {
      this.handleControllerError(error, 'findAll')
    }
  }

  /**
   * Lista planos filtrados por destino e/ou idade
   * Exemplo: GET /insurer/plans/filter?slug=brasilage=35&page=1&perPage=10
   */
  @Get('filter')
  @HttpCode(HttpStatus.OK)
  async findWithFilter(
    @Query('slug') slug?: string,
    @Query('age') age?: string,
    @Query('page') page = '1',
    @Query('perPage') perPage = '10',
  ) {
    try {
      const filters = {
        slug: slug ? String(slug) : undefined,
        age: age ? Number(age) : undefined,
      }
      const result = await this.planService.findWithFilter(filters, Number(page), Number(perPage))
      return result
    } catch (error) {
      this.handleControllerError(error, 'findWithFilter')
    }
  }

  /**
   * Busca um plano específico
   * Exemplo: GET /insurer/plans/12
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.planService.findOne(id)
      return result
    } catch (error) {
      this.handleControllerError(error, 'findOne')
    }
  }

  /**
   * Busca um plano com benefícios (futuro uso)
   * Exemplo: GET /insurer/plans/benefits/12
   */
  @Get('benefits/:id')
  @HttpCode(HttpStatus.OK)
  async findWithBenefits(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.planService.findWithBenefits(id)
      return result
    } catch (error) {
      this.handleControllerError(error, 'findWithBenefits')
    }
  }

  /**
   * Deleta um plano do banco
   * Exemplo: DELETE /insurer/plans/12
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.planService.delete(id)
      return result
    } catch (error) {
      this.handleControllerError(error, 'delete')
    }
  }

  /**
   * Centraliza o tratamento de erros e log
   */
  private handleControllerError(error: any, method: string): never {
    this.logger.error(`[PlanController] Error in ${method}:`, error)

    if (error.message?.includes('not found') || error.message?.includes('não encontrado')) {
      throw new BadRequestException({
        statusCode: HttpStatus.NOT_FOUND,
        message: error.message || 'Plan not found',
      })
    }

    if (error.message?.includes('validation') || error.message?.includes('must be')) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid request parameters',
        errors: error.message,
      })
    }

    throw new InternalServerErrorException({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'An internal error occurred while processing your request',
      details: error.message,
    })
  }
}
