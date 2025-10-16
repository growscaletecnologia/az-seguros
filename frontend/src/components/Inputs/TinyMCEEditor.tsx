"use client";

import { cn } from "@/lib/utils";
import { Editor } from "@tinymce/tinymce-react";
import React, { useRef, useState } from "react";

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
 * TinyMCE Editor no modo self-hosted
 * (sem necessidade de apiKey, carrega o script local do public/tinymce)
 */
export function TinyMCEEditor({
	value,
	onChange,
	className,
	placeholder,
	height = 500,
	disabled = false,
	label,
	error,
}: TinyMCEEditorProps) {
	const editorRef = useRef<any>(null);
	const [isLoading, setIsLoading] = useState(false);

	// Função para converter imagem para base64
	const imageToBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = (error) => reject(error);
		});
	};

	return (
		<div className={cn("w-full", className)}>
			{label && (
				<div className="mb-2 text-sm font-medium text-gray-700">{label}</div>
			)}

			<div
				className={cn(
					"border rounded-md",
					error ? "border-red-500" : "border-gray-300",
					isLoading ? "opacity-70" : "",
				)}
			>
				<Editor
					tinymceScriptSrc="/tinymce/tinymce.min.js"
					onInit={(_, editor) => {
						editorRef.current = editor;
					}}
					value={value}
					onEditorChange={(newValue) => {
						onChange(newValue);
					}}
					init={{
						//@ts-ignore
						license_key: "gpl",
						height,
						menubar: true,
						plugins: [
							"advlist",
							"autolink",
							"lists",
							"link",
							"image",
							"charmap",
							"preview",
							"anchor",
							"searchreplace",
							"visualblocks",
							"code",
							"fullscreen",
							"insertdatetime",
							"media",
							"table",
							"code",
							"help",
							"wordcount",
						],
						toolbar:
							"undo redo | blocks | " +
							"bold italic forecolor | alignleft aligncenter " +
							"alignright alignjustify | bullist numlist outdent indent | " +
							"removeformat | image | help",
						content_style:
							"body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
						placeholder: placeholder,
						extended_valid_elements:
							"header[style|class],main[style|class],footer[style|class],section[style|class],article[style|class]," +
							"h1[style|class],h2[style|class],h3[style|class],h4[style|class],h5[style|class],h6[style|class]," +
							"p[style|class],span[style|class],div[style|class],blockquote[style|class]," +
							"ul[style|class],ol[style|class],li[style|class]," +
							"img[src|alt|style|class|width|height]," +
							"a[href|target|title|rel|class|style]",

						// Deixa o CSS inline funcionar
						// content_style: `
						//   body { font-family:Helvetica,Arial,sans-serif; font-size:16px; line-height:1.7; color:#333; }
						//   h1,h2,h3 { font-family: 'Playfair Display', serif; margin-top:1.2em; }
						//   blockquote { font-style:italic; background:#f9f9f9; border-left:4px solid #ccc; padding:0.5em 1em; }
						//   img { max-width:100%; height:auto; border-radius:8px; }
						// `,
						images_upload_handler: async (blobInfo) => {
							try {
								setIsLoading(true);
								const base64 = await imageToBase64(blobInfo.blob());
								setIsLoading(false);
								return base64;
							} catch (error) {
								setIsLoading(false);
								console.error("Erro ao fazer upload da imagem:", error);
								throw new Error("Erro ao fazer upload da imagem");
							}
						},
						images_reuse_filename: true,
						paste_data_images: true,
						automatic_uploads: true,
						file_picker_types: "image",
						file_picker_callback: (callback) => {
							const input = document.createElement("input");
							input.setAttribute("type", "file");
							input.setAttribute("accept", "image/*");

							input.addEventListener("change", async (e: Event) => {
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
									console.error("Erro ao fazer upload da imagem:", error);
								}
							});

							input.click();
						},
					}}
					disabled={disabled}
				/>
			</div>

			{error && <div className="mt-1 text-sm text-red-500">{error}</div>}
		</div>
	);
}

export default TinyMCEEditor;
