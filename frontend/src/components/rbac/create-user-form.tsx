"use client";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { CreateUserDto, usersService } from "@/services/api/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

// Schema de validação do formulário
const createUserSchema = z.object({
	name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
	email: z.string().email("Email inválido"),
	password: z
		.string()
		.min(6, "Senha deve ter pelo menos 6 caracteres")
		.regex(/[0-9]/, "Senha deve conter pelo menos um número")
		.regex(/[^\w\s]/, "Senha deve conter pelo menos um caractere especial"),
	role: z.enum(["ADMIN", "MANAGER", "CUSTOMER"], {
		required_error: "Selecione um papel",
	}),
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;

interface CreateUserFormProps {
	onSuccess: () => void;
}

/**
 * Componente de formulário para criar novos usuários
 */
export function CreateUserForm({ onSuccess }: CreateUserFormProps) {
	const [submitting, setSubmitting] = useState(false);

	// Inicializa o formulário
	const form = useForm<CreateUserFormValues>({
		resolver: zodResolver(createUserSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			role: "CUSTOMER",
		},
	});

	// Manipula o envio do formulário
	const onSubmit = async (values: CreateUserFormValues) => {
		try {
			setSubmitting(true);
			
			const createUserDto: CreateUserDto = {
				email: values.email,
				name: values.name,
				password: values.password,
				role: values.role,
				status: "ACTIVE",
			};

			await usersService.create(createUserDto);
			toast.success("Usuário criado com sucesso!");
			form.reset();
			onSuccess();
		} catch (error) {
			console.error("Erro ao criar usuário:", error);
			toast.error("Erro ao criar usuário");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nome</FormLabel>
							<FormControl>
								<Input placeholder="Nome do usuário" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder="email@exemplo.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<div className="flex items-center gap-2">
								<FormLabel>Senha</FormLabel>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<InfoIcon className="h-4 w-4 text-gray-500" />
										</TooltipTrigger>
										<TooltipContent>
											<p>A senha poderá ser alterada posteriormente pelo usuário</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
							<FormControl>
								<Input type="password" placeholder="******" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="role"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Papel</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Selecione um papel" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="ADMIN">Administrador</SelectItem>
									<SelectItem value="MANAGER">Gerente</SelectItem>
									<SelectItem value="CUSTOMER">Cliente</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={submitting}>
					{submitting ? "Criando..." : "Criar Usuário"}
				</Button>
			</form>
		</Form>
	);
}