"use client";
import {
	Eye,
	Pencil,
	Plus,
	ToggleLeft,
	ToggleRight,
	Trash2,
	X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
	getAllSecurityIntegrations,
	createSecurityIntegration,
	updateSecurityIntegration,
	deleteSecurityIntegration,
} from "@/services/security-integrations.service";
import { toast } from "sonner";
import { SecurityIntegration } from "@/types/types";
import { Button } from "@/components/ui/button";

// helpers
const maskSecret = (text: string) => (text ? `•••• ${text.slice(-4)}` : "—");
const formatMarkup = (m?: number | null) =>
	m === null ? "Não configurado" : typeof m === "number" ? `${m}%` : "—";

export default function IntegrationsPage() {
	const [integracoes, setIntegracoes] = useState<SecurityIntegration[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	console.log("integracoes",integracoes)
	useEffect(() => {
		async function loadIntegrations() {
			try {
				setIsLoading(true);
				const data = await getAllSecurityIntegrations();
				
				setIntegracoes(data);
				setError(null);
			} catch (err) {
				console.error("Erro ao carregar integrações:", err);
				setError("Falha ao carregar integrações. Tente novamente mais tarde.");
			} finally {
				setIsLoading(false);
			}
		}
		loadIntegrations();
	}, []);

	// modal states
	const [open, setOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);

	// form state
	const [formData, setFormData] = useState<SecurityIntegration>({
		insurerName: "",
		insurerCode: "",
		baseUrl: "",
		authUrl: "",
		grantType: "password",
		clientId: 0,
		clientSecret: "",
		username: "",
		password: "",
		scope: "",
		ativa: true,
		markUp: undefined,
	});

	const [noMarkup, setNoMarkup] = useState(false);

	const resetForm = () => {
		setFormData({
			insurerName: "",
			insurerCode: "",
			baseUrl: "",
			authUrl: "",
			grantType: "password",
			clientId: 0,
			clientSecret: "",
			username: "",
			password: "",
			scope: "",
			ativa: true,
			markUp: undefined,
		});
		setNoMarkup(false);
		setIsEditing(false);
		setEditingId(null);
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value, type } = e.target as HTMLInputElement;
		if (type === "number") {
			setFormData((prev) => ({
				...prev,
				[name]: value === "" ? undefined : Number(value),
			}));
		} else if (type === "checkbox") {
			setFormData((prev) => ({
				...prev,
				[name]: (e.target as HTMLInputElement).checked,
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const dataToSubmit = {
				...formData,
				markUp: noMarkup ? null : formData.markUp,
			};

			if (isEditing && editingId) {
				const original = integracoes.find((i) => i.id === editingId);
				if (!original) return;

				// só envia os campos alterados
				const diff: Partial<SecurityIntegration> = {};
				Object.keys(dataToSubmit).forEach((key) => {
					const k = key as keyof SecurityIntegration;
					if (dataToSubmit[k] !== original[k]) {
						diff[k] = dataToSubmit[k];
					}
				});

				if (Object.keys(diff).length === 0) {
					toast.info("Nenhuma alteração detectada.");
					return;
				}

				const updatedIntegration = await updateSecurityIntegration(
					editingId,
					diff,
				);
				setIntegracoes((prev) =>
					prev.map((i) => (i.id === editingId ? updatedIntegration : i)),
				);
				toast.success("Integração atualizada com sucesso!");
			} else {
				const newIntegration = await createSecurityIntegration(dataToSubmit);
				setIntegracoes((prev) => [newIntegration, ...prev]);
				toast.success("Integração criada com sucesso!");
			}

			resetForm();
			setOpen(false);
		} catch (err) {
			console.error("Erro ao salvar integração:", err);
			alert("Falha ao salvar integração. Verifique os dados e tente novamente.");
		}
	};

	const handleDelete = async (id: string) => {
		if (confirm("Tem certeza que deseja excluir esta integração?")) {
			try {
				await deleteSecurityIntegration(id);
				setIntegracoes((prev) => prev.filter((i) => i.id !== id));
			} catch (err) {
				console.error("Erro ao excluir integração:", err);
				alert("Falha ao excluir integração. Tente novamente mais tarde.");
			}
		}
	};

	const toggleAtiva = async (id: string, currentStatus: boolean) => {
		try {
			await updateSecurityIntegration(id, { ativa: !currentStatus });
			setIntegracoes((prev) =>
				prev.map((i) => (i.id === id ? { ...i, ativa: !i.ativa } : i)),
			);
		} catch (err) {
			console.error("Erro ao atualizar status da integração:", err);
			alert("Falha ao atualizar status. Tente novamente mais tarde.");
		}
	};

	const [search, setSearch] = useState("");
	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return integracoes;
		return integracoes.filter(
			(i) =>
				i.insurerName?.toLowerCase().includes(q) ||
				i.id?.toLowerCase().includes(q),
		);
	}, [integracoes, search]);

	return (
		<div className="max-w-7xl mx-auto mt-8">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
				<div>
					<h1 className="text-2xl font-semibold text-gray-900">
						Integrações de Seguros
					</h1>
					<p className="text-sm text-gray-600">
						Gerencie integrações com seguradoras, tokens e markup.
					</p>
				</div>

				<div className="flex gap-2">
					<input
						placeholder="Buscar por nome ou ID…"
						className="w-64 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<button
						className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
						onClick={() => setOpen(true)}
					>
						<Plus className="w-4 h-4" />
						Adicionar novo
					</button>
				</div>
			</div>
			{error && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
					{error}
				</div>
			)}

			{/* Estado de carregamento */}
			{isLoading ? (
				<div className="bg-white border rounded-xl overflow-hidden shadow-sm p-8 text-center">
					<div className="animate-pulse">Carregando integrações...</div>
				</div>
			) : (
				/* Tabela / Listagem */
				<div className="bg-white border rounded-xl overflow-hidden shadow-sm">
					<div className="grid grid-cols-12 bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-700">
						<div className="col-span-3 text-lg">Nome da Integração</div>
						<div className="col-span-3 text-lg">Credenciais</div>
						<div className="col-span-2 text-lg">Markup</div>
						<div className="col-span-2 text-lg">Status</div>
						<div className="col-span-2 text-lg text-right">Ações</div>
					</div>

					<div className="divide-y">
						{filtered.map((i) => (
							<div
								key={i.id}
								className="grid grid-cols-12 items-center px-4 py-3"
							>
								<div className="col-span-3">
									<div className="font-medium text-gray-900">{i.insurerName}</div>
									
								</div>

								<div className="col-span-3 text-gray-900">
									<div className="text-xs">
										<span className="font-medium">Usuário:</span> {i.username}
									</div>
									<div className="text-xs">
										<span className="font-medium">Secret:</span> {maskSecret(i.clientSecret)}
									</div>
								</div>

								<div className="col-span-2">
									<span
										className={`inline-flex items-center px-2 py-1 rounded text-xs ${
											i.markUp === null
												? "bg-gray-100 text-gray-700"
												: "bg-emerald-50 text-emerald-700"
										}`}
									>
										{formatMarkup(i.markUp)}
									</span>
								</div>

								<div className="col-span-2">
									{i.ativa ? (
										<span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded text-xs">
											<ToggleRight className="w-4 h-4" /> Ativa
										</span>
									) : (
										<span className="inline-flex items-center gap-1 text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs">
											<ToggleLeft className="w-4 h-4" /> Inativa
										</span>
									)}
								</div>

								<div className="col-span-2 flex justify-end gap-2">
									<Button
										
										className="hover:bg-transparent cursor-pointer"
										variant={"ghost"}
										onClick={() => {
											setIsEditing(true);
											setEditingId(i.id!);
											setFormData({...i});
											setNoMarkup(i.markUp === null);
											setOpen(true);
										}}
									>
									
											<p className="w-4 h-4 text-gray-700" /> Editar
										
									</Button>
									
									
								</div>
							</div>
						))}

						{filtered.length === 0 && !isLoading && (
							<div className="px-4 py-10 text-center text-sm text-gray-500">
								Nenhuma integração encontrada.
							</div>
						)}
					</div>
				</div>
			)}
			{/* Modal */}
			{open && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
					<div className="w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden">
						<div className="px-6 py-4 border-b flex items-center justify-between">
							<h2 className="text-lg font-semibold text-gray-900">
								{isEditing ? "Editar integração" : "Adicionar nova integração"}
							</h2>
							<button
								className="p-2 rounded hover:bg-gray-100"
								onClick={() => {
									resetForm();
									setOpen(false);
								}}
							>
								<X className="w-5 h-5 text-gray-700" />
							</button>
						</div>

						<form
							onSubmit={handleSubmit}
							className="px-6 py-5 space-y-2 max-h-[70vh]"
						>
							{/* Nome */}
							<input
								type="text"
								name="insurerName"
								value={formData.insurerName}
								onChange={handleInputChange}
								required
								className="w-full border rounded-lg px-3 py-2"
								placeholder="Nome da Seguradora"
							/>
							{/* Código */}
							<input
								type="text"
								name="insurerCode"
								value={formData.insurerCode}
								onChange={handleInputChange}
								required
								className="w-full border rounded-lg px-3 py-2"
								placeholder="Código (ex: hero)"
							/>
							{/* Base URL */}
							<input
								type="text"
								name="baseUrl"
								value={formData.baseUrl}
								onChange={handleInputChange}
								required
								className="w-full border rounded-lg px-3 py-2"
								placeholder="https://api.homologacao..."
							/>
							{/* Auth URL */}
							<input
								type="text"
								name="authUrl"
								value={formData.authUrl}
								onChange={handleInputChange}
								required
								className="w-full border rounded-lg px-3 py-2"
								placeholder="https://api.homologacao.../oauth/token"
							/>
							{/* Grant Type */}
							<select
								name="grantType"
								value={formData.grantType}
								onChange={handleInputChange}
								className="w-full border rounded-lg px-3 py-2"
							>
								<option value="password">Password</option>
								<option value="client_credentials">Client Credentials</option>
								<option value="authorization_code">Authorization Code</option>
							</select>
							{/* Client ID / Secret */}
							<div className="grid grid-cols-2 gap-3">
								<input
									type="number"
									name="clientId"
									value={formData.clientId}
									onChange={handleInputChange}
									placeholder="Client ID"
									className="border rounded-lg px-3 py-2"
								/>
								<input
									type="text"
									name="clientSecret"
									value={formData.clientSecret}
									onChange={handleInputChange}
									placeholder="Client Secret"
									className="border rounded-lg px-3 py-2"
								/>
							</div>
							{/* User / Pass */}
							<div className="grid grid-cols-2 gap-3">
								<input
									type="text"
									name="username"
									value={formData.username}
									onChange={handleInputChange}
									placeholder="Usuário"
									className="border rounded-lg px-3 py-2"
								/>
								<input
									type="password"
									name="password"
									value={formData.password}
									onChange={handleInputChange}
									placeholder="Senha"
									className="border rounded-lg px-3 py-2"
								/>
							</div>
							{/* Scope */}
							<input
								type="text"
								name="scope"
								value={formData.scope || ""}
								onChange={handleInputChange}
								placeholder="Escopo"
								className="border rounded-lg px-3 py-2"
							/>
							{/* Markup */}
							<div className="grid grid-cols-2 gap-3">
								<input
									type="number"
									name="markUp"
									value={formData.markUp ?? ""}
									onChange={handleInputChange}
									placeholder="Markup %"
									className="border rounded-lg px-3 py-2"
									disabled={noMarkup}
								/>
								<label className="flex items-center gap-2 text-sm">
									<input
										type="checkbox"
										checked={noMarkup}
										onChange={(e) => {
											setNoMarkup(e.target.checked);
											if (e.target.checked) {
												setFormData((prev) => ({ ...prev, markUp: null }));
											}
										}}
									/>
									Não configurar markup
								</label>
							</div>
							{/* Ativa */}
						
							<div className="flex justify-end gap-2">
								<button
									type="button"
									className="px-4 py-2 border rounded-lg"
									onClick={() => {
										resetForm();
										setOpen(false);
									}}
								>
									Cancelar
								</button>
								<button
									type="submit"
									className="px-4 py-2 bg-blue-600 text-white rounded-lg"
								>
									{isEditing ? "Atualizar" : "Salvar"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
