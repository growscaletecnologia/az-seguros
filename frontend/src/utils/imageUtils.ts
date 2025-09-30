/**
 * Utilitários para manipulação de imagens
 */

/**
 * Constrói a URL completa para uma imagem
 * @param imageUrl - URL da imagem (pode ser relativa ou absoluta)
 * @returns URL completa da imagem ou placeholder se não fornecida
 */
export const buildImageUrl = (imageUrl: string | null | undefined): string => {
	// Se não há URL, retorna o placeholder
	if (!imageUrl) {
		return "/images/blog-placeholder.svg";
	}

	// Se já é uma URL absoluta (http/https), retorna como está
	if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
		return imageUrl;
	}

	// Se é uma URL relativa que começa com /uploads/, constrói a URL completa
	if (imageUrl.startsWith("/uploads/")) {
		const API_URL = process.env.NODE_ENV === "production"
			? "https://seguroviagem.growscale.com.br/api"
			: "http://localhost:5000";
		return `${API_URL}${imageUrl}`;
	}

	// Para outras URLs relativas, assume que são do frontend
	return imageUrl;
};

/**
 * Converte uma imagem para formato WebP
 * @param file - Arquivo de imagem original
 * @param quality - Qualidade da compressão (0-1, padrão: 0.8)
 * @param maxWidth - Largura máxima da imagem (padrão: 1920)
 * @param maxHeight - Altura máxima da imagem (padrão: 1080)
 * @returns Promise<File> - Arquivo convertido para WebP
 */
export const convertToWebP = async (
  file: File,
  quality: number = 0.8,
  maxWidth: number = 1920,
  maxHeight: number = 1080
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    if (!ctx) {
      reject(new Error('Não foi possível criar contexto do canvas'));
      return;
    }

    img.onload = () => {
      // Calcular dimensões mantendo proporção
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      // Configurar canvas
      canvas.width = width;
      canvas.height = height;

      // Desenhar imagem redimensionada
      ctx.drawImage(img, 0, 0, width, height);

      // Converter para WebP
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Erro ao converter imagem para WebP'));
            return;
          }

          // Criar novo arquivo com extensão .webp
          const fileName = file.name.replace(/\.[^/.]+$/, '.webp');
          const webpFile = new File([blob], fileName, {
            type: 'image/webp',
            lastModified: Date.now(),
          });

          resolve(webpFile);
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      reject(new Error('Erro ao carregar imagem'));
    };

    // Carregar imagem
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Valida se o arquivo é uma imagem válida
 * @param file - Arquivo a ser validado
 * @param maxSize - Tamanho máximo em bytes (padrão: 5MB)
 * @returns objeto com isValid e mensagem de erro se houver
 */
export const validateImageFile = (
  file: File,
  maxSize: number = 5 * 1024 * 1024
): { isValid: boolean; error?: string } => {
  // Verificar se é um arquivo de imagem
  if (!file.type.startsWith('image/')) {
    return {
      isValid: false,
      error: 'Por favor, selecione apenas arquivos de imagem.',
    };
  }

  // Verificar tamanho do arquivo
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return {
      isValid: false,
      error: `A imagem deve ter no máximo ${maxSizeMB}MB.`,
    };
  }

  // Verificar tipos de arquivo suportados
  const supportedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ];

  if (!supportedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Formato de imagem não suportado. Use JPG, PNG, GIF, WebP ou SVG.',
    };
  }

  return { isValid: true };
};

/**
 * Gera um preview da imagem
 * @param file - Arquivo de imagem
 * @returns Promise<string> - URL do preview
 */
export const generateImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    
    reader.onerror = () => {
      reject(new Error('Erro ao gerar preview da imagem'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Comprime uma imagem mantendo a qualidade visual
 * @param file - Arquivo de imagem original
 * @param targetSizeKB - Tamanho alvo em KB (padrão: 500KB)
 * @returns Promise<File> - Arquivo comprimido
 */
export const compressImage = async (
  file: File,
  targetSizeKB: number = 500
): Promise<File> => {
  const targetSizeBytes = targetSizeKB * 1024;
  
  // Se o arquivo já é menor que o alvo, retornar original
  if (file.size <= targetSizeBytes) {
    return file;
  }

  // Começar com qualidade alta e reduzir se necessário
  let quality = 0.9;
  let compressedFile = file;

  while (compressedFile.size > targetSizeBytes && quality > 0.1) {
    compressedFile = await convertToWebP(file, quality);
    quality -= 0.1;
  }

  return compressedFile;
};