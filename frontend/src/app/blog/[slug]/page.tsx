"use client";

import React from "react";
import { type Post, postsService } from "@/services/posts.service";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, CheckCircle } from "lucide-react";
import { buildImageUrl } from "@/utils/imageUtils";

// Imports para o formulário de cotação
import { DateRangePicker } from "@/components/Inputs/CustomCalendar";
import EmailField from "@/components/Inputs/EmailInput";
import PhoneField from "@/components/Inputs/PhoneInput";
import DestinationSelect from "@/components/Inputs/DestinationSelect";
import PassengersSelect from "@/components/Inputs/PassengersSelect,";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { usePreRegisterForm } from "@/hooks/useRegisterStore";
import type { PreRegisterForm } from "@/types/types";
import { couponsService } from "@/services/api/coupons";

/**
 * Página pública de visualização de post individual por slug
 */
export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
	const router = useRouter();
	const { slug } = React.use(params);
	const [post, setPost] = useState<Post | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Estados para o formulário de cotação
	const { formData: dados, setForm } = usePreRegisterForm();
	const [formData, setFormData] = useState<PreRegisterForm>({
		name: "",
		email: "",
		phone: "",
		range: undefined,
		passengers: "1",
		destination: "BA",
		step: 1,
		coupon: "",
		term: false,
	});

	const [coupomChecked, setCoupomChecked] = useState(false);
	const [errors, setErrors] = useState<
		Partial<Record<keyof PreRegisterForm, boolean>>
	>({});
	const [featuredCoupon, setFeaturedCoupon] = useState<any>(null);
	const [loadingCoupons, setLoadingCoupons] = useState(true);

	// Carrega o post pelo slug
	useEffect(() => {
		const loadPost = async () => {
			try {
				setLoading(true);
				const data = await postsService.getPostBySlug(slug);
				setPost(data);
			} catch (error) {
				console.error("Erro ao carregar post:", error);
				setError("Post não encontrado ou indisponível.");
			} finally {
				setLoading(false);
			}
		};

		loadPost();
	}, [slug]);

	// Carregar cupons publicáveis
	useEffect(() => {
		const loadPublishableCoupons = async () => {
			try {
				const coupons = await couponsService.getPublicCoupons();

				// Selecionar o cupom com maior desconto como destaque
				if (coupons && coupons.length > 0) {
					const bestCoupon = coupons.reduce((best, current) => {
						// Para cupons percentuais, comparamos diretamente o valor do desconto
						if (
							current.discountType === "PERCENTAGE" &&
							best.discountType === "PERCENTAGE"
						) {
							return current.discount > best.discount ? current : best;
						}
						// Para cupons de valor fixo, precisaríamos de um contexto de valor total para comparar
						// Por simplicidade, priorizamos percentuais sobre fixos
						if (
							current.discountType === "PERCENTAGE" &&
							best.discountType === "FIXED"
						) {
							return current;
						}
						// Se ambos são fixos, escolhemos o maior valor
						if (
							current.discountType === "FIXED" &&
							best.discountType === "FIXED"
						) {
							return current.discount > best.discount ? current : best;
						}
						return best;
					}, coupons[0]);

					setFeaturedCoupon(bestCoupon);
				}
			} catch (error) {
				console.error("Erro ao carregar cupons publicáveis:", error);
			} finally {
				setLoadingCoupons(false);
			}
		};

		loadPublishableCoupons();
	}, []);

	// Função para processar o formulário de cotação
	function handleSubmit(event: React.FormEvent) {
		event.preventDefault();

		const requiredFields: (keyof PreRegisterForm)[] = [
			"name",
			"email",
			"phone",
			"range",
			"destination",
			"term",
		];
		const newErrors: Partial<Record<keyof PreRegisterForm, boolean>> = {};

		requiredFields.forEach((field) => {
			if (!formData[field] || (field === "range" && !formData.range?.from)) {
				newErrors[field] = true;
			}
		});

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		const finalForm = { 
			...formData, 
			coupon: coupomChecked && featuredCoupon ? featuredCoupon.code : "" 
		};

		setForm(finalForm);
		router.push("/planos");
		console.log("Form submitted:", finalForm);
	}



	// Função para obter a URL da imagem principal do post
	const getMainImageUrl = (post: Post) => {
		// Prioriza coverImage se disponível
		if (post.coverImage) {
			return buildImageUrl(post.coverImage);
		}
		
		// Caso contrário, procura por media marcada como principal
		const mainImage = post.media?.find((media) => media.isMain);
		if (mainImage?.url) {
			return buildImageUrl(mainImage.url);
		}
		
		// Se não encontrar nenhuma, usa a primeira imagem disponível
		const firstImage = post.media?.[0];
		if (firstImage?.url) {
			return buildImageUrl(firstImage.url);
		}
		
		// Fallback para placeholder
		return buildImageUrl(null);
	};

	// Função para formatar a data
	const formatDate = (dateString: string) => {
		return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", {
			locale: ptBR,
		});
	};

	if (loading) {
		return (
			<div className="container mx-auto py-12">
				<div className="flex justify-center items-center min-h-[50vh]">
					<p className="text-lg">Carregando post...</p>
				</div>
			</div>
		);
	}

	if (error || !post) {
		return (
			<div className="container mx-auto py-12">
				<div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
					<h2 className="text-2xl font-bold mb-4">Post não encontrado</h2>
					<p className="text-muted-foreground mb-6">
						{error ||
							"O post que você está procurando não existe ou foi removido."}
					</p>
					<Button onClick={() => router.push("/blog")}>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Voltar para o Blog
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-12">
			<div className="mb-6">
				<Button variant="ghost" onClick={() => router.push("/blog")}>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Voltar para o Blog
				</Button>
			</div>

			<div className="flex flex-col lg:flex-row gap-8">
				{/* Conteúdo principal do post */}
				<div className="lg:w-2/3">
					<article className="max-w-4xl">
						<header className="mb-8">
							<div className="flex flex-wrap gap-2 mb-4">
								{post.categories.map((pc) => (
									<Badge key={pc.category.id} variant="outline">
										{pc.category.name}
									</Badge>
								))}
							</div>

							<h1 className="text-4xl font-bold mb-4">{post.title}</h1>

							<div className="flex items-center text-muted-foreground mb-6">
								<div className="flex items-center mr-6">
									<User className="mr-2 h-4 w-4" />
									<span>{post.user?.name || "Autor"}</span>
								</div>
								<div className="flex items-center">
									<Calendar className="mr-2 h-4 w-4" />
									<span>{formatDate(post.publishedAt || post.createdAt)}</span>
								</div>
							</div>
						</header>

						{/* Imagem principal do post */}
						{(post.coverImage || post.media?.length > 0) && (
							<div className="mb-8">
								<img
									src={getMainImageUrl(post)}
									alt={post.title}
									className="w-full h-auto rounded-lg"
								/>
							</div>
						)}

						<div
							className="prose prose-lg max-w-none"
							dangerouslySetInnerHTML={{ __html: post.content }}
						/>

						<footer className="mt-12 pt-6 border-t">
							<div className="flex flex-wrap gap-2">
								{post.tags.map((pt) => (
									<Badge key={pt.tag.id} variant="secondary">
										{pt.tag.name}
									</Badge>
								))}
							</div>
						</footer>
					</article>
				</div>

				{/* Formulário de cotação fixo na lateral direita */}
				<div className="lg:w-1/3">
					<div className="sticky top-8">
						<div className="bg-gradient-to-br from-blue-700 via-blue-400 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
							<h3 className="text-xl font-bold mb-4 text-center">
								Faça sua cotação de seguro viagem e garanta o melhor preço
							</h3>
							
							{/* Seção do cupom */}
							{featuredCoupon && (
								<div className="mb-4">
									{coupomChecked ? (
										<div className="rounded-lg border-2 border-green-400 bg-green-50/10 flex flex-row p-3 gap-3">
											<input
												type="checkbox"
												id="cupom-blog"
												className="w-5 h-5 rounded-2xl mt-1"
												checked={coupomChecked}
												onChange={() => {
													setCoupomChecked(!coupomChecked);
													setFormData((prev) => ({ ...prev, coupon: "" }));
												}}
											/>
											<div className="flex flex-col">
												<span className="text-sm font-bold text-green-300">
													Cupom "{featuredCoupon.code}" aplicado!
												</span>
												<span className="text-xs text-green-200">
													{featuredCoupon.discountType === "PERCENTAGE" 
														? `${featuredCoupon.discount}% OFF` 
														: `R$ ${featuredCoupon.discount} OFF`}
												</span>
											</div>
										</div>
									) : (
										<div className="rounded-lg border-2 border-yellow-400 bg-yellow-50/10 flex flex-row p-3 gap-3">
											<input
												type="checkbox"
												id="cupom-blog"
												className="w-5 h-5 rounded-2xl mt-1"
												checked={coupomChecked}
												onChange={() => {
													setCoupomChecked(!coupomChecked);
													setFormData((prev) => ({ 
														...prev, 
														coupon: coupomChecked ? "" : featuredCoupon.code 
													}));
												}}
											/>
											<div className="flex flex-col">
												<span className="text-sm font-bold text-yellow-300">
													Aplicar cupom "{featuredCoupon.code}"
												</span>
												<span className="text-xs text-yellow-200">
													{featuredCoupon.discountType === "PERCENTAGE" 
														? `${featuredCoupon.discount}% OFF` 
														: `R$ ${featuredCoupon.discount} OFF`}
												</span>
											</div>
										</div>
									)}
								</div>
							)}

							<form onSubmit={handleSubmit} className="space-y-4">
								<div>
									<DestinationSelect
										data={formData.destination}
										setData={(value) =>
											setFormData((prev) => ({ ...prev, destination: value }))
										}
									/>
									{errors.destination && (
										<p className="text-red-300 text-xs mt-1">
											Selecione um destino
										</p>
									)}
								</div>

								<div>
									<DateRangePicker
										onChange={(value) => {
											setFormData((prev) => ({ ...prev, range: value }));
										}}
										minDate={new Date()}
										months={1}
										range={formData.range}
									/>
									{errors.range && (
										<p className="text-red-300 text-xs mt-1">
											Informe as datas da viagem
										</p>
									)}
								</div>

								<div>
									<div className="flex items-center h-[52px] w-full px-3 rounded-lg bg-white/20 border border-white/30 text-white focus-within:ring-2 focus-within:ring-yellow-400">
										<User className="h-5 w-5 mr-2 opacity-80" />
										<input
											type="text"
											placeholder="Nome completo"
											className="w-full bg-transparent border-0 placeholder-white/70 text-white focus:ring-0 focus:outline-none"
											value={formData.name}
											onChange={(e) =>
												setFormData((prev) => ({
													...prev,
													name: e.target.value,
												}))
											}
										/>
									</div>
									{errors.name && (
										<p className="text-red-300 text-xs mt-1">
											Informe seu nome
										</p>
									)}
								</div>

								<div>
									<EmailField
										email={formData.email}
										setEmail={(value) =>
											setFormData((prev) => ({ ...prev, email: value }))
										}
									/>
									{errors.email && (
										<p className="text-red-300 text-xs mt-1">
											Informe um email válido
										</p>
									)}
								</div>

								<div>
									<PhoneField
										phone={formData.phone}
										setPhone={(value) =>
											setFormData((prev) => ({ ...prev, phone: value }))
										}
									/>
									{errors.phone && (
										<p className="text-red-300 text-xs mt-1">
											Informe um telefone válido
										</p>
									)}
								</div>

								<div>
									<PassengersSelect
										data={formData.passengers}
										setData={(value) =>
											setFormData((prev) => ({ ...prev, passengers: value }))
										}
									/>
								</div>

								<div className="flex flex-row gap-3 mt-4">
									<input
										type="checkbox"
										id="term-blog"
										className="w-5 h-5 rounded-2xl mt-1"
										checked={formData.term}
										onChange={() => {
											setFormData((prev) => ({ ...prev, term: !prev.term }));
										}}
									/>
									<HoverCard>
										<HoverCardTrigger>
											<span
												className={`text-sm hover:cursor-pointer transition-colors ${
													errors.term
														? "text-red-300 font-semibold"
														: "text-white"
												}`}
											>
												Confirmo que o passageiro ainda não iniciou a viagem.
											</span>
										</HoverCardTrigger>
										<HoverCardContent className="flex flex-row gap-2">
											<div className="flex flex-col gap-1">
												Este campo é obrigatório para confirmar que a viagem
												ainda não foi iniciada.
												<b>
													Atenção: não é permitido renovar caso o passageiro
													já esteja em viagem.
												</b>
											</div>
										</HoverCardContent>
									</HoverCard>
								</div>

								<button
									type="submit"
									className="w-full bg-yellow-400 h-[52px] text-blue-900 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors mt-6"
								>
									Encontrar Seguro Viagem
								</button>
							</form>

							<div className="flex items-center justify-center gap-4 mt-4 text-sm">
								<div className="flex items-center space-x-2">
									<CheckCircle className="h-4 w-4 text-green-400" />
									<span>Melhor Preço</span>
								</div>
								<div className="flex items-center space-x-2">
									<CheckCircle className="h-4 w-4 text-green-400" />
									<span>Suporte 24h</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
