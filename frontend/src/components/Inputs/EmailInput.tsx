"use client";

import { Mail } from "lucide-react";
import { useState } from "react";

type Props = {
	email: string;
	setEmail: (value: string) => void;
};

export default function EmailField({ email, setEmail }: Props) {
	const [isValid, setIsValid] = useState(true);

	const validate = (value: string) => {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
		return regex.test(value);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setEmail(value);
		setIsValid(validate(value));
	};

	return (
		<div
			className={`flex items-center h-[52px] w-full px-3 rounded-lg bg-white/20 border ${
				isValid ? "border-white/30" : "border-red-500"
			} text-white focus-within:ring-2 focus-within:ring-yellow-400`}
		>
			<Mail className="h-5 w-5 mr-2 opacity-80" />
			<input
				type="email"
				placeholder="Seu e-mail"
				value={email}
				onChange={handleChange}
				className="w-full bg-transparent border-0 placeholder-white/70 text-white focus:ring-0 focus:outline-none"
			/>
		</div>
	);
}
