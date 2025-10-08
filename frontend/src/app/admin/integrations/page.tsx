// 'use client'
// import React, { useState } from 'react';

// const IntegrationsPage = () => {
//   const [insurerName, setinsurerName] = useState('');
//   const [token, setToken] = useState('');
//   const [markup, setMarkup] = useState('');
//   const [noMarkup, setNoMarkup] = useState(false);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log({
//       insurerName,
//       token,
//       markup: noMarkup ? 'Não configurado' : markup,
//     });
//     alert('Integração salva com sucesso!');
//   };

//   return (
//     <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
//       <h1 className="text-2xl font-semibold text-gray-800 mb-6">
//         Gerenciar Integrações
//       </h1>
//       <form onSubmit={handleSubmit} className="space-y-5">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Nome da insurerName
//           </label>
//           <input
//             type="text"
//             value={insurerName}
//             onChange={(e) => setinsurerName(e.target.value)}
//             required
//             className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//             placeholder="Ex: ITA Seguros"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Token de Acesso
//           </label>
//           <input
//             type="text"
//             value={token}
//             onChange={(e) => setToken(e.target.value)}
//             required
//             className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//             placeholder="Insira o token de autenticação"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Markup
//           </label>
//           <input
//             type="number"
//             value={markup}
//             onChange={(e) => setMarkup(e.target.value)}
//             disabled={noMarkup}
//             className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
//             placeholder="Ex: 10%"
//           />
//         </div>

//         <div className="flex items-center space-x-2">
//           <input
//             id="noMarkup"
//             type="checkbox"
//             checked={noMarkup}
//             onChange={(e) => setNoMarkup(e.target.checked)}
//             className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//           />
//           <label htmlFor="noMarkup" className="text-sm text-gray-700">
//             Não configurar markup
//           </label>
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
//         >
//           Salvar Integração
//         </button>
//       </form>
//     </div>
//   );
// };

// export default IntegrationsPage;

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
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { SecurityIntegration, getAllSecurityIntegrations, createSecurityIntegration, updateSecurityIntegration, deleteSecurityIntegration } from "@/services/security-integrations.service";
import { toast } from "sonner";

// helpers
const maskSecret = (text: string) => (text ? `•••• ${text.slice(-4)}` : "—");
const formatMarkup = (m?: number | null) =>
	m === null ? "Não configurado" : typeof m === "number" ? `${m}%` : "—";

export default function IntegrationsPage() {
	// Estado para armazenar as integrações
	const [integracoes, setIntegracoes] = useState<SecurityIntegration[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Carregar integrações ao montar o componente
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

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value, type } = e.target as HTMLInputElement;
		
		if (type === 'number') {
			setFormData(prev => ({
				...prev,
				[name]: value === '' ? undefined : Number(value)
			}));
		} else {
			setFormData(prev => ({
				...prev,
				[name]: value
			}));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			// Ajustar o markup conforme a opção selecionada
			const dataToSubmit = {
				...formData,
				markUp: noMarkup ? null : formData.markUp
			};

			if (isEditing && editingId) {
				const body  = {
						"ativa": dataToSubmit.ativa,
						"clientId": dataToSubmit.clientId,
						"clientSecret": dataToSubmit.clientSecret,
						"grantType": dataToSubmit.grantType,
						"markUp":dataToSubmit.markUp,
						"password":dataToSubmit.password,
						"scope":dataToSubmit.scope,
						"insurerName":dataToSubmit.insurerName,
						"username":dataToSubmit.username,
				}
				// Atualizar integração existente
				const updatedIntegration = await updateSecurityIntegration(editingId, body);
				setIntegracoes(prev => prev.map(i => i.id === editingId ? updatedIntegration : i));
				toast.success("Integração atualizada com sucesso!");
			} else {
				// Criar nova integração
				const newIntegration = await createSecurityIntegration(dataToSubmit);
				setIntegracoes(prev => [newIntegration, ...prev]);
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
				setIntegracoes(prev => prev.filter(i => i.id !== id));
			} catch (err) {
				console.error("Erro ao excluir integração:", err);
				alert("Falha ao excluir integração. Tente novamente mais tarde.");
			}
		}
	};

	const toggleAtiva = async (id: string, currentStatus: boolean) => {
		try {
			await updateSecurityIntegration(id, { ativa: !currentStatus });
			setIntegracoes(prev =>
				prev.map(i => (i.id === id ? { ...i, ativa: !i.ativa } : i)),
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
		<div className="max-w-5xl mx-auto mt-8">
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

			{/* Mensagem de erro */}
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
						<div className="col-span-3">Nome da Integração</div>
						<div className="col-span-3">Credenciais</div>
						<div className="col-span-2">Markup</div>
						<div className="col-span-2">Status</div>
						<div className="col-span-2 text-right">Ações</div>
					</div>

					<div className="divide-y">
						{filtered.map((i) => (
							<div
								key={i.id}
								className="grid grid-cols-12 items-center px-4 py-3"
							>
								<div className="col-span-3">
									<div className="font-medium text-gray-900">{i.insurerName}</div>
									<div className="text-xs text-gray-500">{i.id}</div>
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
									<button
										className="p-2 rounded hover:bg-gray-100"
										title="Editar"
										onClick={() => {
											setIsEditing(true);
											setEditingId(i.id!);
											setFormData({...i});
											setNoMarkup(i.markUp === null);
											setOpen(true);
										}}
									>
										<Pencil className="w-4 h-4 text-gray-700" />
									</button>
									<button
										className="p-2 rounded hover:bg-gray-100"
										title={i.ativa ? "Desativar" : "Ativar"}
										onClick={() => toggleAtiva(i.id!, i.ativa!)}
									>
										{i.ativa ? (
											<ToggleRight className="w-4 h-4 text-emerald-700" />
										) : (
											<ToggleLeft className="w-4 h-4 text-gray-600" />
										)}
									</button>
									<button
										className="p-2 rounded hover:bg-red-50"
										title="Remover"
										onClick={() => handleDelete(i.id!)}
									>
										<Trash2 className="w-4 h-4 text-red-600" />
									</button>
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

			{/* MODAL Adicionar novo */}
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

						<form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Nome da Integração
								</label>
								<input
									type="text"
									name="insurerName"
									value={formData.insurerName}
									onChange={handleInputChange}
									required
									className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
									placeholder="Ex: ITA Seguros"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Tipo de Concessão
								</label>
								<select
									name="grantType"
									value={formData.grantType}
									onChange={handleInputChange}
									required
									className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
								>
									<option value="password">Password</option>
									<option value="client_credentials">Client Credentials</option>
									<option value="authorization_code">Authorization Code</option>
								</select>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Client ID
									</label>
									<input
										type="number"
										name="clientId"
										value={formData.clientId}
										onChange={handleInputChange}
										required
										className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
										placeholder="Ex: 12345"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Client Secret
									</label>
									<input
										type="text"
										name="clientSecret"
										value={formData.clientSecret}
										onChange={handleInputChange}
										required
										className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
										placeholder="Ex: secret123"
									/>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Username
									</label>
									<input
										type="text"
										name="username"
										value={formData.username}
										onChange={handleInputChange}
										required
										className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
										placeholder="Ex: api_user"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Password
									</label>
									<input
										type="password"
										name="password"
										value={formData.password}
										onChange={handleInputChange}
										required
										className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
										placeholder="Senha de acesso"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Escopo (opcional)
								</label>
								<input
									type="text"
									name="scope"
									value={formData.scope || ""}
									onChange={handleInputChange}
									className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
									placeholder="Ex: read write"
								/>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Markup (%)
									</label>
									<input
										type="number"
										name="markUp"
										min={0}
										step={1}
										value={formData.markUp === undefined ? "" : formData.markUp}
										onChange={handleInputChange}
										disabled={noMarkup}
										className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
										placeholder="Ex: 10"
									/>
								</div>

								<div className="flex items-end">
									<label className="inline-flex items-center gap-2">
										<input
											id="noMarkup"
											type="checkbox"
											checked={noMarkup}
											onChange={(e) => {
												setNoMarkup(e.target.checked);
												if (e.target.checked) {
													setFormData(prev => ({ ...prev, markUp: null }));
												}
											}}
											className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
										/>
										<span className="text-sm text-gray-700">
											Não configurar markup
										</span>
									</label>
								</div>
							</div>

							<div className="flex items-center justify-end gap-2 pt-2">
								<button
									type="button"
									className="px-4 py-2 rounded-lg border hover:bg-gray-50"
									onClick={() => {
										resetForm();
										setOpen(false);
									}}
								>
									Cancelar
								</button>
								<button
									type="submit"
									className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
								>
									{isEditing ? "Atualizar" : "Salvar"} integração
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
