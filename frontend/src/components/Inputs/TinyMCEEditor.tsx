import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { cn } from '@/lib/utils';

interface TinyMCEEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  height?: number;
  disabled?: boolean;
  label?: string;
  error?: string;
}

/**
 * Componente de editor TinyMCE com suporte a upload de imagens em base64
 * 
 * @param value - Conteúdo HTML atual do editor
 * @param onChange - Função chamada quando o conteúdo é alterado
 * @param className - Classes CSS adicionais
 * @param placeholder - Texto de placeholder
 * @param height - Altura do editor em pixels
 * @param disabled - Se o editor está desabilitado
 * @param label - Rótulo do campo
 * @param error - Mensagem de erro
 */
export function TinyMCEEditor({
  value,
  onChange,
  className,
  placeholder,
  height = 500,
  disabled = false,
  label,
  error
}: TinyMCEEditorProps) {
  const editorRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Função para converter imagem para base64
  const imageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="mb-2 text-sm font-medium text-gray-700">{label}</div>
      )}
      
      <div className={cn(
        "border rounded-md",
        error ? "border-red-500" : "border-gray-300",
        isLoading ? "opacity-70" : ""
      )}>
        <Editor
          apiKey="sua-api-key-do-tinymce" // Substitua pela sua API key do TinyMCE
          onInit={(evt, editor) => {
            editorRef.current = editor;
          }}
          value={value}
          onEditorChange={(newValue) => {
            onChange(newValue);
          }}
          init={{
            height,
            menubar: true,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | image | help',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            placeholder: placeholder,
            images_upload_handler: async (blobInfo, progress) => {
              try {
                setIsLoading(true);
                const base64 = await imageToBase64(blobInfo.blob());
                setIsLoading(false);
                return base64;
              } catch (error) {
                setIsLoading(false);
                console.error('Erro ao fazer upload da imagem:', error);
                throw new Error('Erro ao fazer upload da imagem');
              }
            },
            images_reuse_filename: true,
            paste_data_images: true,
            automatic_uploads: true,
            file_picker_types: 'image',
            file_picker_callback: function(callback, value, meta) {
              // Cria um input de arquivo temporário
              const input = document.createElement('input');
              input.setAttribute('type', 'file');
              input.setAttribute('accept', 'image/*');
              
              input.addEventListener('change', async (e: Event) => {
                const target = e.target as HTMLInputElement;
                const file = target.files?.[0];
                
                if (!file) return;
                
                try {
                  setIsLoading(true);
                  const base64 = await imageToBase64(file);
                  callback(base64, { title: file.name });
                  setIsLoading(false);
                } catch (error) {
                  setIsLoading(false);
                  console.error('Erro ao fazer upload da imagem:', error);
                }
              });
              
              input.click();
            }
          }}
          disabled={disabled}
        />
      </div>
      
      {error && (
        <div className="mt-1 text-sm text-red-500">{error}</div>
      )}
    </div>
  );
}

export default TinyMCEEditor;