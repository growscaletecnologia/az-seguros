"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { settingsService } from "@/services/settings.service";
import DOMPurify from "dompurify";

/**
 * Componente cliente para gerenciar os scripts do Google Tag Manager
 * Este componente carrega as configurações GTM da API e renderiza os scripts necessários
 * com sanitização de segurança
 */
export default function ClientGtmScripts() {
  const [gtmHeadCode, setGtmHeadCode] = useState<string>("");
  const [gtmBodyCode, setGtmBodyCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGtmSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const gtmSettings = await settingsService.getGtmSettings();
        
        // Sanitiza os códigos GTM para prevenir XSS
        const sanitizedHeadCode = sanitizeGtmCode(gtmSettings.gtm_head_code || "");
        const sanitizedBodyCode = sanitizeGtmCode(gtmSettings.gtm_body_code || "");
        
        setGtmHeadCode(sanitizedHeadCode);
        setGtmBodyCode(sanitizedBodyCode);
      } catch (error) {
        console.error("Erro ao carregar configurações GTM:", error);
        setError("Erro ao carregar configurações do Google Tag Manager");
      } finally {
        setIsLoading(false);
      }
    };

    loadGtmSettings();
  }, []);

  /**
   * Sanitiza códigos GTM para prevenir XSS mantendo funcionalidade
   * @param code Código GTM a ser sanitizado
   * @returns Código sanitizado
   */
  const sanitizeGtmCode = (code: string): string => {
    if (!code) return "";
    
    // Verifica se é um código GTM válido
    const gtmPattern = /<!-- Google Tag Manager.*?-->[\s\S]*?<!-- End Google Tag Manager.*?-->/gi;
    const noscriptPattern = /<!-- Google Tag Manager \(noscript\).*?-->[\s\S]*?<!-- End Google Tag Manager \(noscript\).*?-->/gi;
    
    if (!gtmPattern.test(code) && !noscriptPattern.test(code)) {
      console.warn("Código GTM inválido detectado, ignorando por segurança");
      return "";
    }
    
    // Sanitiza usando DOMPurify mantendo tags necessárias para GTM
    const sanitized = DOMPurify.sanitize(code, {
      ALLOWED_TAGS: ['script', 'noscript', 'iframe'],
      ALLOWED_ATTR: ['src', 'async', 'defer', 'type', 'id', 'height', 'width', 'style'],
      ALLOW_DATA_ATTR: false
    });
    
    return sanitized.trim();
  };

  /**
   * Extrai o ID do GTM do código para validação
   * @param code Código GTM
   * @returns ID do GTM ou null
   */
  const extractGtmId = (code: string): string | null => {
    const match = code.match(/GTM-[A-Z0-9]+/);
    return match ? match[0] : null;
  };

  // Não renderiza nada durante o carregamento ou em caso de erro
  if (isLoading || error) {
    return null;
  }

  return (
    <>
      {/* Script para o head */}
      {gtmHeadCode && (
        <Script
          id="gtm-head-script"
          dangerouslySetInnerHTML={{
            __html: gtmHeadCode
          }}
          strategy="afterInteractive"
        />
      )}
      
      {/* Script para o body (noscript) - será injetado no início do body */}
      {gtmBodyCode && (
        <Script
          id="gtm-body-script-injector"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Verifica se já existe um noscript GTM
                  var existingNoscript = document.querySelector('noscript[data-gtm]');
                  if (existingNoscript) {
                    return; // Evita duplicação
                  }

                  // Cria o elemento noscript
                  var noscript = document.createElement('noscript');
                  noscript.setAttribute('data-gtm', 'true');
                  noscript.innerHTML = ${JSON.stringify(gtmBodyCode)};

                  // Insere no início do body
                  if (document.body && document.body.firstChild) {
                    document.body.insertBefore(noscript, document.body.firstChild);
                  } else if (document.body) {
                    document.body.appendChild(noscript);
                  }
                } catch (error) {
                  console.error('Erro ao injetar GTM noscript:', error);
                }
              })();
            `
          }}
        />
      )}
    </>
  );
}