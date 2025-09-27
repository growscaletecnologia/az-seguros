import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { LogsService } from './logs.service';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: string = 'desc',
    @Query('path') path?: string,
    @Query('method') method?: string,
    @Query('statusCode') statusCode?: string,
    @Query('userId') userId?: string,
  ) {
    return this.logsService.findAll({
      page: +page,
      limit: +limit,
      sortBy,
      sortOrder: sortOrder as 'asc' | 'desc',
      path,
      method,
      statusCode: statusCode ? +statusCode : undefined,
      userId,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logsService.findOne(id);
  }
}
