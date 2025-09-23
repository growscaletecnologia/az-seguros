"use client";

import {
	ArrowRight,
	Banknote,
	Building,
	Calendar,
	CheckCircle,
	CreditCard,
	Lock,
	Mail,
	MapPin,
	Phone,
	Shield,
	Smartphone,
	Tag,
	User,
	Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { usePreRegisterForm } from "@/hooks/useRegisterStore";
import { toast } from "sonner";

export default function CheckoutPage() {
	const router = useRouter();
	const { formData } = usePreRegisterForm();
	// Estados para o checkout
	const [paymentMethod, setPaymentMethod] = useState("credit");
	const [couponCode, setCouponCode] = useState(formData?.coupon || "");
	const [couponApplied, setCouponApplied] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [couponLoading, setCouponLoading] = useState(false);
	const [couponError, setCouponError] = useState("");
	const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

	// Dados mock do plano selecionado
	const selectedPlan = {
		seguradora: "Assist Card",
		plano: "AC 60 Europa",
		preco: 89.9,
		precoOriginal: 99.9,
		coberturaMedica: 60000,
		coberturaBagagem: 1200,
		coberturaCancelamento: 5000,
	};

	// Dados mock da cotação
	const quotationData = {
		destino: "Europa",
		dataIda: "15/03/2024",
		dataVolta: "25/03/2024",
		viajantes: 2,
		nome: "João Silva",
		email: "joao@email.com",
		telefone: "(11) 99999-9999",
	};

	// Função para aplicar cupom
	const applyCoupon = async () => {
		if (!couponCode || couponApplied) return;
		
		setCouponLoading(true);
		setCouponError("");
		
		try {
			// Importação dinâmica para evitar problemas de SSR
			const { couponsService } = await import("@/services/api/coupons");
			
			const coupon = await couponsService.getByCode(couponCode);
			
			// Verificar se o cupom existe
			if (!coupon) {
				setCouponError("Cupom inválido ou não encontrado");
				setCouponApplied(false);
				return;
			}
			
			// Verificar se o cupom está ativo
			if (coupon.status !== 'ACTIVE') {
				setCouponError("Este cupom não está mais ativo");
				setCouponApplied(false);
				return;
			}
			
			// Verificar se o cupom expirou
			if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
				setCouponError("Este cupom expirou");
				setCouponApplied(false);
				return;
			}
			
			// Aplicar o cupom
			setAppliedCoupon(coupon);
			setCouponApplied(true);
			toast.success("Cupom aplicado com sucesso!");
			
			// Registrar uso do cupom (será finalizado na conclusão da compra)
			// Isso será feito na função de finalização do checkout
			
		} catch (error) {
			console.error("Erro ao aplicar cupom:", error);
			setCouponError("Erro ao verificar o cupom. Tente novamente.");
			setCouponApplied(false);
		} finally {
			setCouponLoading(false);
		}
	};

	const calculateTotal = () => {
		const subtotal = selectedPlan.preco * quotationData.viajantes;
		
		// Calcula o desconto do cupom com base no tipo (percentual ou fixo)
		let discount = 0;
		if (couponApplied && appliedCoupon) {
			if (appliedCoupon.discountType === 'PERCENTAGE') {
				discount = subtotal * (appliedCoupon.discount / 100);
			} else {
				discount = Math.min(appliedCoupon.discount, subtotal); // Não permitir desconto maior que o subtotal
			}
		}
		
		const pixDiscount = paymentMethod === "pix" ? subtotal * 0.05 : 0;
		
		return {
			subtotal,
			discount,
			pixDiscount,
			total: subtotal - discount - pixDiscount,
		};
	};

	const [segurados, setSegurados] = useState([
		{ nome: "", nascimento: "", cpf: "" },
	]);

	const addSegurado = () => {
		setSegurados([...segurados, { nome: "", nascimento: "", cpf: "" }]);
	};

	const updateSegurado = (index: number, field: string, value: string) => {
		const novos = [...segurados];

		(novos[index] as any)[field] = value;
		setSegurados(novos);
	};

	const removeSegurado = (index: number) => {
		setSegurados(segurados.filter((_, i) => i !== index));
	};

	const totals = calculateTotal();

	const handlePayment = async () => {
		setIsProcessing(true);
		
		try {
			// Simular processamento do pagamento
			await new Promise(resolve => setTimeout(resolve, 3000));
			
			// Se um cupom foi aplicado, registrar o uso
			if (couponApplied && appliedCoupon) {
				try {
					// Importação dinâmica para evitar problemas de SSR
					const { couponsService } = await import("@/services/api/coupons");
					
					await couponsService.registerUsage(appliedCoupon.id, {
						userId: "user-id", // Aqui seria o ID do usuário logado
						orderId: `order-${Date.now()}`, // Aqui seria o ID do pedido gerado
						discountApplied: appliedCoupon.discountType === 'PERCENTAGE' 
							? (selectedPlan.preco * quotationData.viajantes) * (appliedCoupon.discount / 100)
							: appliedCoupon.discount
					});
				} catch (error) {
					console.error("Erro ao registrar uso do cupom:", error);
					// Não interromper o checkout se o registro do cupom falhar
				}
			}
			
			toast.success("Pagamento processado com sucesso! Você receberá sua apólice por email.");
			// Aqui poderia redirecionar para uma página de sucesso
			// router.push("/checkout/sucesso");
		} catch (error) {
			console.error("Erro ao processar pagamento:", error);
			toast.error("Ocorreu um erro ao processar o pagamento. Tente novamente.");
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<div className="bg-gray-50 min-h-screen">
			{/* Header */}
			<div className="bg-white shadow-sm border-b">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<h1 className="text-3xl font-bold text-gray-900">Finalizar Compra</h1>
					<p className="text-gray-600 mt-2">
						Revise seus dados e efetue o pagamento
					</p>
				</div>
			</div>

			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Identificação dos Segurados */}

					{/* Formulário de Pagamento */}
					<div className="lg:col-span-2 space-y-6">
						<div className="bg-white rounded-lg shadow-sm p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Identificação dos Segurados
							</h3>

							{segurados.map((seg, index) => (
								<div
									key={index}
									className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end"
								>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Nome Completo
										</label>
										<input
											type="text"
											value={seg.nome}
											onChange={(e) =>
												updateSegurado(index, "nome", e.target.value)
											}
											placeholder="Digite o nome completo"
											className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Data de Nascimento
										</label>
										<input
											type="date"
											value={seg.nascimento}
											onChange={(e) =>
												updateSegurado(index, "nascimento", e.target.value)
											}
											className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
										/>
									</div>
									<div className="flex items-center gap-2">
										<div className="flex-1">
											<label className="block text-sm font-medium text-gray-700 mb-1">
												CPF
											</label>
											<input
												type="text"
												value={seg.cpf}
												onChange={(e) =>
													updateSegurado(index, "cpf", e.target.value)
												}
												placeholder="000.000.000-00"
												className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
											/>
										</div>
										{segurados.length > 1 && (
											<button
												type="button"
												onClick={() => removeSegurado(index)}
												className="px-3 py-2 text-sm text-red-600 hover:underline"
											>
												Remover
											</button>
										)}
									</div>
								</div>
							))}

							<button
								type="button"
								onClick={addSegurado}
								className="w-full mt-2 border-2 border-dashed border-green-400 text-green-600 py-3 rounded-lg font-medium flex items-center justify-center hover:bg-green-50"
							>
								+ Adicionar Segurado
							</button>
						</div>
						{/* Dados da Cotação */}
						<div className="bg-white rounded-lg shadow-sm p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Dados da Viagem
							</h3>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<div className="flex items-center space-x-2">
									<MapPin className="h-4 w-4 text-gray-500" />
									<div>
										<p className="text-sm text-gray-600">Destino</p>
										<p className="font-medium">{quotationData.destino}</p>
									</div>
								</div>
								<div className="flex items-center space-x-2">
									<Calendar className="h-4 w-4 text-gray-500" />
									<div>
										<p className="text-sm text-gray-600">Período</p>
										<p className="font-medium">
											{quotationData.dataIda} - {quotationData.dataVolta}
										</p>
									</div>
								</div>
								<div className="flex items-center space-x-2">
									<Users className="h-4 w-4 text-gray-500" />
									<div>
										<p className="text-sm text-gray-600">Viajantes</p>
										<p className="font-medium">
											{quotationData.viajantes} pessoas
										</p>
									</div>
								</div>
								<div className="flex items-center space-x-2">
									<User className="h-4 w-4 text-gray-500" />
									<div>
										<p className="text-sm text-gray-600">Responsável</p>
										<p className="font-medium">{quotationData.nome}</p>
									</div>
								</div>
							</div>
						</div>

						{/* Cupom de Desconto */}
						<div className="bg-white rounded-lg shadow-sm p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
								<Tag className="h-5 w-5 mr-2 text-green-600" />
								Cupom de Desconto
							</h3>
							<div className="flex space-x-3">
								<input
									type="text"
									value={couponCode}
									onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
									placeholder="Digite seu cupom"
									className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									disabled={couponApplied}
								/>
								<button
									onClick={applyCoupon}
									disabled={couponApplied || !couponCode || couponLoading}
									className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{couponLoading ? (
										<span className="flex items-center">
											<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
											Verificando
										</span>
									) : couponApplied ? "Aplicado" : "Aplicar"}
								</button>
							</div>
							
							{couponError && (
								<div className="mt-3 flex items-center space-x-2 text-red-600">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
									<span className="text-sm">{couponError}</span>
								</div>
							)}
							
							{couponApplied && appliedCoupon && (
								<div className="mt-3 flex items-center space-x-2 text-green-600">
									<CheckCircle className="h-4 w-4" />
									<span className="text-sm">
										Cupom aplicado com sucesso! 
										{appliedCoupon.discountType === 'PERCENTAGE' 
											? ` ${appliedCoupon.discount}% de desconto` 
											: ` R$ ${appliedCoupon.discount.toFixed(2)} de desconto`}
									</span>
								</div>
							)}
						</div>

						{/* Forma de Pagamento */}
						<div className="bg-white rounded-lg shadow-sm p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
								<CreditCard className="h-5 w-5 mr-2 text-blue-600" />
								Forma de Pagamento
							</h3>

							<div className="space-y-4">
								{/* PIX */}
								<label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
									<input
										type="radio"
										name="payment"
										value="pix"
										checked={paymentMethod === "pix"}
										onChange={(e) => setPaymentMethod(e.target.value)}
										className="text-blue-600 focus:ring-blue-500"
									/>
									<div className="ml-3 flex-1 flex items-center justify-between">
										<div className="flex items-center space-x-3">
											<Smartphone className="h-6 w-6 text-green-600" />
											<div>
												<p className="font-medium text-gray-900">PIX</p>
												<p className="text-sm text-gray-600">
													Pagamento instantâneo
												</p>
											</div>
										</div>
										<div className="text-right">
											<p className="text-green-600 font-medium">
												5% de desconto
											</p>
											<p className="text-sm text-gray-600">
												R$ {(totals.subtotal * 0.05).toFixed(2)} de economia
											</p>
										</div>
									</div>
								</label>

								{/* Cartão de Crédito */}
								<label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
									<input
										type="radio"
										name="payment"
										value="credit"
										checked={paymentMethod === "credit"}
										onChange={(e) => setPaymentMethod(e.target.value)}
										className="text-blue-600 focus:ring-blue-500"
									/>
									<div className="ml-3 flex-1 flex items-center justify-between">
										<div className="flex items-center space-x-3">
											<CreditCard className="h-6 w-6 text-blue-600" />
											<div>
												<p className="font-medium text-gray-900">
													Cartão de Crédito
												</p>
												<p className="text-sm text-gray-600">
													Parcelamento em até 12x
												</p>
											</div>
										</div>
										<div className="text-right">
											<p className="text-blue-600 font-medium">
												Até 12x sem juros
											</p>
											<p className="text-sm text-gray-600">
												R$ {(totals.total / 12).toFixed(2)}/mês
											</p>
										</div>
									</div>
								</label>

								{/* Boleto */}
								{/* <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
									<input
										type="radio"
										name="payment"
										value="boleto"
										checked={paymentMethod === "boleto"}
										onChange={(e) => setPaymentMethod(e.target.value)}
										className="text-blue-600 focus:ring-blue-500"
									/>
									<div className="ml-3 flex-1 flex items-center justify-between">
										<div className="flex items-center space-x-3">
											<Banknote className="h-6 w-6 text-orange-600" />
											<div>
												<p className="font-medium text-gray-900">
													Boleto Bancário
												</p>
												<p className="text-sm text-gray-600">
													Vencimento em 3 dias úteis
												</p>
											</div>
										</div>
									</div>
								</label> */}
							</div>

							{/* Campos do Cartão */}
							{paymentMethod === "credit" && (
								<div className="mt-6 space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Número do Cartão
											</label>
											<input
												type="text"
												placeholder="1234 5678 9012 3456"
												className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Nome no Cartão
											</label>
											<input
												type="text"
												placeholder="Nome como no cartão"
												className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Validade
											</label>
											<input
												type="text"
												placeholder="MM/AA"
												className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												CVV
											</label>
											<input
												type="text"
												placeholder="123"
												className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
											/>
										</div>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Parcelas
										</label>
										<select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
											<option>
												1x de R$ {totals.total.toFixed(2)} sem juros
											</option>
											<option>
												2x de R$ {(totals.total / 2).toFixed(2)} sem juros
											</option>
											<option>
												3x de R$ {(totals.total / 3).toFixed(2)} sem juros
											</option>
											<option>
												6x de R$ {(totals.total / 6).toFixed(2)} sem juros
											</option>
											<option>
												12x de R$ {(totals.total / 12).toFixed(2)} sem juros
											</option>
										</select>
									</div>
								</div>
							)}
						</div>
						<div className="bg-white rounded-lg shadow-sm p-6">
							<div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
								<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
									<Building className="h-5 w-5 mr-2 text-blue-600" />
									Endereço do Asegurado
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div>
										<input
											type="text"
											placeholder="Contato"
											className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
									<div>
										<input
											type="email"
											placeholder="email"
											className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
									<div>
										<input
											type="text"
											placeholder="telefone"
											className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
									{/* CEP */}
									<div>
										<input
											type="text"
											placeholder="CEP"
											className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
									{/* Endereço */}
									<div className="md:col-span-2">
										<input
											type="text"
											placeholder="Endereço"
											className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
									{/* Número */}
									<div>
										<input
											type="text"
											placeholder="Número"
											className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
									{/* Complemento */}
									<div>
										<input
											type="text"
											placeholder="Complemento"
											className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
									{/* Bairro */}
									<div>
										<input
											type="text"
											placeholder="Bairro"
											className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
									{/* Cidade */}
									<div>
										<input
											type="text"
											placeholder="Cidade"
											className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
									{/* Estado */}
									<div>
										<select
											className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
											defaultValue=""
										>
											<option value="" disabled>
												Estado
											</option>
											<option value="AC">Acre (AC)</option>
											<option value="AL">Alagoas (AL)</option>
											<option value="AP">Amapá (AP)</option>
											<option value="AM">Amazonas (AM)</option>
											<option value="BA">Bahia (BA)</option>
											<option value="CE">Ceará (CE)</option>
											<option value="DF">Distrito Federal (DF)</option>
											<option value="ES">Espírito Santo (ES)</option>
											<option value="GO">Goiás (GO)</option>
											<option value="MA">Maranhão (MA)</option>
											<option value="MT">Mato Grosso (MT)</option>
											<option value="MS">Mato Grosso do Sul (MS)</option>
											<option value="MG">Minas Gerais (MG)</option>
											<option value="PA">Pará (PA)</option>
											<option value="PB">Paraíba (PB)</option>
											<option value="PR">Paraná (PR)</option>
											<option value="PE">Pernambuco (PE)</option>
											<option value="PI">Piauí (PI)</option>
											<option value="RJ">Rio de Janeiro (RJ)</option>
											<option value="RN">Rio Grande do Norte (RN)</option>
											<option value="RS">Rio Grande do Sul (RS)</option>
											<option value="RO">Rondônia (RO)</option>
											<option value="RR">Roraima (RR)</option>
											<option value="SC">Santa Catarina (SC)</option>
											<option value="SP">São Paulo (SP)</option>
											<option value="SE">Sergipe (SE)</option>
											<option value="TO">Tocantins (TO)</option>
										</select>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Resumo do Pedido */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Resumo do Pedido
							</h3>

							{/* Plano Selecionado */}
							<div className="border-b pb-4 mb-4">
								<div className="flex items-start justify-between mb-2">
									<div>
										<h4 className="font-medium text-gray-900">
											{selectedPlan.plano}
										</h4>
										<p className="text-sm text-gray-600">
											{selectedPlan.seguradora}
										</p>
									</div>
									<p className="font-medium">
										R$ {selectedPlan.preco.toFixed(2)}
									</p>
								</div>
								<p className="text-sm text-gray-600">
									{quotationData.viajantes} viajante(s) × R${" "}
									{selectedPlan.preco.toFixed(2)}
								</p>
							</div>

							{/* Coberturas */}
							<div className="border-b pb-4 mb-4">
								<h4 className="font-medium text-gray-900 mb-2">
									Coberturas Incluídas
								</h4>
								<div className="space-y-1 text-sm text-gray-600">
									<p>
										Cobertura Médica: USD{" "}
										{selectedPlan.coberturaMedica.toLocaleString()}
									</p>
									<p>
										Bagagem: USD{" "}
										{selectedPlan.coberturaBagagem.toLocaleString()}
									</p>
									<p>
										Cancelamento: USD{" "}
										{selectedPlan.coberturaCancelamento.toLocaleString()}
									</p>
								</div>
							</div>

							{/* Cálculos */}
							<div className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span>Subtotal:</span>
									<span>R$ {totals.subtotal.toFixed(2)}</span>
								</div>

								{couponApplied && (
									<div className="flex justify-between text-green-600">
										<span>Desconto (10%):</span>
										<span>-R$ {totals.discount.toFixed(2)}</span>
									</div>
								)}

								{paymentMethod === "pix" && (
									<div className="flex justify-between text-green-600">
										<span>Desconto PIX (5%):</span>
										<span>-R$ {totals.pixDiscount.toFixed(2)}</span>
									</div>
								)}
							</div>

							<div className="border-t pt-4 mt-4">
								<div className="flex justify-between text-lg font-bold">
									<span>Total:</span>
									<span>R$ {totals.total.toFixed(2)}</span>
								</div>
							</div>

							{/* Botão de Pagamento */}
							<button
								onClick={handlePayment}
								disabled={isProcessing}
								className="w-full mt-6 bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
							>
								{isProcessing ? (
									<>
										<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
										<span>Processando...</span>
									</>
								) : (
									<>
										<Lock className="h-5 w-5" />
										<span>Efetuar Pagamento</span>
									</>
								)}
							</button>

							{/* Segurança */}
							<div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-600">
								<Shield className="h-4 w-4 text-green-600" />
								<span>Pagamento 100% seguro</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
