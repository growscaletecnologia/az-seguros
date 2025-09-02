"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { users } from "../../../lib/mock-data"; // Importar dados mock

interface LoginFormProps extends React.ComponentProps<"div"> {
	goToBackStep: () => void;
}

export function LoginForm({ className, goToBackStep, ...props }: LoginFormProps) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const user = users.find((u) => u.email === email && u.password === password);
		if (user) {
			if (user.role === "admin") {
				router.push("/admin/painel");
			} else if (user.role === "cliente") {
				router.push("/cliente");
			} else {
				setError("Role não reconhecida.");
			}
		} else {
			setError("Credenciais inválidas.");
		}
	};

	return (
		<div {...props} className={className}>
			{error && <p style={{ color: "red" }}>{error}</p>}
			<div>
				{/* <h1 className="hidden md:block text-4xl text-center my-3 font-medium">
          Fique por dentro da cultura de sua cidade!
        </h1> */}
			</div>
			<div className="flex flex-col w-full gap-1">
				<div className="flex flex-col gap-4 w-full">
					<Input
						className="w-full"
						type="email"
						placeholder="Digite seu email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Input
						className="w-full"
						type="password"
						placeholder="Digite a senha"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				{/* <Button asChild effect={"hoverUnderline"} variant={"link"}>
					<Link href={"/"} className="w-fit">
						Esqueci minha senha
					</Link>
				</Button> */}
			</div>
			<div className="flex gap-4 w-full items-center flex-col">
				<Link href={"/admin/painel"} className="w-fit">
					<Button variant="default" className="w-full bg-blue-600 hover:bg-blue-400">
						Entrar
					</Button>
				</Link>

				{/* <Button variant="secondary" className="w-full" >
          Voltar
        </Button> */}
			</div>

			<Separator className="hidden md:flex" />
		</div>
	);
}
