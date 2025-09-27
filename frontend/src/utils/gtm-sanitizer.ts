/**
 * Utilitário para sanitizar e validar códigos do Google Tag Manager
 */

/**
 * Sanitiza o código GTM removendo caracteres problemáticos e formatação que pode quebrar o script
 * @param code Código GTM a ser sanitizado
 * @returns Código GTM sanitizado
 */
export function sanitizeGtmCode(code: string): string {
  if (!code) return '';
  
  return code
    // Remove acentos graves que podem causar problemas com template literals
    .replace(/`/g, '')
    // Normaliza as aspas (converte curly quotes para straight quotes)
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    // Garante que a URL do GTM está correta (sem espaços extras)
    .replace(/src\s*=\s*['"]?\s*https:\/\/www\.googletagmanager\.com/g, 'src="https://www.googletagmanager.com');
}

/**
 * Verifica se o código GTM parece ser válido
 * @param code Código GTM a ser validado
 * @returns true se o código parece válido, false caso contrário
 */
export function isValidGtmCode(code: string): boolean {
  if (!code) return false;
  
  // Verifica se contém os elementos básicos de um código GTM
  const hasGtmScript = code.includes('googletagmanager.com/gtm.js');
  const hasGtmComment = code.includes('Google Tag Manager');
  const hasDataLayer = code.includes('dataLayer');
  
  // Para o código noscript (body)
  const hasNoscriptIframe = code.includes('googletagmanager.com/ns.html');
  
  // Retorna true se parece ser um código de head ou body válido
  return (hasGtmScript && hasGtmComment && hasDataLayer) || hasNoscriptIframe;
}

/**
 * Extrai o ID do GTM do código
 * @param code Código GTM
 * @returns ID do GTM ou null se não encontrado
 */
export function extractGtmId(code: string): string | null {
  if (!code) return null;
  
  // Tenta extrair o ID do GTM do código
  const headMatch = code.match(/['"](GTM-[A-Z0-9]+)['"]/i);
  const bodyMatch = code.match(/ns\.html\?id=(GTM-[A-Z0-9]+)/i);
  
  return headMatch?.[1] || bodyMatch?.[1] || null;
}