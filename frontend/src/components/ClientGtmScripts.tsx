"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { settingsService } from "@/services/settings.service";

/**
 * Componente cliente para gerenciar os scripts do Google Tag Manager
 * Este componente carrega as configurações GTM da API e renderiza os scripts necessários
 */
export default function ClientGtmScripts() {
  const [gtmHeadCode, setGtmHeadCode] = useState<string>("");
  const [gtmBodyCode, setGtmBodyCode] = useState<string>("");

  useEffect(() => {
    const loadGtmSettings = async () => {
      try {
        const gtmSettings = await settingsService.getGtmSettings();
        setGtmHeadCode(gtmSettings.gtm_head_code || "");
        setGtmBodyCode(gtmSettings.gtm_body_code || "");
      } catch (error) {
        console.error("Erro ao carregar configurações GTM:", error);
      }
    };

    loadGtmSettings();
  }, []);

  return (
    <>
      {/* Script para o head */}
      {gtmHeadCode && (
        <Script
          id="gtm-head-script"
          dangerouslySetInnerHTML={{
            __html: gtmHeadCode.replace(/`/g, '') // Remove acentos graves que podem causar problemas
          }}
          strategy="afterInteractive"
        />
      )}
      {/* Script para o body (noscript) - será injetado no início do body */}
      {gtmBodyCode && (
        <>
          <Script
            id="gtm-body-script-injector"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  // Cria o elemento noscript
                  var noscript = document.createElement('noscript');
                  noscript.innerHTML = ${JSON.stringify(gtmBodyCode)};

                  // Insere no início do body
                  if (document.body) {
                    document.body.insertBefore(noscript, document.body.firstChild);
                  }
                })();
              `
            }}
          />
        </>
      )}
    </>
  );
}