"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import AuthService, { loginSchema } from "@/lib/services/auth-service";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface LoginFormProps extends React.ComponentProps<"div"> {
	goToBackStep: () => void;
}

export function LoginForm({
	className,
	goToBackStep,
	...props
}: LoginFormProps) {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: { email: string; password: string }) => {
		setIsLoading(true);
		try {
			const response = await AuthService.login({
				email: data.email,
				password: data.password,
			});
			
			// Redirecionar com base na role do usuário
			switch (response.user.role) {
				case "ADMIN":
					router.push("/admin/painel");
					break;
				case "MANAGER":
					router.push("/admin/painel");
					break;
				case "SELLER":
					router.push("/vendedor");
					break;
				case "AFFILIATE":
					router.push("/afiliado");
					break;
				case "SUPPORT":
					router.push("/suporte");
					break;
				case "CUSTOMER":
				default:
					router.push("/cliente");
					break;
			}
			
			toast.success("Login realizado com sucesso!");
		} catch (error) {
			console.error("Erro no login:", error);
			toast.error("Credenciais inválidas ou erro no servidor");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div {...props} className={className}>
			<div>
				<h2 className="text-2xl mb-4 font-medium">Entrar na sua conta</h2>
			</div>
			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full gap-6">
				<div className="flex flex-col gap-4 w-full">
					<div>
						<Input
							className="w-full"
							type="email"
							placeholder="Digite seu email"
							{...register("email")}
						/>
						{errors.email && (
							<p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
						)}
					</div>
					<div>
						<Input
							className="w-full"
							type="password"
							placeholder="Digite a senha"
							{...register("password")}
						/>
						{errors.password && (
							<p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
						)}
					</div>
				</div>
				<div className="flex gap-4 w-full items-center flex-col">
					<Button
						variant="default"
						className="w-full bg-blue-600 hover:bg-blue-400"
						type="submit"
						disabled={isLoading}
					>
						{isLoading ? "Entrando..." : "Entrar"}
					</Button>
					<Button 
						variant="secondary" 
						className="w-full" 
						type="button"
						onClick={goToBackStep}
					>
						Voltar
					</Button>
				</div>
			</form>
			<Separator className="hidden md:flex mt-4" />
		</div>
	);
}
