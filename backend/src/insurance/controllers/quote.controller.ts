import {
  Controller,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { QuoteService } from '../services/quote.service';
import { QuoteRequestDto } from '../dto/quote-request.dto';
import { QuoteResponse } from '../dto/quote-response.dto';

@Controller('quotes')
export class QuoteController {
  private readonly logger = new Logger(QuoteController.name);

  constructor(private readonly quoteService: QuoteService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async getQuotes(@Body() dto: QuoteRequestDto): Promise<QuoteResponse> {
    try {
      // Start timing the request
      const startTime = Date.now();
      this.logger.log(`Received quote request for destination: ${dto.destination}`);

      // Process the request
      const result = await this.quoteService.getQuotes(dto);

      // Log timing information
      const duration = Date.now() - startTime;
      this.logger.log(
        `Quote request completed in ${duration}ms with ${result.meta.insurers.successful} successful providers`
      );

      return result;
    } catch (error) {
      // Handle specific error types
      if (
        error.message?.includes('validation failed') ||
        error.message?.includes('must be')
      ) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid request parameters',
          errors: error.message,
        });
      }

      // Log unexpected errors
      this.logger.error('Error processing quote request:', error);

      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occurred while processing your request',
        requestId: error.requestId,
      });
    }
  }

  @Post('preview')
  @HttpCode(HttpStatus.OK)
  async previewQuotes(@Body() dto: QuoteRequestDto): Promise<QuoteResponse> {
    try {
      // This endpoint could return cached results only, without hitting external APIs
      const result = await this.quoteService.getQuotes({
        ...dto,
        previewMode: true,
      });

      return {
        ...result,
        meta: {
          ...result.meta,
          preview: true,
        },
      };
    } catch (error) {
      this.logger.error('Error processing preview request:', error);
      throw new BadRequestException('Invalid preview request');
    }
  }
}