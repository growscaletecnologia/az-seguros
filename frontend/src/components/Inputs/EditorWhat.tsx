"use client"; // se estiver em app router

import { Editor } from "@tinymce/tinymce-react";
import type React from "react";

interface BlobInfo {
  id: () => string;
  name: () => string;
  filename: () => string;
  blob: () => File;
  base64: () => string;
  blobUri: () => string;
  uri: () => string | undefined;
}

interface EditorWhatProps {
  value: string;
  onChange: (content: string) => void;
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
}

const EditorWhat: React.FC<EditorWhatProps> = ({ value, onChange, setImages }) => {
  const uploadImage = (
    blobInfo: BlobInfo,
    success: (url: string) => void,
    failure: (errMsg: string) => void,
  ) => {
    try {
      const file = blobInfo.blob();
      const url = URL.createObjectURL(file);
      setImages((prev) => [...prev, file]);
      success(url);
    } catch (error: any) {
      failure("Falha ao fazer upload: " + error.message);
    }
  };

  return (
   <Editor
      tinymceScriptSrc="/public/tinymce/tinymce.min.js"
      value={value}
      onEditorChange={onChange}
      init={{
       // license_key: "gpl2+",
        language: "pt-BR",
        plugins: "image link lists media table emoticons",
        toolbar:
          "undo redo | align lineheight | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table",
        images_upload_handler: uploadImage,
        paste_data_images: true,
        automatic_uploads: true,
      }}
    />
  );
};

export default EditorWhat;
