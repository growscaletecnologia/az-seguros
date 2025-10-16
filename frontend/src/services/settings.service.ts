import { api } from "@/lib/api";

export interface GtmSettings {
	gtm_head_code: string;
	gtm_body_code: string;
}

/**
 * Serviço para gerenciar configurações do sistema
 */
class SettingsService {
	/**
	 * Busca as configurações do Google Tag Manager
	 * @returns Configurações do GTM (códigos para head e body)
	 */
	async getGtmSettings(): Promise<GtmSettings> {
		try {
			const response = await api.get<GtmSettings>("/settings/gtm/settings");
			return response.data;
		} catch (error) {
			console.error("Erro ao buscar configurações GTM:", error);
			// Retorna valores vazios em caso de erro
			return {
				gtm_head_code: "",
				gtm_body_code: "",
			};
		}
	}

	/**
	 * Atualiza as configurações do Google Tag Manager
	 * @param settings Configurações do GTM (códigos para head e body)
	 * @returns Configurações do GTM atualizadas
	 */
	async updateGtmSettings(settings: GtmSettings): Promise<GtmSettings> {
		try {
			const response = await api.post<GtmSettings>(
				"/settings/gtm/settings",
				settings,
			);
			return response.data;
		} catch (error) {
			console.error("Erro ao atualizar configurações GTM:", error);
			throw error;
		}
	}
}

export const settingsService = new SettingsService();
