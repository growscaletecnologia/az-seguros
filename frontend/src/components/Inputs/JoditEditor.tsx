"use client";

import JoditEditor from "jodit-react";
import React, { useRef } from "react";

export default function JoditEditorComponent({
	value,
	onChange,
}: {
	value: string;
	onChange: (value: string) => void;
}) {
	const editor = useRef(null);

	const config = {
		readonly: false,
		height: 600,
		uploader: { insertImageAsBase64URI: true },
		toolbarAdaptive: false,
		allowPasteHTML: true,
		pasteHTMLAction: "insert_as_html",
		clipboard: true,
		disablePlugins: "spellcheck",
	};

	return (
		<JoditEditor
			ref={editor}
			value={value}
			config={config}
			tabIndex={1}
			onBlur={(newContent) => onChange(newContent)} // chama seu handleChange
			onChange={() => {}} // mantém controlado pelo onBlur
		/>
	);
}
