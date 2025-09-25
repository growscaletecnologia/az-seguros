"use client";

import { useState } from "react";
import CKEditorHtml from "@/components/CKEditorHtml";

/**
 * Página de teste para o componente CKEditorHtml
 */
export default function EditorTestePage() {
  const [content, setContent] = useState("<p>Olá mundo!</p>");

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Teste do CKEditor</h1>
      
      <div className="mb-6">
        <CKEditorHtml value={content} onChange={setContent} />
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">HTML Gerado:</h2>
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-60">
          {content}
        </pre>
      </div>
    </div>
  );
}