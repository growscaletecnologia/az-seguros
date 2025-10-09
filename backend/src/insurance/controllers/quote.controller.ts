import {
  Controller,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  HttpStatus,
  HttpCode,
} from '@nestjs/common'
import { QuoteService } from '../services/quote.service'
import { QuoteRequestDto } from '../dto/quote-request.dto'
import { QuoteResponse } from '../dto/quote-response.dto'

@Controller('quotes')
export class QuoteController {
  private readonly logger = new Logger(QuoteController.name)

  constructor(private readonly quoteService: QuoteService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async getQuotes(@Body() dto: QuoteRequestDto): Promise<any[]> {
    try {
      const startTime = Date.now()
      this.logger.log(`Received quote request for destination slug: ${dto.slug}`) // Alterado para slug

      const result = await this.quoteService.calculateQuote(dto)
      console.log('[QuoteController] Result from quoteService:', result)

      const duration = Date.now() - startTime
      // this.logger.log(
      //   `Quote request completed in ${duration}ms with ${result.meta.insurers.successful} successful providers`,
      // )
      console.log('[QuoteController] Request duration:', duration, 'ms')

      return result
    } catch (error) {
      console.log('[QuoteController] Error:', error)
      if (error.message?.includes('validation failed') || error.message?.includes('must be')) {
        console.log('[QuoteController] BadRequestException:', error.message)
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid request parameters',
          errors: error.message,
        })
      }
      this.logger.error('Error processing quote request:', error)
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occurred while processing your request',
        requestId: error.requestId,
      })
    }
  }

}