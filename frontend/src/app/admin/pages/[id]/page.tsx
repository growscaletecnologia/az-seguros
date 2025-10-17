"use client";

// import { SelectSlug } from "@/components/admin/selectSlug";
import JoditEditorComponent from "@/components/Inputs/JoditEditor";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { pagesService } from "@/services/pages.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pin, TagIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Componente para exibir informações da página
const PageInfo = ({ formatedData, updated_by, statusName }) => {
	return (
		<>
			<div className="flex items-center gap-2">
				<span className="text-sm font-medium">Atualizado em:</span>
				<span className="text-sm">{formatedData}</span>
			</div>
			<div className="flex items-center gap-2">
				<span className="text-sm font-medium">Atualizado por:</span>
				<span className="text-sm">{updated_by}</span>
			</div>
			<div className="flex items-center gap-2">
				<span className="text-sm font-medium">Status:</span>
				<span className="text-sm">{statusName}</span>
			</div>
		</>
	);
};

// Schema de validação
const pageSchema = z.object({
	title: z.string().min(1, "Título é obrigatório"),
	slug: z.string().min(1, "Slug é obrigatório"),
	resume: z.string().optional(),
	content: z.string().min(1, "Conteúdo é obrigatório"),
	metadata: z.object({
		//title: z.string().optional(),
		description: z.string().optional(),
		keywords: z.string().optional(),
	}),
});

type PageFormValues = z.infer<typeof pageSchema>;

export default function PageForm({
	params,
}: { params: Promise<{ id: string }> }) {
	const router = useRouter();
	const { id } = React.use(params);
	const isNew = id === "new";
	const [isLoading, setIsLoading] = useState(!isNew);
	const [categories, setCategories] = useState<any[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [contentImages, setContentImages] = useState<string[]>([]);
	const [statusId, setStatusId] = useState<number>(1); // 1: Rascunho, 2: Publicado
	const [titleCharacteres, setTitleCharacteres] = useState(0);
	const [submitPageResponse, setSubmitPageResponse] = useState<any>(null);

	const {
		register,
		handleSubmit,
		control,
		setValue,
		watch,
		formState: { errors },
	} = useForm<PageFormValues>({
		resolver: zodResolver(pageSchema),
		defaultValues: {
			title: "",
			slug: "",
			resume: "",
			content: "",
			metadata: {
				//title: "",
				description: "",
				keywords: "",
			},
		},
	});

	// Carregar categorias
	useEffect(() => {
		const loadCategories = async () => {
			try {
				// Aqui você pode substituir pela chamada real para buscar categorias de páginas
				const response = await fetch("/api/page-categories");
				const data = await response.json();
				setCategories(data);
			} catch (error) {
				console.error("Erro ao carregar categorias:", error);
				// Fallback para categorias vazias em caso de erro
				setCategories([]);
			} finally {
				setIsLoading(false);
			}
		};

		loadCategories();

		// Carregar dados da página se não for nova
		if (!isNew) {
			loadPage();
		}
	}, [isNew, id]);

	// Carregar dados da página existente
	const loadPage = async () => {
		try {
			const page = await pagesService.getPageById(id);

			// Preencher formulário com dados da página
			setValue("title", page.title);
			setValue("slug", page.slug);
			setValue("resume", page.resume || "");
			setValue("content", page.content);
			//setValue("metadata.title", page.metadata?.title || "");
			setValue("metadata.description", page.metadata?.description || "");
			setValue("metadata.keywords", page.metadata?.keywords || "");

			// Definir categorias selecionadas
			if (page.categories) {
				setSelectedCategories(page.categories.map((cat) => cat.id));
			}

			// Definir status
			setStatusId(page.status?.id || 1);

			// Definir resposta para exibição de informações
			setSubmitPageResponse({ page });

			// Calcular caracteres do título
			setTitleCharacteres(page.metadata?.title?.length || 0);

			setIsLoading(false);
		} catch (error) {
			console.error("Erro ao carregar página:", error);
			toast.error("Erro ao carregar dados da página");
			router.push("/admin/pages");
		}
	};

	// Função para gerar slug a partir do título
	const handleSlug = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const slug = value
			.toLowerCase()
			.replace(/[^\w\s-]/g, "")
			.replace(/\s+/g, "-");
		setValue("slug", slug);
	};

	// Função para calcular caracteres do título para SEO
	const calculateCharacters = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setTitleCharacteres(value.length);
	};

	// Função para filtrar caracteres inválidos no slug
	const filterValues = (
		e: React.ChangeEvent<HTMLInputElement>,
		onChange: (value: string) => void,
	) => {
		const value = e.target.value;
		const filteredValue = value.replace(/[^\w-]/g, "").toLowerCase();
		onChange(filteredValue);
	};

	// Função para visualizar a página
	const handlePreview = (data: any) => {
		if (data?.page?.slug) {
			window.open(`/pages/${data.page.slug}`, "_blank");
		} else {
			toast.error("Não é possível visualizar. Salve a página primeiro.");
		}
	};

	// Função para salvar a página
	const onSubmit = async (data: PageFormValues) => {
		try {
			const pageData = {
				...data,
				status_id: statusId,
				categories: selectedCategories,
			};

			let response;
			if (isNew) {
				response = await pagesService.createPage(pageData);
				toast.success("Página criada com sucesso!");
			} else {
				response = await pagesService.updatePage(id, pageData);
				toast.success("Página atualizada com sucesso!");
			}

			setSubmitPageResponse(response);

			// Redirecionar para a página de edição se for uma nova página
			if (isNew && response?.page?.id) {
				router.push(`/admin/pages/${response.page.id}`);
			}
		} catch (error) {
			console.error("Erro ao salvar página:", error);
			toast.error("Erro ao salvar página");
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex space-x-4">
			<Card className="flex-1 mx-3">
				<CardContent className="space-y-4">
					<CardTitle className="my-5 flex gap-2">
						{isNew ? "Adicionar Nova Página" : "Editar Página"} <Pin />
					</CardTitle>
					<div className="flex flex-col gap-5">
						<div>
							<Label htmlFor="title">Título</Label>
							<Input
								placeholder="Digite o título"
								{...register("title")}
								onChange={(event) => {
									handleSlug(event);
									calculateCharacters(event);
								}}
								error={String(errors?.title?.message)}
							/>
						</div>
						<div>
							<Label htmlFor="slug">Slug</Label>
							<Controller
								name="slug"
								control={control}
								render={({ field }) => (
									<Input
										error={errors.slug?.message}
										id="slug"
										placeholder="Slug"
										className="w-full"
										{...field}
										onChange={(event) => filterValues(event, field.onChange)}
									/>
								)}
							/>
						</div>
						<div>
							<Label htmlFor="resume">Resumo</Label>
							<Textarea
								id="resume"
								placeholder="Digite o Resumo da Página"
								{...register("resume")}
								className="w-full"
							/>
							{errors.resume && (
								<p className="text-red-500 mt-1 text-sm">
									{errors.resume.message}
								</p>
							)}
						</div>
					</div>
					<div className="space-y-2">
						<Controller
							name="content"
							control={control}
							defaultValue=""
							render={({ field }) => (
								<JoditEditorComponent
									value={field.value}
									onChange={field.onChange}
									// setImages={setContentImages}
								/>
							)}
						/>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>SEO</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<div className="flex align-center">
								<Label htmlFor="metadata-title" className="mr-10">
									Título
								</Label>
								<p className="text-xs text-slate-500">
									caracteres: {titleCharacteres}
								</p>
							</div>
							{/* <div className="space-y-2 block">
								<Input
									{...register("metadata.title")}
									id="metadata-title"
									placeholder="..."
									onChange={calculateCharacters}
									error={errors.metadata?.title?.message}
								/>
							</div> */}
							<div className="space-y-2">
								<Label htmlFor="metadata-description">Descrição</Label>
								<Textarea
									{...register("metadata.description")}
									id="metadata-description"
									placeholder="..."
									className="min-h-[100px]"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="metadata-keywords">Palavras-chave</Label>
								<Input
									{...register("metadata.keywords")}
									id="metadata-keywords"
									placeholder="..."
								/>
							</div>
						</CardContent>
					</Card>
				</CardContent>
			</Card>
			<aside className="w-64 space-y-4">
				<Card>
					<CardHeader className="flex items-end justify-end">
						<div className="">
							<Button
								onClick={() => handlePreview(submitPageResponse)}
								size="sm"
								variant="outline"
							>
								Visualizar Página
							</Button>
						</div>
					</CardHeader>
					<CardContent className="flex text-md flex-col gap-2">
						<PageInfo
							formatedData={submitPageResponse?.page?.updated_at || ""}
							updated_by={submitPageResponse?.page?.updated_by || ""}
							statusName={submitPageResponse?.page?.statusName || ""}
						/>
					</CardContent>

					<CardFooter className="flex-col justify-start items-start gap-3 flex">
						<Button type="submit" onClick={() => setStatusId(2)}>
							Publicar
						</Button>
						<Button
							disabled={submitPageResponse?.page?.statusName === "Rascunho"}
							onClick={() => setStatusId(1)}
							variant={"outline"}
							type="submit"
						>
							Salvar Rascunho
						</Button>
					</CardFooter>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex text-lg items-center gap-3">
							Categorias <TagIcon size={20} />
						</CardTitle>
					</CardHeader>
					{isLoading ? (
						<CardContent className="p-4 h-full overflow-y-auto">
							<Skeleton className="w-full h-32" />
						</CardContent>
					) : categories && categories.length > 0 ? (
						<CardContent>
							{/* <SelectSlug
								items={categories}
								selectedItems={selectedCategories}
								onChange={setSelectedCategories}
							/> */}
						</CardContent>
					) : (
						<CardContent className="text-left">
							Nenhuma Categoria encontrada
						</CardContent>
					)}
				</Card>
			</aside>
		</form>
	);
}
