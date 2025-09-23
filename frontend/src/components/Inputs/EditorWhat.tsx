import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

// Definição da interface BlobInfo para o TinyMCE
interface BlobInfo {
  id: () => string;
  name: () => string;
  filename: () => string;
  blob: () => File;
  base64: () => string;
  blobUri: () => string;
  uri: () => string | undefined;
}

// Definir os tipos das props 
interface EditorWhatProps { 
  value: string; 
  onChange: (content: string) => void; 
  setImages: React.Dispatch<React.SetStateAction<File[]>>; 
} 

/**
 * Componente de editor TinyMCE com suporte a upload de imagens
 * 
 * @param value - Conteúdo HTML atual do editor
 * @param onChange - Função chamada quando o conteúdo é alterado
 * @param setImages - Função para atualizar o array de imagens no componente pai
 */
const EditorWhat: React.FC<EditorWhatProps> = ({ 
  value, 
  onChange, 
  setImages, 
}) => { 
  /**
   * Função para processar o upload de imagens
   * Converte a imagem para URL e adiciona ao array de imagens
   */
  const uploadImage = ( 
    blobInfo: BlobInfo, 
    success: (url: string) => void, 
    failure: (errMsg: string) => void, 
  ) => { 
    return new Promise<void>((resolve, reject) => { 
      try { 
        const file = blobInfo.blob(); 
        const url = URL.createObjectURL(file); 

        // Adiciona a imagem ao array de imagens do componente pai
        setImages((prevImages) => [...prevImages, file]); 

        success(url); 
        resolve(); 
      } catch (error: any) { 
        const errorMessage = 'Falha ao fazer upload da imagem: ' + error.message; 
        failure(errorMessage); 
        reject(errorMessage); 
      } 
    }); 
  }; 

  return ( 
    <Editor 
      apiKey="vjsc54dxs7b2zl8bm7uwg7ke7vyjdx85dv80lvtepo1kxjpm" 
      value={value} 
      onEditorChange={onChange} 
      init={{ 
        height: 700, 
        plugins: 'image link lists media table emoticons', 
        toolbar: 
          'undo redo | align lineheight | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table', 
        tinycomments_mode: 'embedded', 
        tinycomments_author: 'Author name', 
        mergetags_list: [ 
          { value: 'First.Name', title: 'First Name' }, 
          { value: 'Email', title: 'Email' }, 
        ], 
        images_upload_handler: uploadImage, 
        paste_data_images: true,
        automatic_uploads: true,
        file_picker_types: 'image',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
      }} 
    /> 
  ); 
}; 

export default EditorWhat;