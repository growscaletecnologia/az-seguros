import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { SettingsService } from './settings.service'
import { CreateSettingDto } from './dto/create-setting.dto'
import { UpdateSettingDto } from './dto/update-setting.dto'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GtmSettingsDto } from './dto/gtm-settings.dto'

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova configuração' })
  @ApiResponse({ status: 201, description: 'Configuração criada com sucesso' })
  create(@Body() createSettingDto: CreateSettingDto) {
    return this.settingsService.create(createSettingDto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as configurações' })
  @ApiResponse({ status: 200, description: 'Lista de configurações retornada com sucesso' })
  findAll() {
    return this.settingsService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma configuração pelo ID' })
  @ApiResponse({ status: 200, description: 'Configuração encontrada' })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  findOne(@Param('id') id: string) {
    return this.settingsService.findOne(id)
  }

  @Get('key/:key')
  @ApiOperation({ summary: 'Buscar uma configuração pela chave' })
  @ApiResponse({ status: 200, description: 'Configuração encontrada' })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  findByKey(@Param('key') key: string) {
    return this.settingsService.findByKey(key)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma configuração pelo ID' })
  @ApiResponse({ status: 200, description: 'Configuração atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  update(@Param('id') id: string, @Body() updateSettingDto: UpdateSettingDto) {
    return this.settingsService.update(id, updateSettingDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma configuração pelo ID' })
  @ApiResponse({ status: 200, description: 'Configuração removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  remove(@Param('id') id: string) {
    return this.settingsService.remove(id)
  }

  @Get('gtm/settings')
  @ApiOperation({ summary: 'Obter configurações do Google Tag Manager' })
  @ApiResponse({ status: 200, description: 'Configurações GTM retornadas com sucesso' })
  getGtmSettings() {
    return this.settingsService.getGtmSettings()
  }

  @Post('gtm/settings')
  @ApiOperation({ summary: 'Atualizar configurações do Google Tag Manager' })
  @ApiResponse({ status: 200, description: 'Configurações GTM atualizadas com sucesso' })
  updateGtmSettings(@Body() gtmSettingsDto: GtmSettingsDto) {
    return this.settingsService.updateGtmSettings(
      gtmSettingsDto.gtm_head_code,
      gtmSettingsDto.gtm_body_code,
    )
  }
}
