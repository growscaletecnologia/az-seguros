"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import type { Tag } from "@/services/posts.service";
import { Loader2, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

/**
 * Página de gerenciamento de tags do blog
 */
export default function TagsPage() {
	const [tags, setTags] = useState<Tag[]>([]);
	const [loading, setLoading] = useState(true);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingTag, setEditingTag] = useState<Tag | null>(null);
	const [formData, setFormData] = useState({
		name: "",
		slug: "",
		description: "",
	});

	// Carrega as tags
	const loadTags = async () => {
		try {
			setLoading(true);
			const response = await api.get("/tags");
			setTags(response.data);
		} catch (error) {
			console.error("Erro ao carregar tags:", error);
			toast.error("Erro ao carregar tags");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadTags();
	}, []);

	// Gera um slug a partir do nome
	const generateSlug = (name: string) => {
		return name
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/[^\w\s]/g, "")
			.replace(/\s+/g, "-");
	};

	// Atualiza o formulário
	const handleChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));

		// Gera o slug automaticamente quando o nome é alterado
		if (field === "name") {
			setFormData((prev) => ({ ...prev, slug: generateSlug(value) }));
		}
	};

	// Abre o diálogo para edição
	const handleEdit = (tag: Tag) => {
		setEditingTag(tag);
		setFormData({
			name: tag.name,
			slug: tag.slug,
			description: tag.description || "",
		});
		setDialogOpen(true);
	};

	// Abre o diálogo para criação
	const handleNew = () => {
		setEditingTag(null);
		setFormData({
			name: "",
			slug: "",
			description: "",
		});
		setDialogOpen(true);
	};

	// Salva a tag (nova ou editada)
	const handleSave = async () => {
		try {
			if (!formData.name) {
				toast.error("O nome da tag é obrigatório");
				return;
			}

			if (editingTag) {
				// Atualiza tag existente
				await api.put(`/tags/update/${editingTag.id}`, formData);
				toast.success("Tag atualizada com sucesso");
			} else {
				// Cria nova tag
				await api.post("/tags/create", formData);
				toast.success("Tag criada com sucesso");
			}

			setDialogOpen(false);
			loadTags();
		} catch (error) {
			console.error("Erro ao salvar tag:", error);
			toast.error("Erro ao salvar tag");
		}
	};

	// Remove uma tag
	const handleDelete = async (id: string) => {
		if (!confirm("Tem certeza que deseja excluir esta tag?")) return;

		try {
			await api.delete(`/tags/remove/${id}`);
			toast.success("Tag removida com sucesso");
			loadTags();
		} catch (error) {
			console.error("Erro ao remover tag:", error);
			toast.error("Erro ao remover tag");
		}
	};

	return (
		<div className="container mx-auto py-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Tags</h1>
				<Button onClick={handleNew}>
					<PlusCircle className="mr-2 h-4 w-4" />
					Nova Tag
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Gerenciar Tags</CardTitle>
				</CardHeader>
				<CardContent>
					{loading ? (
						<div className="flex justify-center items-center h-40">
							<Loader2 className="h-8 w-8 animate-spin text-primary" />
						</div>
					) : tags.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{tags.map((tag) => (
								<div
									key={tag.id}
									className="flex items-center justify-between p-4 border rounded-lg bg-white"
								>
									<div>
										<h3 className="font-medium">{tag.name}</h3>
										<p className="text-sm text-gray-500">#{tag.slug}</p>
										{tag.description && (
											<p className="text-sm mt-1">{tag.description}</p>
										)}
									</div>
									<div className="flex space-x-2">
										<Button
											variant="outline"
											size="icon"
											onClick={() => handleEdit(tag)}
										>
											<Pencil className="h-4 w-4" />
										</Button>
										<Button
											variant="outline"
											size="icon"
											onClick={() => handleDelete(tag.id)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-8 text-gray-500">
							Nenhuma tag encontrada
						</div>
					)}
				</CardContent>
			</Card>

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>{editingTag ? "Editar Tag" : "Nova Tag"}</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="name">Nome</Label>
							<Input
								id="name"
								value={formData.name}
								onChange={(e) => handleChange("name", e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="slug">Slug</Label>
							<Input
								id="slug"
								value={formData.slug}
								onChange={(e) => handleChange("slug", e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="description">Descrição</Label>
							<Textarea
								id="description"
								value={formData.description}
								onChange={(e) => handleChange("description", e.target.value)}
								rows={3}
							/>
						</div>
					</div>
					<div className="flex justify-end space-x-2">
						<Button variant="outline" onClick={() => setDialogOpen(false)}>
							Cancelar
						</Button>
						<Button onClick={handleSave}>Salvar</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
