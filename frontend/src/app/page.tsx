"use client";

import EmblaCarousel from "@/components/EmblaCarousel";
import { DateRangePicker } from "@/components/Inputs/CustomCalendar";
import EmailField from "@/components/Inputs/EmailInput";
import PhoneField from "@/components/Inputs/PhoneInput";
import { WhyChooseSection } from "@/components/sections/WhyChooseSection";
import { couponsService } from "@/services/api/coupons";
import { type Post, postsService } from "@/services/posts.service";
import type { PreRegisterForm } from "@/types/types";
import { buildImageUrl } from "@/utils/imageUtils";
import {
	ArrowRight,
	CheckCircle,
	Globe,
	Heart,
	MapPin,
	Plane,
	User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import DestinationSelect from "@/components/Inputs/DestinationSelect";

import PassengersSelect from "@/components/Inputs/PassengersSelect";
import { AvaliacoesCarousel } from "@/components/avaliations/AvaliacoesCarousel";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { usePreRegisterForm } from "@/hooks/useRegisterStore";

/**
 * Função para realizar rolagem suave até uma posição específica na página
 * @param position Posição Y para onde rolar (em pixels)
 * @param duration Duração da animação em milissegundos
 */
function smoothScrollTo(position: number, duration: number) {
	const startPosition = window.scrollY;
	const distance = position - startPosition;
	let startTime: number | null = null;

	function animation(currentTime: number) {
		if (startTime === null) startTime = currentTime;
		const timeElapsed = currentTime - startTime;
		const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
		window.scrollTo(0, run);
		if (timeElapsed < duration) requestAnimationFrame(animation);
	}

	// Função de easing para suavizar o movimento
	function easeInOutQuad(t: number, b: number, c: number, d: number) {
		t /= d / 2;
		if (t < 1) return (c / 2) * t * t + b;
		t--;
		return (-c / 2) * (t * (t - 2) - 1) + b;
	}

	requestAnimationFrame(animation);
}

export default function HomePage() {
	const { formData, setForm, setField, reset } = usePreRegisterForm();

	useEffect(() => {
	if (!formData) {
		setForm({
		destination: "europa",
		range: {
			from: new Date(),
			to: new Date(),
		},
		passengers: "1",
		name: "",
		email: "",
		phone: "",
		step: 1,
		coupon: "",
		term: false,
		});
	}
	}, [formData, setForm]);
	const router = useRouter();
	const [coupomChecked, setCoupomChecked] = useState(false);
	const [errors, setErrors] = useState<
		Partial<Record<keyof PreRegisterForm, boolean>>
	>({});
	const [publishableCoupons, setPublishableCoupons] = useState<any[]>([]);
	const [featuredCoupon, setFeaturedCoupon] = useState<any>(null);
	const [loadingCoupons, setLoadingCoupons] = useState(true);

	// Estado para posts do blog
	const [posts, setPosts] = useState<Post[]>([]);
	const [loadingPosts, setLoadingPosts] = useState(true);

	// Carregar cupons publicáveis ao montar o componente
	useEffect(() => {
		const loadPublishableCoupons = async () => {
			try {
				const coupons = await couponsService.getPublicCoupons();
				setPublishableCoupons(coupons);

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

	// Carregar posts publicados para a seção de blog
	useEffect(() => {
		const loadPosts = async () => {
			try {
				setLoadingPosts(true);
				const response = await postsService.getPublishedPosts(1, 4); // Buscar apenas 4 posts para a homepage
				setPosts(response.posts || []);
			} catch (error) {
				console.error("Erro ao carregar posts:", error);
			} finally {
				setLoadingPosts(false);
			}
		};

		loadPosts();
	}, []);

	// function handleSubmit(event: React.FormEvent) {
	// 	event.preventDefault();

	// 	const requiredFields: (keyof PreRegisterForm)[] = [
	// 		"name",
	// 		"email",
	// 		"phone",
	// 		"range",
	// 		"destination",
	// 		"term",
	// 	];

	// 	const newErrors: Partial<Record<keyof PreRegisterForm, boolean>> = {};
	// 	requiredFields.forEach((field) => {
	// 		if (!formData?.[field] || (field === "range" && !formData?.range?.from)) {
	// 		newErrors[field] = true;
	// 		}
	// 	});

	// 	if (Object.keys(newErrors).length > 0) {
	// 		setErrors(newErrors);
	// 		return;
	// 	}

	// 	const finalForm = {
	// 		...formData,
	// 		coupon: coupomChecked && featuredCoupon?.code ? featuredCoupon.code : null,
	// 	};

		
	// 	setForm(finalForm);
	// 	router.push("/planos");
	// }


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
    if (!formData?.[field] || (field === "range" && !formData?.range?.from)) {
      newErrors[field] = true;
    }
  });

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  // ✅ Se tiver cupom, inclui no objeto final
  const finalForm = {
    ...formData,
    coupon: coupomChecked && featuredCoupon?.code ? featuredCoupon.code : null,
  };

  setForm(finalForm);

  // ✅ Gera parâmetros legíveis pra URL
  const departure = finalForm.range?.from
    ? new Date(finalForm.range.from).toISOString().split("T")[0]
    : "";
  const arrival = finalForm.range?.to
    ? new Date(finalForm.range.to).toISOString().split("T")[0]
    : "";

  const query = new URLSearchParams({
    destination: finalForm.destination?.toString() ?? "",
    from: departure,
    to: arrival,
  });

  if (finalForm.coupon) {
    query.append("coupon", finalForm.coupon);
  }

  // ✅ Redireciona já com os dados salvos na URL
  router.push(`/planos?${query.toString()}`);
}


	return (
		<div className="bg-white">
			{/* Hero Section */}
			<section className="relative min-h-[750px] md:h-[650px] flex flex-auto bg-gradient-to-br from-blue-700 via-blue-400 to-blue-600 text-white bg-[url('/banners/hero_promo.png')] bg-cover bg-no-repeat">
				<div className="absolute inset-0 bg-black/20"></div>
				<div
					id="top"
					className="container mx-auto flex flex-col md:flex-row items-center justify-between relative px-4 w-full sm:px-6 lg:px-8 py-8 md:py-12"
				>
					{/* Lado esquerdo - Texto e descrição */}
					<div className="w-full md:w-5/12 mb-8 md:mb-0 space-y-4 md:space-y-6">
						<div className="space-y-3 md:space-y-4">
							<h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold leading-tight">
								Viaje com
								<span className="text-yellow-400"> Segurança Total</span>
							</h1>
							<p className="text-lg sm:text-xl lg:text-2xl text-blue-50">
								Compare preços, encontre o melhor seguro de viagem e contrate em
								minutos. Proteção completa para suas aventuras pelo mundo.
							</p>
						</div>

						<div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
							<div className="flex items-center space-x-2">
								<CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
								<span className="text-sm sm:text-base">
									Melhor Preço Garantido
								</span>
							</div>
							<div className="flex items-center space-x-2">
								<CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
								<span className="text-sm sm:text-base">Suporte 24h</span>
							</div>
						</div>

						<div className="w-full sm:max-w-md">
							{featuredCoupon ? (
								coupomChecked ? (
									<div className="rounded-lg border-2 flex flex-row p-3 sm:p-4 animate-wiggle gap-2 sm:gap-4">
										<input
											type="checkbox"
											id="cupom"
											className="w-4 h-4 sm:w-5 sm:h-5 rounded-2xl mt-1"
											checked={coupomChecked}
											onChange={() => {
												setCoupomChecked(!coupomChecked);
												setField("coupon", featuredCoupon.code);
											}}
										/>
										<span className="text-base sm:text-lg font-bold">
											Cupom aplicado com sucesso!
										</span>
									</div>
								) : (
									<div className="rounded-lg border-2 relative flex flex-row p-3 sm:p-4 mt-1 gap-1 sm:gap-2">
										<input
											type="checkbox"
											id="cupom"
											className="size-4 rounded-2xl mt-1"
											checked={coupomChecked}
											onChange={() => {
												setCoupomChecked(!coupomChecked);
												setField("coupon", featuredCoupon.code);
											}}
										/>
										<span className="text-sm">Aplicar cupom</span>
										<span className="text-yellow-300 mt-0.5 font-bold text-sm">
											{" "}
											"{featuredCoupon.code}"
										</span>
										<span className="text-sm">para ganhar</span>
										<span className="text-yellow-300 mt-0.5 font-bold text-sm">
											{featuredCoupon.discountType === "PERCENTAGE"
												? `${featuredCoupon.discount}% OFF`
												: `R$ ${featuredCoupon.discount.toFixed(2)} OFF`}
										</span>
									</div>
								)
							) : null}
						</div>
					</div>

					{/* Lado direito - Formulário */}
					<div className="w-full md:w-6/12">
						<form onSubmit={handleSubmit}>
							<div className="relative">
								<div className="relative z-10 bg-gradient-to-br from-transparent via-transparent to-blue-100/50 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/20">
									<h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
										Realize uma cotação de Seguro de Viagem para seu destino
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
										<DestinationSelect
											data={formData?.destination || ""}
											setData={(value) => setField("destination", value)}
										/>
										{errors.destination && (
											<p className="text-red-500 text-xs sm:text-sm">
												Selecione um destino
											</p>
										)}
										<div className="col-span-1 md:col-span-2 lg:col-span-2">
											<DateRangePicker
												onChange={(value) => setField("range", value)}
												minDate={new Date()}
												months={1}
												range={formData?.range}
											/>
											{errors.range && (
												<p className="text-red-500 text-xs sm:text-sm">
													Informe as datas da viagem
												</p>
											)}
										</div>
										<div
											className={`flex items-center h-[45px] sm:h-[52px] w-full px-3 rounded-lg bg-white/20 border ${
												errors.name ? "border-red-500" : "border-white/30"
											} text-white focus-within:ring-2 focus-within:ring-yellow-400`}
										>
											<User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 opacity-80" />
											<input
												type="text"
												placeholder="Nome completo"
												className="w-full bg-transparent border-0 placeholder-white/70 text-white focus:ring-0 focus:outline-none text-sm sm:text-base"
												value={formData?.name || ""}
												onChange={(e) =>
													setField("name", e.target.value)
												}
											/>
										</div>
										<div>
											<EmailField
												email={formData?.email || ""}
												setEmail={(value) =>
													setField("email", value)
												}
											/>
											{errors.email && (
												<p className="text-red-500 text-xs sm:text-sm">
													Informe um email válido
												</p>
											)}
										</div>
										<div>
											<PhoneField
												phone={formData?.phone || ""}
												setPhone={(value) =>
													setField("phone", value)
												}
											/>
											{errors.phone && (
												<p className="text-red-500 text-xs sm:text-sm">
													Informe um telefone válido
												</p>
											)}
										</div>
									</div>

									<div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 mt-3 sm:mt-4">
										<PassengersSelect
											data={formData?.passengers || ""}
											setData={(value) =>
												setField("passengers", value)
											}
										/>

										{/* Botão */}
										<div className="w-full mt-2 sm:mt-0">
											<button
												type="submit"
												className="w-full bg-yellow-400 h-[45px] sm:h-[52px] text-blue-900 py-1 rounded-lg font-bold hover:bg-yellow-300 transition-colors text-sm sm:text-base"
											>
												Encontrar Seguro viagem
											</button>
										</div>
									</div>
									<div className=" relative flex flex-row px-1 gap-4 mt-4">
										<input
											type="checkbox"
											id="cupom"
											className="w-5 h-5 rounded-2xl mt-1"
											checked={formData?.term}
											onChange={() => {
												setField("term", !formData?.term)
											}}
										/>

										<HoverCard>
											<HoverCardTrigger>
												<span
													className={`text-lg hover:cursor-pointer transition-colors ${
														errors.term
															? "text-red-500 font-semibold"
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
								</div>
							</div>
						</form>
					</div>
				</div>
			</section>
			<div className="flex flex-auto justify-center items-center w-full h-20 bg-blue-600">
				<EmblaCarousel />
			</div>

			{/* Seção Seguros Temáticos */}
			<section className="py-10 sm:py-16 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-8 sm:mb-12">
						<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
							Últimas do Blog
						</h2>
						<p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
							Confira as últimas notícias, dicas e informações sobre seguros de
							viagem
						</p>
					</div>

					{loadingPosts ? (
						<div className="flex justify-center py-8">
							<p className="text-base sm:text-lg">Carregando posts...</p>
						</div>
					) : posts.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
							{posts.map((post) => {
								// Função para obter a URL da imagem principal
								const getMainImageUrl = (post: Post) => {
									// Primeiro, verifica se há uma coverImage
									if (post.coverImage) {
										return buildImageUrl(post.coverImage);
									}

									// Se não, procura pela imagem principal nos media
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

								const mainImageUrl = getMainImageUrl(post);
								const categories = post.categories.map((pc) => pc.category);

								return (
									<div
										key={post.id}
										className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
									>
										<Link href={`/blog/${post.slug}`}>
											<div className="aspect-video relative overflow-hidden">
												<img
													src={mainImageUrl}
													alt={post.title}
													width={400}
													height={250}
													className="w-full h-40 sm:h-48 object-cover"
												/>
											</div>
											<div className="p-3 sm:p-4">
												<h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2">
													{post.title}
												</h3>
												<p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2">
													{post.resume || post.description}
												</p>
												<div className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
													Saiba Mais <ArrowRight className="w-4 h-4" />
												</div>
											</div>
										</Link>
									</div>
								);
							})}
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
							{/* Fallback para cards estáticos caso não haja posts */}
							<div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
								<Image
									src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
									alt="Seguro Viagem Marítimo"
									width={400}
									height={250}
									className="w-full h-40 sm:h-48 object-cover"
								/>
								<div className="p-3 sm:p-4">
									<h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
										Seguro Viagem Marítimo
									</h3>
									<p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
										Proteção contra imprevistos em alto mar, incluindo
										assistência a bordo e emergências durante cruzeiros.
									</p>
									<Link
										href="/planos"
										className="text-green-600 font-semibold hover:underline flex items-center gap-1"
									>
										Saiba Mais <ArrowRight className="w-4 h-4" />
									</Link>
								</div>
							</div>

							<div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
								<Image
									src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b"
									alt="Seguro Viagem Intercâmbio"
									width={400}
									height={250}
									className="w-full h-48 object-cover"
								/>
								<div className="p-4">
									<h3 className="text-lg font-semibold text-gray-900 mb-2">
										Seguro Viagem Intercâmbio
									</h3>
									<p className="text-gray-600 mb-4">
										Estude em outro país com tranquilidade. Cobertura para
										saúde, acidentes e suporte durante todo o programa de
										intercâmbio.
									</p>
									<Link
										href="/planos"
										className="text-green-600 font-semibold hover:underline flex items-center gap-1"
									>
										Saiba Mais <ArrowRight className="w-4 h-4" />
									</Link>
								</div>
							</div>

							<div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
								<Image
									src="https://images.unsplash.com/photo-1536213712468-eaae5b7a6d51?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG11bGhlciUyMGdyJUMzJTgzJUMyJUExdmlkYXxlbnwwfHwwfHx8MA%3D%3D"
									alt="Gestante em ambiente natural, com vestido azul claro"
									width={400}
									height={250}
									className="w-full h-48 object-cover"
								/>
								<div className="p-4">
									<h3 className="text-lg font-semibold text-gray-900 mb-2">
										Seguro Viagem para Gestantes
									</h3>
									<p className="text-gray-600 mb-4">
										Viaje com segurança durante a gestação. Coberturas especiais
										para emergências e acompanhamento médico.
									</p>
									<Link
										href="/planos"
										className="text-green-600 font-semibold hover:underline flex items-center gap-1"
									>
										Saiba Mais <ArrowRight className="w-4 h-4" />
									</Link>
								</div>
							</div>

							<div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
								<Image
									src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
									alt="Seguro Viagem Mochilão"
									width={400}
									height={250}
									className="w-full h-48 object-cover"
								/>
								<div className="p-4">
									<h3 className="text-lg font-semibold text-gray-900 mb-2">
										Seguro Viagem Mochilão
									</h3>
									<p className="text-gray-600 mb-4">
										Explore o mundo com tranquilidade. Assistência para
										múltiplos países e coberturas pensadas para mochileiros.
									</p>
									<Link
										href="/planos"
										className="text-green-600 font-semibold hover:underline flex items-center gap-1"
									>
										Saiba Mais <ArrowRight className="w-4 h-4" />
									</Link>
								</div>
							</div>
						</div>
					)}

					{/* Link para ver mais posts */}
					{posts.length > 0 && (
						<div className="text-center mt-8 sm:mt-12">
							<Link
								href="/blog"
								className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
							>
								Ver Todos os Posts <ArrowRight className="w-4 h-4" />
							</Link>
						</div>
					)}
				</div>
			</section>

			{/* Diferenciais - Seção "Por que escolher" dinâmica */}
			<WhyChooseSection />

			{/* Como Funciona */}
			<section className="py-16 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
							Como funciona?
						</h2>
						<p className="text-xl text-gray-600">
							Contratar seu seguro de viagem nunca foi tão fácil
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="text-center relative">
							<div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
								1
							</div>
							<h3 className="text-xl font-bold text-gray-900 mb-4">
								Preencha os dados
							</h3>
							<p className="text-gray-600 mb-6">
								Informe seu destino, datas da viagem e dados pessoais em nosso
								formulário simples e rápido.
							</p>
							<div className="bg-gray-100 rounded-lg p-4">
								<MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
								<p className="text-sm text-gray-600">
									Destino, datas e viajantes
								</p>
							</div>
							{/* Seta para desktop */}
							<div className="hidden md:block absolute top-6 -right-4 text-blue-300">
								<ArrowRight className="h-6 w-6" />
							</div>
						</div>

						<div className="text-center relative">
							<div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
								2
							</div>
							<h3 className="text-xl font-bold text-gray-900 mb-4">
								Compare planos
							</h3>
							<p className="text-gray-600 mb-6">
								Veja as melhores opções de seguradoras, compare coberturas e
								preços lado a lado.
							</p>
							<div className="bg-gray-100 rounded-lg p-4">
								<Globe className="h-8 w-8 text-green-600 mx-auto mb-2" />
								<p className="text-sm text-gray-600">Comparação detalhada</p>
							</div>
							{/* Seta para desktop */}
							<div className="hidden md:block absolute top-6 -right-4 text-blue-300">
								<ArrowRight className="h-6 w-6" />
							</div>
						</div>

						<div className="text-center">
							<div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
								3
							</div>
							<h3 className="text-xl font-bold text-gray-900 mb-4">
								Finalize em minutos
							</h3>
							<p className="text-gray-600 mb-6">
								Escolha seu plano, efetue o pagamento e receba sua apólice por
								email instantaneamente.
							</p>
							<div className="bg-gray-100 rounded-lg p-4">
								<Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
								<p className="text-sm text-gray-600">Proteção garantida</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Depoimentos */}
			<section className="py-16 bg-blue-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
							O que nossos clientes dizem
						</h2>
					</div>

					{/* Carrossel de avaliações */}
					<div className="mb-8">
						<AvaliacoesCarousel
							limit={9}
							showOnlyActive={true}
							autoplay={true}
							delayMs={5000}
						/>
					</div>
				</div>
			</section>

			{/* CTA Final */}
			<section className="py-16 bg-gradient-to-r from-blue-700 via-blue-400 to-blue-600 text-white">
				<div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
					<h2 className="text-3xl lg:text-4xl font-bold mb-4">
						Pronto para viajar com segurança?
					</h2>
					<p className="text-xl mb-8 text-blue-100">
						Faça sua cotação agora e encontre o seguro de viagem perfeito para
						você.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							href="#top"
							onClick={() => smoothScrollTo(0, 600)}
							className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
						>
							<Plane className="h-5 w-5" />
							<span>Iniciar Cotação Gratuita</span>
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
