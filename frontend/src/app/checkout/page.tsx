"use client";

import {
	ArrowRight,
	Banknote,
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
import { useState } from "react";

export default function CheckoutPage() {
	const [paymentMethod, setPaymentMethod] = useState("credit");
	const [couponCode, setCouponCode] = useState("");
	const [couponApplied, setCouponApplied] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);

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

	const applyCoupon = () => {
		if (couponCode.toLowerCase() === "desconto10") {
			setCouponApplied(true);
		}
	};

	const calculateTotal = () => {
		const subtotal = selectedPlan.preco * quotationData.viajantes;
		const discount = couponApplied ? subtotal * 0.1 : 0;
		const pixDiscount = paymentMethod === "pix" ? subtotal * 0.05 : 0;
		return {
			subtotal,
			discount,
			pixDiscount,
			total: subtotal - discount - pixDiscount,
		};
	};
	// ... dentro do componente CheckoutPage

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

	const handlePayment = () => {
		setIsProcessing(true);
		// Simular processamento do pagamento
		setTimeout(() => {
			setIsProcessing(false);
			alert("Pagamento processado com sucesso! Você receberá sua apólice por email.");
		}, 3000);
	};

	return (
		<div className="bg-gray-50 min-h-screen">
			{/* Header */}
			<div className="bg-white shadow-sm border-b">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<h1 className="text-3xl font-bold text-gray-900">Finalizar Compra</h1>
					<p className="text-gray-600 mt-2">Revise seus dados e efetue o pagamento</p>
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
          onChange={(e) => updateSegurado(index, "nome", e.target.value)}
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
          onChange={(e) => updateSegurado(index, "nascimento", e.target.value)}
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
            onChange={(e) => updateSegurado(index, "cpf", e.target.value)}
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
									onChange={(e) => setCouponCode(e.target.value)}
									placeholder="Digite seu cupom"
									className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									disabled={couponApplied}
								/>
								<button
									onClick={applyCoupon}
									disabled={couponApplied || !couponCode}
									className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{couponApplied ? "Aplicado" : "Aplicar"}
								</button>
							</div>
							{couponApplied && (
								<div className="mt-3 flex items-center space-x-2 text-green-600">
									<CheckCircle className="h-4 w-4" />
									<span className="text-sm">
										Cupom aplicado com sucesso! 10% de desconto
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
								<label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
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
								</label>
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
									<p> COVID-19: Incluído</p>
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
