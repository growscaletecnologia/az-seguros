"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, AlertCircle, CheckCircle } from "lucide-react";
import { settingsService } from "@/services/settings.service";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GtmSettings {
  gtm_head_code: string;
  gtm_body_code: string;
}

interface GtmSettingsFormProps {
  /**
   * Título personalizado para o formulário
   */
  title?: string;
  /**
   * Descrição personalizada para o formulário
   */
  description?: string;
  /**
   * Callback executado após salvar com sucesso
   */
  onSaveSuccess?: () => void;
  /**
   * Callback executado em caso de erro
   */
  onSaveError?: (error: Error) => void;
}

/**
 * Componente reutilizável para configurações do Google Tag Manager
 * Centraliza a lógica de carregamento, validação e salvamento das configurações GTM
 */
export default function GtmSettingsForm({
  title = "Configurações do Google Tag Manager",
  description = "Configure os scripts do Google Tag Manager para rastreamento de eventos no site.",
  onSaveSuccess,
  onSaveError
}: GtmSettingsFormProps) {
  const [gtmSettings, setGtmSettings] = useState<GtmSettings>({
    gtm_head_code: "",
    gtm_body_code: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [gtmId, setGtmId] = useState<string | null>(null);

  useEffect(() => {
    loadGtmSettings();
  }, []);

  /**
   * Carrega as configurações do GTM da API
   */
  const loadGtmSettings = async () => {
    try {
      setIsLoading(true);
      const settings = await settingsService.getGtmSettings();
      setGtmSettings({
        gtm_head_code: settings.gtm_head_code || "",
        gtm_body_code: settings.gtm_body_code || ""
      });
      
      // Extrai o ID do GTM se disponível
      const extractedId = extractGtmId(settings.gtm_head_code || settings.gtm_body_code);
      setGtmId(extractedId);
    } catch (error) {
      console.error("Erro ao carregar configurações GTM:", error);
      toast.error("Erro ao carregar configurações do Google Tag Manager");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Valida os códigos GTM
   * @param settings Configurações a serem validadas
   * @returns Array de erros de validação
   */
  const validateGtmSettings = (settings: GtmSettings): string[] => {
    const errors: string[] = [];

    // Validação do código do head
    if (settings.gtm_head_code) {
      const gtmHeadPattern = /<!-- Google Tag Manager.*?-->[\s\S]*?<!-- End Google Tag Manager.*?-->/gi;
      if (!gtmHeadPattern.test(settings.gtm_head_code)) {
        errors.push("Código do head deve seguir o formato padrão do Google Tag Manager");
      }
    }

    // Validação do código do body
    if (settings.gtm_body_code) {
      const gtmBodyPattern = /<!-- Google Tag Manager \(noscript\).*?-->[\s\S]*?<!-- End Google Tag Manager \(noscript\).*?-->/gi;
      if (!gtmBodyPattern.test(settings.gtm_body_code)) {
        errors.push("Código do body deve seguir o formato padrão do Google Tag Manager (noscript)");
      }
    }

    // Validação de consistência dos IDs
    if (settings.gtm_head_code && settings.gtm_body_code) {
      const headId = extractGtmId(settings.gtm_head_code);
      const bodyId = extractGtmId(settings.gtm_body_code);
      
      if (headId && bodyId && headId !== bodyId) {
        errors.push("Os IDs do GTM no head e body devem ser iguais");
      }
    }

    return errors;
  };

  /**
   * Extrai o ID do GTM do código
   * @param code Código GTM
   * @returns ID do GTM ou null
   */
  const extractGtmId = (code: string): string | null => {
    if (!code) return null;
    const match = code.match(/GTM-[A-Z0-9]+/);
    return match ? match[0] : null;
  };

  /**
   * Salva as configurações do GTM
   */
  const saveGtmSettings = async () => {
    try {
      // Validação antes de salvar
      const errors = validateGtmSettings(gtmSettings);
      setValidationErrors(errors);
      
      if (errors.length > 0) {
        toast.error("Corrija os erros de validação antes de salvar");
        return;
      }

      setIsSaving(true);
      await settingsService.updateGtmSettings(gtmSettings);
      
      // Atualiza o ID do GTM
      const extractedId = extractGtmId(gtmSettings.gtm_head_code || gtmSettings.gtm_body_code);
      setGtmId(extractedId);
      
      toast.success("Configurações do Google Tag Manager salvas com sucesso");
      onSaveSuccess?.();
    } catch (error) {
      console.error("Erro ao salvar configurações GTM:", error);
      toast.error("Erro ao salvar configurações do Google Tag Manager");
      onSaveError?.(error as Error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Carregando configurações...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
          {gtmId && (
            <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-1 rounded">
              {gtmId}
            </span>
          )}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Erros de validação */}
        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Código do Head */}
        <div className="space-y-2">
          <label htmlFor="gtm_head_code" className="text-sm font-medium">
            Código do Head
          </label>
          <Textarea
            id="gtm_head_code"
            rows={8}
            placeholder="<!-- Google Tag Manager -->"
            value={gtmSettings.gtm_head_code}
            onChange={(e) => setGtmSettings({ ...gtmSettings, gtm_head_code: e.target.value })}
            className="font-mono text-sm"
          />
          {/* <p className="text-xs text-muted-foreground">
            Cole o código do GTM que deve ser inserido na seção &lt;head&gt; do site.
          </p> */}
        </div>

        {/* Código do Body */}
        <div className="space-y-2">
          <label htmlFor="gtm_body_code" className="text-sm font-medium">
            Código do Body (noscript)
          </label>
          <Textarea
            id="gtm_body_code"
            rows={4}
            placeholder="<!-- Google Tag Manager (noscript) -->"
            value={gtmSettings.gtm_body_code}
            onChange={(e) => setGtmSettings({ ...gtmSettings, gtm_body_code: e.target.value })}
            className="font-mono text-sm"
          />
          {/* <p className="text-xs text-muted-foreground">
            Cole o código do GTM que deve ser inserido logo após a abertura da tag &lt;body&gt;.
          </p> */}
        </div>

        {/* Botão de salvar */}
        <Button
          onClick={saveGtmSettings}
          disabled={isSaving}
          className="w-full"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Configurações
            </>
          )}
        </Button>

        {/* Status de sucesso */}
        {gtmId && validationErrors.length === 0 && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Google Tag Manager configurado corretamente com ID: <strong>{gtmId}</strong>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}