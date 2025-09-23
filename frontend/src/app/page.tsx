"use client";

import { useEffect } from "react";
import { DateRangePicker } from "@/components/Inputs/CustomCalendar";
import EmailField from "@/components/Inputs/EmailInput";
import EmblaCarousel from "@/components/EmblaCarousel";
import PhoneField from "@/components/Inputs/PhoneInput";
import { PreRegisterForm } from "@/types/types";
import { couponsService } from "@/services/api/coupons";
import {
	ArrowRight,
	CheckCircle,
	Clock,
	DollarSign,
	Globe,
	Heart,
	Info,
	MapPin,
	Plane,
	Shield,
	Star,
	User,
	Users,
	
} from "lucide-react";
import { useRouter } from "next/navigation"

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import DestinationSelect from "@/components/Inputs/DestinationSelect";
import PassengersSelect from "@/components/Inputs/PassengersSelect,";
import { usePreRegisterForm } from "@/hooks/useRegisterStore";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export default function HomePage() {
	const { formData:dados, setForm } = usePreRegisterForm()
	const [formData, setFormData] = useState<PreRegisterForm>({
		name: "",
		email: "",
		phone: "",
		range: undefined,
		passengers: "1",
		destination: "BA",
		step: 1,
		coupon: "",
		term:false
	})
	
	const router = useRouter()
	const [coupomChecked, setCoupomChecked] = useState(false);
	const [errors, setErrors] = useState<Partial<Record<keyof PreRegisterForm, boolean>>>({})
	const [publishableCoupons, setPublishableCoupons] = useState<any[]>([]);
	const [featuredCoupon, setFeaturedCoupon] = useState<any>(null);
	const [loadingCoupons, setLoadingCoupons] = useState(true);
	
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
						if (current.discountType === 'PERCENTAGE' && best.discountType === 'PERCENTAGE') {
							return current.discount > best.discount ? current : best;
						}
						// Para cupons de valor fixo, precisaríamos de um contexto de valor total para comparar
						// Por simplicidade, priorizamos percentuais sobre fixos
						if (current.discountType === 'PERCENTAGE' && best.discountType === 'FIXED') {
							return current;
						}
						// Se ambos são fixos, escolhemos o maior valor
						if (current.discountType === 'FIXED' && best.discountType === 'FIXED') {
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
	function handleSubmit(event: React.FormEvent) {
		event.preventDefault();

		const requiredFields: (keyof PreRegisterForm)[] = ["name", "email", "phone", "range", "destination", "term"]
    	const newErrors: Partial<Record<keyof PreRegisterForm, boolean>> = {}

		requiredFields.forEach((field) => {
		if (!formData[field] || (field === "range" && !formData.range?.from)) {
			newErrors[field] = true
		}
		})

		if (Object.keys(newErrors).length > 0) {
		setErrors(newErrors)
		return
		}

		const finalForm = { ...formData, coupon: coupomChecked ? "SEGURO25" : "" }
		
		setForm(finalForm)
		router.push("/planos")
		console.log("Form submitted:", finalForm)
	}
	return (
		<div className="bg-white">
			{/* Hero Section */}
			<section className="relative h-[650px] flex flex-auto bg-gradient-to-br from-blue-700 via-blue-400 to-blue-600 text-white bg-[url('/banners/hero_promo.png')] bg-cover bg-no-repeat">
				<div className="absolute inset-0 bg-black/20"></div>
				<div
					id="top"
					className="container mx-auto flex flex-col md:flex-row items-center justify-between relative px-4 w-full sm:px-6 lg:px-8 py-8 md:py-12"
				>
					{/* Lado esquerdo - Texto e descrição */}
					<div className="w-full md:w-5/12 mb-8 md:mb-0 space-y-6">
						<div className="space-y-4">
							<h1 className="text-3xl lg:text-5xl font-bold leading-tight">
								Viaje com
								<span className="text-yellow-400"> Segurança Total</span>
							</h1>
							<p className="text-xl lg:text-2xl text-blue-50">
								Compare preços, encontre o melhor seguro de viagem e contrate
								em minutos. Proteção completa para suas aventuras pelo mundo.
							</p>
						</div>

						<div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
							<div className="flex items-center space-x-2">
								<CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
								<span>Melhor Preço Garantido</span>
							</div>
							<div className="flex items-center space-x-2">
								<CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
								<span>Suporte 24h</span>
							</div>
						</div>
						
						<div className="w-full sm:max-w-md">
							{loadingCoupons ? (
								<div className="rounded-lg border-2 flex flex-row p-4 gap-4 animate-pulse">
									<div className="w-5 h-5 bg-gray-300 rounded-full"></div>
									<div className="h-5 w-32 bg-gray-300 rounded"></div>
								</div>
							) : featuredCoupon ? (
								coupomChecked ? (
									<div className="rounded-lg border-2 flex flex-row p-4 animate-wiggle gap-4">
										<input
											type="checkbox"
											id="cupom"
											className="w-5 h-5 rounded-2xl mt-1"
											checked={coupomChecked}
											onChange={() => {
												setCoupomChecked(!coupomChecked)
												setFormData((prev) => ({ ...prev, coupon: "" }))
											}}
										/>
										<span className="text-lg font-bold">Cupom aplicado com sucesso!</span>
									</div>
								) : (
									<div className="rounded-lg border-2 relative flex flex-row p-4 mt-1 gap-2">
										<input
											type="checkbox"
											id="cupom"
											className="size-4 rounded-2xl mt-1"
											checked={coupomChecked}
											onChange={() => {
												setCoupomChecked(!coupomChecked)
												setFormData((prev) => ({ ...prev, coupon: featuredCoupon.code }))
											}}
										/>
										<span className="text-sm">Aplicar cupom</span>
										<span className="text-yellow-300 mt-0.5 font-bold text-sm"> "{featuredCoupon.code}"</span>
										<span className="text-sm">para ganhar</span>
										<span className="text-yellow-300 mt-0.5 font-bold text-sm"> 
											{featuredCoupon.discountType === 'PERCENTAGE' 
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
								<div className="relative z-10 bg-gradient-to-br from-transparent via-transparent to-blue-100/50 backdrop-blur-md rounded-2xl p-4 border border-white/20">
									<h3 className="text-2xl font-bold mb-4">
										Realize uma cotação de Seguro de Viagem para seu destino
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
										<DestinationSelect
											data={formData.destination}
											setData={(value) =>
												setFormData((prev) => ({ ...prev, destination: value }))
											}
										/>
										  {errors.destination && <p className="text-red-500 text-sm">Selecione um destino</p>}
										<div className="col-span-1 md:col-span-2 lg:col-span-2">
											<DateRangePicker
												onChange={(value)=>{
													setFormData((prev) => ({ ...prev, range: value }))
												}}
												minDate={new Date()}
												months={2}
												range={formData.range}
							
											/>
											 {errors.range && <p className="text-red-500 text-sm">Informe as datas da viagem</p>}
										</div>
										 <div
											className={`flex items-center h-[52px] w-full px-3 rounded-lg bg-white/20 border ${
											errors.name ? "border-red-500" : "border-white/30"
											} text-white focus-within:ring-2 focus-within:ring-yellow-400`}
										>
											<User className="h-5 w-5 mr-2 opacity-80" />
											<input
												type="text"
												placeholder="Nome completo"
									 			className="w-full bg-transparent border-0 placeholder-white/70 text-white focus:ring-0 focus:outline-none"
												value={formData.name}
												onChange={(e) =>
													setFormData((prev) => ({ ...prev, name: e.target.value }))
												}
											/>
										</div>
										<div>
											<EmailField
													email={formData.email}
													setEmail={(value) =>
														setFormData((prev) => ({ ...prev, email: value }))
													}
											/>
											 {errors.email && <p className="text-red-500 text-sm">Informe um email válido</p>}
										</div>
										<div>
											<PhoneField
												phone={formData.phone}
												setPhone={(value) =>
													setFormData((prev) => ({ ...prev, phone: value }))
												}
											/>
											 {errors.phone && <p className="text-red-500 text-sm">Informe um telefone válido</p>}
										</div>
									</div>
							
									<div className="flex flex-row justify-between items-center gap-4 mt-4">
										<PassengersSelect
											data={formData.passengers}
											setData={(value) =>
												setFormData((prev) => ({ ...prev, passengers: value }))
											}
										/>
							
							
							
										{/* Botão */}
										<div className="w-full">
												<button type="submit" className="w-full bg-yellow-400 h-[52px] text-blue-900 py-1 rounded-lg font-bold hover:bg-yellow-300 transition-colors">
													Encontrar Seguro viagem
												</button>
										</div>
									</div>
										<div className=" relative flex flex-row px-1 gap-4 mt-4">
										
											<input
												type="checkbox"
												id="cupom"
												className="w-5 h-5 rounded-2xl mt-1"
												checked={formData.term}
												onChange={() => {
													setFormData((prev) => ({ ...prev, term: !prev.term }))
												}}
											/>
										
											
																		<HoverCard>
										<HoverCardTrigger>
											<span
											className={`text-lg hover:cursor-pointer transition-colors ${
												errors.term  ? "text-red-500 font-semibold" : "text-white"
											}`}
											>
											Confirmo que o passageiro ainda não iniciou a viagem.
											</span>
										</HoverCardTrigger>
										<HoverCardContent className="flex flex-row gap-2">
											<div className="flex flex-col gap-1">
											Este campo é obrigatório para confirmar que a viagem ainda não foi iniciada.
											<b>Atenção: não é permitido renovar caso o passageiro já esteja em viagem.</b>
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
			<section className="py-16 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
							Confira seguros de viagem para suas necessidades
						</h2>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{/* Card 1 */}
						<div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
							<Image
								src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e" // oceano
								alt="Seguro Viagem Marítimo"
								width={400}
								height={250}
								className="w-full h-48 object-cover"
							/>
							<div className="p-4">
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									Seguro Viagem Marítimo
								</h3>
								<p className="text-gray-600 mb-4">
									Proteção contra imprevistos em alto mar, incluindo assistência
									a bordo e emergências durante cruzeiros.
								</p>
								<Link
									href="/planos"
									className="text-green-600 font-semibold hover:underline flex items-center gap-1"
								>
									Saiba Mais <ArrowRight className="w-4 h-4" />
								</Link>
							</div>
						</div>

						{/* Card 2 */}
						<div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
							<Image
								src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b" // estudantes
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
									Estude em outro país com tranquilidade. Cobertura para saúde,
									acidentes e suporte durante todo o programa de intercâmbio.
								</p>
								<Link
									href="/planos"
									className="text-green-600 font-semibold hover:underline flex items-center gap-1"
								>
									Saiba Mais <ArrowRight className="w-4 h-4" />
								</Link>
							</div>
						</div>

						{/* Card 3 */}
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

						{/* Card 4 */}
						<div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
							<Image
								src="https://images.unsplash.com/photo-1501785888041-af3ef285b470" // montanhas
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
									Explore o mundo com tranquilidade. Assistência para múltiplos
									países e coberturas pensadas para mochileiros.
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
				</div>
			</section>

			{/* Diferenciais */}
			<section className="py-16 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
							Por que escolher a SeguroViagem?
						</h2>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							Somos a plataforma líder em seguros de viagem no Brasil, com mais
							de 1 milhão de clientes satisfeitos.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						<div className="text-center group">
							<div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
								<DollarSign className="h-8 w-8 text-blue-600" />
							</div>
							<h3 className="text-xl font-bold text-gray-900 mb-2">
								Melhor Preço
							</h3>
							<p className="text-gray-600">
								Garantimos o melhor preço do mercado ou devolvemos a diferença.
							</p>
						</div>

						<div className="text-center group">
							<div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
								<Clock className="h-8 w-8 text-green-600" />
							</div>
							<h3 className="text-xl font-bold text-gray-900 mb-2">
								Suporte 24h
							</h3>
							<p className="text-gray-600">
								Atendimento especializado 24 horas por dia, 7 dias por semana.
							</p>
						</div>

						<div className="text-center group">
							<div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
								<Shield className="h-8 w-8 text-blue-600" />
							</div>
							<h3 className="text-xl font-bold text-gray-900 mb-2">
								Compra Segura
							</h3>
							<p className="text-gray-600">
								Transações 100% seguras com certificado SSL e criptografia.
							</p>
						</div>

						<div className="text-center group">
							<div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
								<Users className="h-8 w-8 text-orange-600" />
							</div>
							<h3 className="text-xl font-bold text-gray-900 mb-2">
								+1M Clientes
							</h3>
							<p className="text-gray-600">
								Mais de 1 milhão de viajantes já confiaram em nossos serviços.
							</p>
						</div>
					</div>
				</div>
			</section>

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

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="bg-white rounded-lg p-6 shadow-lg">
							<div className="flex items-center mb-4">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className="h-5 w-5 text-yellow-400 fill-current"
									/>
								))}
							</div>
							<p className="text-gray-600 mb-4">
								&quot;Excelente atendimento! Tive um problema médico na Europa e
								fui atendido rapidamente. Recomendo para todos os
								viajantes.&quot;
							</p>
							<div className="flex items-center">
								<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
									<span className="text-blue-600 font-bold">MR</span>
								</div>
								<div>
									<p className="font-semibold text-gray-900">Maria Rosa</p>
									<p className="text-sm text-gray-600">Viagem para Paris</p>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-lg p-6 shadow-lg">
							<div className="flex items-center mb-4">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className="h-5 w-5 text-yellow-400 fill-current"
									/>
								))}
							</div>
							<p className="text-gray-600 mb-4">
								&quot;Processo super fácil e rápido. Comparei vários planos e
								encontrei o melhor preço. Viajei tranquilo sabendo que estava
								protegido.&quot;
							</p>
							<div className="flex items-center">
								<div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
									<span className="text-green-600 font-bold">JS</span>
								</div>
								<div>
									<p className="font-semibold text-gray-900">João Silva</p>
									<p className="text-sm text-gray-600">Viagem para Japão</p>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-lg p-6 shadow-lg">
							<div className="flex items-center mb-4">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className="h-5 w-5 text-yellow-400 fill-current"
									/>
								))}
							</div>
							<p className="text-gray-600 mb-4">
								&quot;Suporte 24h realmente funciona! Precisei de ajuda durante
								a madrugada e fui atendida imediatamente. Empresa
								confiável!&quot;
							</p>
							<div className="flex items-center">
								<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
									<span className="text-blue-600 font-bold">AC</span>
								</div>
								<div>
									<p className="font-semibold text-gray-900">Ana Costa</p>
									<p className="text-sm text-gray-600">Viagem para EUA</p>
								</div>
							</div>
						</div>
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
