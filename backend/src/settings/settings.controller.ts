import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  HttpStatus,
  HttpException,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'
import { SettingsService } from './settings.service'
import { CreateSettingDto } from './dto/create-setting.dto'
import { UpdateSettingDto } from './dto/update-setting.dto'
import { GtmSettingsDto, GtmSettingsResponseDto } from './dto/gtm-settings.dto'

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  /**
   * Busca as configurações do Google Tag Manager
   * @returns Configurações do GTM
   */
  @Get('gtm')
  @ApiOperation({ summary: 'Buscar configurações do Google Tag Manager' })
  @ApiResponse({
    status: 200,
    description: 'Configurações do GTM retornadas com sucesso',
    type: GtmSettingsResponseDto,
  })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  async getGtmSettings(): Promise<GtmSettingsResponseDto> {
    try {
      const settings = await this.settingsService.getGtmSettings()

      // Extrai o ID do GTM se disponível
      const gtmId = this.extractGtmId(settings.gtm_head_code || settings.gtm_body_code)

      return {
        ...settings,
        gtm_id: gtmId ?? undefined,
        updated_at: new Date(),
      }
    } catch {
      throw new HttpException(
        'Erro ao buscar configurações do GTM',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  /**
   * Atualiza as configurações do Google Tag Manager
   * @param gtmSettings Configurações do GTM
   * @returns Configurações atualizadas
   */
  @Put('gtm')
  @ApiOperation({ summary: 'Atualizar configurações do Google Tag Manager' })
  @ApiBody({ type: GtmSettingsDto })
  @ApiResponse({
    status: 200,
    description: 'Configurações do GTM atualizadas com sucesso',
    type: GtmSettingsResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateGtmSettings(@Body() gtmSettings: GtmSettingsDto): Promise<GtmSettingsResponseDto> {
    try {
      // Validação adicional de consistência
      if (gtmSettings.gtm_head_code && gtmSettings.gtm_body_code) {
        const headGtmId = this.extractGtmId(gtmSettings.gtm_head_code)
        const bodyGtmId = this.extractGtmId(gtmSettings.gtm_body_code)

        if (headGtmId && bodyGtmId && headGtmId !== bodyGtmId) {
          throw new HttpException(
            'Os IDs do GTM no head e body devem ser iguais',
            HttpStatus.BAD_REQUEST,
          )
        }
      }

      const updatedSettings = await this.settingsService.updateGtmSettings({
        gtm_head_code: gtmSettings.gtm_head_code || '',
        gtm_body_code: gtmSettings.gtm_body_code || '',
      })

      // Extrai o ID do GTM se disponível
      const gtmId = this.extractGtmId(
        updatedSettings.gtm_head_code || updatedSettings.gtm_body_code,
      )

      return {
        ...updatedSettings,
        gtm_id: gtmId ?? undefined,
        updated_at: new Date(),
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(
        'Erro ao atualizar configurações do GTM',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  /**
   * Extrai o ID do GTM do código
   * @param code Código GTM
   * @returns ID do GTM ou null
   */
  private extractGtmId(code: string): string | null {
    if (!code) return null
    const match = code.match(/GTM-[A-Z0-9]+/)
    return match ? match[0] : null
  }

  @Post()
  create(@Body() createSettingDto: CreateSettingDto) {
    return this.settingsService.create(createSettingDto)
  }

  @Get()
  findAll() {
    return this.settingsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.settingsService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSettingDto: UpdateSettingDto) {
    return this.settingsService.update(id, updateSettingDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.settingsService.remove(id)
  }
}
