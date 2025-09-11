import type React from "react";

interface SeparatorProps {
	className?: string;
	orientation?: "horizontal" | "vertical";
}

export const Separator: React.FC<SeparatorProps> = ({
	className = "",
	orientation = "horizontal",
}) => {
	return (
		<div
			className={`${
				orientation === "horizontal"
					? "w-full h-px bg-gray-200"
					: "h-full w-px bg-gray-200"
			} ${className}`}
		/>
	);
};
