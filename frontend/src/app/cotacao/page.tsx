"use client";

import {
	AlertCircle,
	ArrowRight,
	Calendar,
	CheckCircle,
	Clock,
	DollarSign,
	Mail,
	MapPin,
	Phone,
	Shield,
	User,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CotacaoPage() {
	const [formData, setFormData] = useState({
		destino: "",
		dataIda: "",
		dataVolta: "",
		numViajantes: "1",
		nome: "",
		email: "",
		telefone: "",
		aceitaTermos: false,
		viagemBrasil: false,
	});

	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value, type } = e.target;
		const checked = (e.target as HTMLInputElement).checked;

		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));

		// Limpar erro quando o usuário começar a digitar
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
	};

	const validateForm = () => {
		const newErrors: { [key: string]: string } = {};

		if (!formData.destino) newErrors.destino = "Destino é obrigatório";
		if (!formData.dataIda) newErrors.dataIda = "Data de ida é obrigatória";
		if (!formData.dataVolta)
			newErrors.dataVolta = "Data de volta é obrigatória";
		if (!formData.nome) newErrors.nome = "Nome é obrigatório";
		if (!formData.email) newErrors.email = "E-mail é obrigatório";
		if (!formData.telefone) newErrors.telefone = "Telefone é obrigatório";
		if (!formData.aceitaTermos)
			newErrors.aceitaTermos = "Você deve aceitar os termos";
		if (!formData.viagemBrasil)
			newErrors.viagemBrasil = "Confirme que a viagem inicia no Brasil";

		// Validar formato do email
		if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "E-mail inválido";
		}

		// Validar datas
		if (formData.dataIda && formData.dataVolta) {
			const ida = new Date(formData.dataIda);
			const volta = new Date(formData.dataVolta);
			const hoje = new Date();

			if (ida < hoje) {
				newErrors.dataIda = "Data de ida deve ser futura";
			}

			if (volta <= ida) {
				newErrors.dataVolta = "Data de volta deve ser posterior à ida";
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		setIsSubmitting(true);

		// Simular envio para API
		setTimeout(() => {
			setIsSubmitting(false);
			// Redirecionar para página de planos com os dados da cotação
			window.location.href = "/planos";
		}, 2000);
	};

	return (
		<div className="bg-gray-50 min-h-screen">
			{/* Header da página */}
			<div className="bg-white shadow-sm border-b">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="text-center">
						<h1 className="text-3xl font-bold text-gray-900">
							Faça sua Cotação
						</h1>
						<p className="text-gray-600 mt-2">
							Preencha os dados abaixo e encontre o melhor seguro de viagem para
							você
						</p>
					</div>
				</div>
			</div>

			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Formulário */}
					<div className="lg:col-span-2">
						<div className="bg-white rounded-lg shadow-sm p-6">
							<form onSubmit={handleSubmit} className="space-y-6">
								{/* Dados da Viagem */}
								<div>
									<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
										<MapPin className="h-5 w-5 mr-2 text-blue-600" />
										Dados da Viagem
									</h3>

									<div className="grid grid-cols-1  text-black md:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Destino *
											</label>
											<select
												name="destino"
												value={formData.destino}
												onChange={handleInputChange}
												className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
													errors.destino ? "border-red-500" : "border-gray-300"
												}`}
											>
												<option value="">Selecione o destino</option>
												<option value="europa">Europa</option>
												<option value="america-norte">América do Norte</option>
												<option value="america-sul">América do Sul</option>
												<option value="asia">Ásia</option>
												<option value="oceania">Oceania</option>
												<option value="africa">África</option>
												<option value="mundial">Mundial</option>
											</select>
											{errors.destino && (
												<p className="text-red-500 text-sm mt-1">
													{errors.destino}
												</p>
											)}
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Número de Viajantes *
											</label>
											<select
												name="numViajantes"
												value={formData.numViajantes}
												onChange={handleInputChange}
												className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
											>
												{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
													<option key={num} value={num.toString()}>
														{num} {num === 1 ? "viajante" : "viajantes"}
													</option>
												))}
											</select>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Data de Ida *
											</label>
											<input
												type="date"
												name="dataIda"
												value={formData.dataIda}
												onChange={handleInputChange}
												className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
													errors.dataIda ? "border-red-500" : "border-gray-300"
												}`}
											/>
											{errors.dataIda && (
												<p className="text-red-500 text-sm mt-1">
													{errors.dataIda}
												</p>
											)}
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Data de Volta *
											</label>
											<input
												type="date"
												name="dataVolta"
												value={formData.dataVolta}
												onChange={handleInputChange}
												className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
													errors.dataVolta
														? "border-red-500"
														: "border-gray-300"
												}`}
											/>
											{errors.dataVolta && (
												<p className="text-red-500 text-sm mt-1">
													{errors.dataVolta}
												</p>
											)}
										</div>
									</div>
								</div>

								{/* Dados Pessoais */}
								<div>
									<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
										<User className="h-5 w-5 mr-2 text-blue-600" />
										Dados Pessoais
									</h3>

									<div className="grid grid-cols-1 md:grid-cols-2 text-black gap-4">
										<div className="md:col-span-2">
											<label className="block text-sm font-medium placeholder:bg-black mb-2">
												Nome Completo *
											</label>
											<input
												type="text"
												name="nome"
												value={formData.nome}
												onChange={handleInputChange}
												placeholder="Digite seu nome completo"
												className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
													errors.nome ? "border-red-500" : "border-gray-300"
												}`}
											/>
											{errors.nome && (
												<p className="text-red-500 text-sm mt-1">
													{errors.nome}
												</p>
											)}
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												E-mail *
											</label>
											<input
												type="email"
												name="email"
												value={formData.email}
												onChange={handleInputChange}
												placeholder="seu@email.com"
												className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
													errors.email ? "border-red-500" : "border-gray-300"
												}`}
											/>
											{errors.email && (
												<p className="text-red-500 text-sm mt-1">
													{errors.email}
												</p>
											)}
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Telefone *
											</label>
											<input
												type="tel"
												name="telefone"
												value={formData.telefone}
												onChange={handleInputChange}
												placeholder="(11) 99999-9999"
												className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
													errors.telefone ? "border-red-500" : "border-gray-300"
												}`}
											/>
											{errors.telefone && (
												<p className="text-red-500 text-sm mt-1">
													{errors.telefone}
												</p>
											)}
										</div>
									</div>
								</div>

								{/* Confirmações */}
								<div className="space-y-4">
									<div className="flex items-start space-x-3">
										<input
											type="checkbox"
											name="viagemBrasil"
											checked={formData.viagemBrasil}
											onChange={handleInputChange}
											className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
										/>
										<div>
											<label className="text-sm text-gray-700">
												Confirmo que minha viagem inicia no Brasil *
											</label>
											{errors.viagemBrasil && (
												<p className="text-red-500 text-sm mt-1">
													{errors.viagemBrasil}
												</p>
											)}
										</div>
									</div>

									<div className="flex items-start space-x-3">
										<input
											type="checkbox"
											name="aceitaTermos"
											checked={formData.aceitaTermos}
											onChange={handleInputChange}
											className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
										/>
										<div>
											<label className="text-sm text-gray-700">
												Aceito os{" "}
												<Link
													href="/termos"
													className="text-blue-600 hover:underline"
												>
													termos de uso
												</Link>{" "}
												e{" "}
												<Link
													href="/privacidade"
													className="text-blue-600 hover:underline"
												>
													política de privacidade
												</Link>{" "}
												*
											</label>
											{errors.aceitaTermos && (
												<p className="text-red-500 text-sm mt-1">
													{errors.aceitaTermos}
												</p>
											)}
										</div>
									</div>
								</div>

								{/* Botão de Submit */}
								<div className="pt-6">
									<button
										type="submit"
										disabled={isSubmitting}
										className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
									>
										{isSubmitting ? (
											<>
												<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
												<span>Processando...</span>
											</>
										) : (
											<>
												<span>Ver Planos Disponíveis</span>
												<ArrowRight className="h-5 w-5" />
											</>
										)}
									</button>
								</div>
							</form>
						</div>
					</div>

					{/* Sidebar com informações */}
					<div className="lg:col-span-1">
						<div className="space-y-6">
							{/* Vantagens */}
							<div className="bg-white rounded-lg shadow-sm p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">
									Por que contratar conosco?
								</h3>
								<div className="space-y-4">
									<div className="flex items-start space-x-3">
										<DollarSign className="h-5 w-5 text-green-500 mt-0.5" />
										<div>
											<p className="font-medium text-gray-900">Melhor Preço</p>
											<p className="text-sm text-gray-600">
												Garantimos o melhor preço do mercado
											</p>
										</div>
									</div>
									<div className="flex items-start space-x-3">
										<Clock className="h-5 w-5 text-blue-500 mt-0.5" />
										<div>
											<p className="font-medium text-gray-900">Suporte 24h</p>
											<p className="text-sm text-gray-600">
												Atendimento especializado sempre
											</p>
										</div>
									</div>
									<div className="flex items-start space-x-3">
										<Shield className="h-5 w-5 text-purple-500 mt-0.5" />
										<div>
											<p className="font-medium text-gray-900">Compra Segura</p>
											<p className="text-sm text-gray-600">
												Transações 100% protegidas
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* Dúvidas */}
							<div className="bg-blue-50 rounded-lg p-6">
								<div className="flex items-start space-x-3">
									<AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
									<div>
										<h4 className="font-medium text-blue-900 mb-2">
											Precisa de ajuda?
										</h4>
										<p className="text-sm text-blue-700 mb-3">
											Nossa equipe está pronta para esclarecer suas dúvidas.
										</p>
										<div className="space-y-2 text-sm">
											<div className="flex items-center space-x-2">
												<Phone className="h-4 w-4 text-blue-600" />
												<span className="text-blue-700">0800 123 4567</span>
											</div>
											<div className="flex items-center space-x-2">
												<Mail className="h-4 w-4 text-blue-600" />
												<span className="text-blue-700">
													ajuda@seguroviagem.com
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
