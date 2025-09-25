"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import { rolesService, userRbacService } from "@/services/api/rbac";
import type { Role } from "@/types/rbac";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// Schema de validação do formulário
const inviteUserSchema = z.object({
	name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
	email: z.string().email("Email inválido"),
	roleIds: z.array(z.number()).min(1, "Selecione pelo menos um papel"),
	message: z.string().optional(),
});

type InviteUserFormValues = z.infer<typeof inviteUserSchema>;

interface InviteUserFormProps {
	onSuccess: () => void;
}

/**
 * Componente de formulário para convidar novos usuários
 */
export function InviteUserForm({ onSuccess }: InviteUserFormProps) {
	const [roles, setRoles] = useState<Role[]>([]);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

	// Inicializa o formulário
	const form = useForm<InviteUserFormValues>({
		resolver: zodResolver(inviteUserSchema),
		defaultValues: {
			name: "",
			email: "",
			roleIds: [],
			message: "",
		},
	});

	// Carrega todos os papéis disponíveis
	useEffect(() => {
		const loadRoles = async () => {
			try {
				setLoading(true);
				const data = await rolesService.getAll();
				setRoles(data);
			} catch (error) {
				console.error(error);
				toast.error("Erro ao carregar papéis");
			} finally {
				setLoading(false);
			}
		};

		loadRoles();
	}, []);

	// Manipula a seleção de papéis
	const handleRoleToggle = (roleId: number, checked: boolean) => {
		setSelectedRoles((prev) => {
			if (checked) {
				return [...prev, roleId];
			} else {
				return prev.filter((id) => id !== roleId);
			}
		});

		form.setValue(
			"roleIds",
			checked
				? [...form.getValues("roleIds"), roleId]
				: form.getValues("roleIds").filter((id) => id !== roleId),
		);
		form.trigger("roleIds");
	};

	// Manipula o envio do formulário
	const onSubmit = async (values: InviteUserFormValues) => {
		try {
			setSubmitting(true);
			await userRbacService.inviteUser(values);
			toast.success("Convite enviado com sucesso");
			onSuccess();
		} catch (error) {
			console.error(error);
			toast.error("Erro ao enviar convite");
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
								<Input
									placeholder="email@exemplo.com"
									type="email"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="roleIds"
					render={() => (
						<FormItem>
							<FormLabel>Papéis</FormLabel>
							<div className="space-y-2">
								{loading ? (
									<p className="text-sm text-muted-foreground">
										Carregando papéis...
									</p>
								) : (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
										{roles.map((role) => (
											<div key={role.id} className="flex items-start space-x-2">
												<Checkbox
													id={`role-${role.id}`}
													checked={selectedRoles.includes(role.id)}
													onCheckedChange={(checked) =>
														handleRoleToggle(role.id, checked === true)
													}
												/>
												<div className="grid gap-1.5 leading-none">
													<label
														htmlFor={`role-${role.id}`}
														className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
													>
														{role.name}
													</label>
													{role.description && (
														<p className="text-xs text-muted-foreground">
															{role.description}
														</p>
													)}
												</div>
											</div>
										))}
									</div>
								)}
								<FormMessage />
							</div>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="message"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mensagem (opcional)</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Mensagem personalizada para o convite"
									{...field}
									value={field.value || ""}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex justify-end gap-2">
					<Button type="submit" disabled={submitting || loading}>
						{submitting ? "Enviando..." : "Enviar Convite"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
