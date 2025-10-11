export function Checkbox({
	checked,
	onChange,
	label,
	id,
}: {
	checked: boolean;
	onChange: () => void;
	label: string;
	id: string;
}) {
	return (
		<label
			htmlFor={id}
			className="flex items-center gap-2 cursor-pointer select-none py-1.5"
		>
			<input
				id={id}
				type="checkbox"
				className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
				checked={checked}
				onChange={onChange}
			/>
			<span className="text-sm text-gray-800">{label}</span>
		</label>
	);
}
