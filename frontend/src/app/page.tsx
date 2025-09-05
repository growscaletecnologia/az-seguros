"use client";

import { DateRangePicker } from "@/components/CustomCalendar";
import EmblaCarousel  from "@/components/EmblaCarousel";
import { Calendar } from "@/components/ui/calendar";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	ArrowRight,
	CheckCircle,
	Clock,
	DollarSign,
	Globe,
	Heart,
	Mail,
	MapPin,
	Phone,
	Plane,
	Shield,
	Star,
	User,
	Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { DateRange } from "react-day-picker";

export default function HomePage() {
	const [datas, setDatas] = useState<DateRange | undefined>();
	function smoothScrollTo(targetY: number, duration = 600) {
		const startY = window.scrollY || document.documentElement.scrollTop;
		const distance = targetY - startY;
		if (distance === 0 || duration <= 0) {
			window.scrollTo(0, targetY);
			return;
		}

		const startTime = performance.now();
		const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3); // suavinho

		function step(now: number) {
			const elapsed = now - startTime;
			const t = Math.min(1, elapsed / duration);
			const y = startY + distance * easeOutCubic(t);
			window.scrollTo(0, y);
			if (t < 1) requestAnimationFrame(step);
		}

		requestAnimationFrame(step);
	}
	return (
		<div className="bg-white">
			{/* Hero Section */}
			<section className="relative bg-gradient-to-br from-blue-700 via-blue-400 to-blue-600 text-white overflow-hidden">
				<div className="absolute inset-0 bg-black/20"></div>
				<div
					id="top"
					className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32"
				>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						<div className="space-y-8">
							<div className="space-y-4">
								<h1 className="text-2xl lg:text-4xl font-bold leading-tight">
									Viaje com
									<span className="text-yellow-400"> Segurança</span>
									<br />
									Total
								</h1>
								<p className="text-xl lg:text-2xl text-blue-100">
									Compare preços, encontre o melhor seguro de viagem e contrate em
									minutos. Proteção completa para suas aventuras pelo mundo.
								</p>
							</div>

							<div className="flex flex-col sm:flex-row gap-4">
								{/* <Link
									href="/cotacao"
									className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
								>
									<span>Iniciar Cotação</span>
									<ArrowRight className="h-5 w-5" />
								</Link> */}
								{/* <Link
									href="/planos"
									className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-900 transition-all duration-300 flex items-center justify-center space-x-2"
								>
									<span>Ver Planos</span>
									<Shield className="h-5 w-5" />
								</Link> */}
							</div>

							<div className="flex items-center space-x-8 text-sm">
								<div className="flex items-center space-x-2">
									<CheckCircle className="h-5 w-5 text-green-400" />
									<span>Melhor Preço Garantido</span>
								</div>
								<div className="flex items-center space-x-2">
									<CheckCircle className="h-5 w-5 text-green-400" />
									<span>Suporte 24h</span>
								</div>
							</div>
						</div>

						<div className="relative">
							<div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
								<h3 className="text-2xl font-bold mb-6">
									Realize uma cotação de Seguro de Viagem para seu destino
								</h3>
								<div className="space-y-4">
									<div className="grid gridcols-1 md:grid-cols-2 gap-6">
										<div>
											<div className="flex max-h-[48px] items-center w-full px-3 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus-within:ring-2 focus-within:ring-yellow-400">
												<MapPin className="h-5 w-5 mr-2 opacity-80" />
												<Select>
													<SelectTrigger className="w-full bg-transparent border-0 text-white placeholder:text-white  focus:ring-0 focus:outline-none">
														<SelectValue
															placeholder="Destinos"
															className="!placeholder:text-white !text-white"
														/>
													</SelectTrigger>
													<SelectContent className=" w-[var(--radix-select-trigger-width)]">
														<SelectGroup>
															<SelectLabel>
																Estados do Brasil
															</SelectLabel>
															<SelectItem value="AC">
																Acre (AC)
															</SelectItem>
															<SelectItem value="AL">
																Alagoas (AL)
															</SelectItem>
															<SelectItem value="AP">
																Amapá (AP)
															</SelectItem>
															<SelectItem value="AM">
																Amazonas (AM)
															</SelectItem>
															<SelectItem value="BA">
																Bahia (BA)
															</SelectItem>
															<SelectItem value="CE">
																Ceará (CE)
															</SelectItem>
															<SelectItem value="DF">
																Distrito Federal (DF)
															</SelectItem>
															<SelectItem value="ES">
																Espírito Santo (ES)
															</SelectItem>
															<SelectItem value="GO">
																Goiás (GO)
															</SelectItem>
															<SelectItem value="MA">
																Maranhão (MA)
															</SelectItem>
															<SelectItem value="MT">
																Mato Grosso (MT)
															</SelectItem>
															<SelectItem value="MS">
																Mato Grosso do Sul (MS)
															</SelectItem>
															<SelectItem value="MG">
																Minas Gerais (MG)
															</SelectItem>
															<SelectItem value="PA">
																Pará (PA)
															</SelectItem>
															<SelectItem value="PB">
																Paraíba (PB)
															</SelectItem>
															<SelectItem value="PR">
																Paraná (PR)
															</SelectItem>
															<SelectItem value="PE">
																Pernambuco (PE)
															</SelectItem>
															<SelectItem value="PI">
																Piauí (PI)
															</SelectItem>
															<SelectItem value="RJ">
																Rio de Janeiro (RJ)
															</SelectItem>
															<SelectItem value="RN">
																Rio Grande do Norte (RN)
															</SelectItem>
															<SelectItem value="RS">
																Rio Grande do Sul (RS)
															</SelectItem>
															<SelectItem value="RO">
																Rondônia (RO)
															</SelectItem>
															<SelectItem value="RR">
																Roraima (RR)
															</SelectItem>
															<SelectItem value="SC">
																Santa Catarina (SC)
															</SelectItem>
															<SelectItem value="SP">
																São Paulo (SP)
															</SelectItem>
															<SelectItem value="SE">
																Sergipe (SE)
															</SelectItem>
															<SelectItem value="TO">
																Tocantins (TO)
															</SelectItem>
														</SelectGroup>
													</SelectContent>
												</Select>
											</div>
										</div>

										<div>
											<DateRangePicker
												onChange={setDatas}
												minDate={new Date()}
												months={2}
												value={datas}
											></DateRangePicker>
										</div>

										<div className="flex items-center  max-h-[48px] w-full px-3 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus-within:ring-2 focus-within:ring-yellow-400">
											<User className="h-5 w-5 mr-2 opacity-80" />
											<input
												type="text"
												placeholder="Nome completo"
												className="w-full bg-transparent border-0 placeholder-white/70 text-white focus:ring-0 focus:outline-none"
											/>
										</div>
										<div className="flex items-center  max-h-[48px] w-full p-1 rounded-lg bg-white/20 border border-white/30 text-white focus-within:ring-2 focus-within:ring-yellow-400">
											<Mail className="h-5 w-5 ml-2 mr-2 opacity-80" />
											<input
												type="email"
												placeholder="E-mail"
												className="w-full bg-transparent border-0 placeholder-white/70 text-white focus:ring-0 focus:outline-none"
											/>
										</div>
									</div>

									<Link href="/planos" onClick={() => smoothScrollTo(0, 600)} className="block">
										<button className="w-full bg-yellow-400 text-blue-900 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors">
											Encontrar Seguro viagem
										</button>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-auto justify-center items-center w-full h-20  from-blue-700 via-blue-400 to-blue-600">
						<EmblaCarousel />
				</div>

			</section>

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
									Proteção contra imprevistos em alto mar, incluindo assistência a
									bordo e emergências durante cruzeiros.
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
							Somos a plataforma líder em seguros de viagem no Brasil, com mais de 1
							milhão de clientes satisfeitos.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						<div className="text-center group">
							<div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
								<DollarSign className="h-8 w-8 text-blue-600" />
							</div>
							<h3 className="text-xl font-bold text-gray-900 mb-2">Melhor Preço</h3>
							<p className="text-gray-600">
								Garantimos o melhor preço do mercado ou devolvemos a diferença.
							</p>
						</div>

						<div className="text-center group">
							<div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
								<Clock className="h-8 w-8 text-green-600" />
							</div>
							<h3 className="text-xl font-bold text-gray-900 mb-2">Suporte 24h</h3>
							<p className="text-gray-600">
								Atendimento especializado 24 horas por dia, 7 dias por semana.
							</p>
						</div>

						<div className="text-center group">
							<div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
								<Shield className="h-8 w-8 text-blue-600" />
							</div>
							<h3 className="text-xl font-bold text-gray-900 mb-2">Compra Segura</h3>
							<p className="text-gray-600">
								Transações 100% seguras com certificado SSL e criptografia.
							</p>
						</div>

						<div className="text-center group">
							<div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
								<Users className="h-8 w-8 text-orange-600" />
							</div>
							<h3 className="text-xl font-bold text-gray-900 mb-2">+1M Clientes</h3>
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
								<p className="text-sm text-gray-600">Destino, datas e viajantes</p>
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
							<h3 className="text-xl font-bold text-gray-900 mb-4">Compare planos</h3>
							<p className="text-gray-600 mb-6">
								Veja as melhores opções de seguradoras, compare coberturas e preços
								lado a lado.
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
								Escolha seu plano, efetue o pagamento e receba sua apólice por email
								instantaneamente.
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
								&quot;Excelente atendimento! Tive um problema médico na Europa e fui
								atendido rapidamente. Recomendo para todos os viajantes.&quot;
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
								&quot;Suporte 24h realmente funciona! Precisei de ajuda durante a
								madrugada e fui atendida imediatamente. Empresa confiável!&quot;
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
						Faça sua cotação agora e encontre o seguro de viagem perfeito para você.
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
