"use client";
import { ArrowLeft, Mail, Minus, Plus } from "lucide-react";
import React, { useState } from "react";
import { getProductsForComparison, mockProducts } from "../../lib/mock-products";

const ComparacaoPage = () => {
	const [selectedProducts, setSelectedProducts] = useState<number[]>([1, 2]);
	const [showEmailModal, setShowEmailModal] = useState(false);
	const [email, setEmail] = useState("");

	const productsToCompare = getProductsForComparison(selectedProducts);

	const handleAddProduct = () => {
		const availableProducts = mockProducts.filter((p) => !selectedProducts.includes(p.id));
		if (availableProducts.length > 0) {
			setSelectedProducts([...selectedProducts, availableProducts[0].id]);
		}
	};

	const handleRemoveProduct = (productId: number) => {
		if (selectedProducts.length > 1) {
			setSelectedProducts(selectedProducts.filter((id) => id !== productId));
		}
	};

	const handleSendEmail = () => {
		// Simular envio de email
		alert(`Comparação enviada para ${email}!`);
		setShowEmailModal(false);
		setEmail("");
	};

	const formatPrice = (price: number) => {
		return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
	};

	return (
		<div className="bg-gray-50 min-h-screen">
			{/* Header */}
			<div className="bg-white shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
								<ArrowLeft className="h-5 w-5" />
								<span>Voltar à pesquisa</span>
							</button>
						</div>
						<div className="flex items-center space-x-4">
							<div className="text-sm text-gray-600">
								<span>Você pesquisou por:</span>
								<div className="mt-1">
									<span className="font-medium">Europa</span>
									<span className="mx-2">•</span>
									<span>Qui., 4 Set. 2025 - Sáb., 20 Set. 2025</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Título e ações */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
					<h1 className="text-2xl font-bold text-gray-900">Compare os planos:</h1>
					<div className="flex space-x-3">
						<button
							onClick={() => setShowEmailModal(true)}
							className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
						>
							<Mail className="h-4 w-4" />
							<span>Enviar comparação por e-mail</span>
						</button>
					</div>
				</div>

				{/* Tabela de comparação */}
				<div className="bg-white rounded-lg shadow-sm overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							{/* Header com produtos */}
							<thead>
								<tr className="bg-gray-50">
									<th className="px-6 py-4 text-left text-sm font-medium text-gray-900 w-1/4">
										Coberturas Médicas
									</th>
									{productsToCompare.map((product) => (
										<th
											key={product.id}
											className="px-6 py-4 text-center relative"
										>
											<div className="space-y-2">
												<div className="flex items-center justify-center space-x-2">
													<h3 className="font-bold text-gray-900">
														{product.plano}
													</h3>
													{selectedProducts.length > 1 && (
														<button
															onClick={() =>
																handleRemoveProduct(product.id)
															}
															className="text-red-500 hover:text-red-700"
														>
															<Minus className="h-4 w-4" />
														</button>
													)}
												</div>
												<p className="text-sm text-gray-600">
													{product.seguradora}
												</p>
												<div className="space-y-1">
													<p className="text-sm text-gray-500 line-through">
														{formatPrice(product.precoOriginal)}
													</p>
													<p className="text-xl font-bold text-green-600">
														{formatPrice(product.preco)}
													</p>
													<p className="text-xs text-gray-600">
														10x sem juros
													</p>
													<div className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
														5% off no PIX
													</div>
												</div>
												<button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
													Comprar
												</button>
											</div>
										</th>
									))}
									{selectedProducts.length < 3 && (
										<th className="px-6 py-4 text-center">
											<button
												onClick={handleAddProduct}
												className="flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-800"
											>
												<Plus className="h-5 w-5" />
												<span>Adicionar produto</span>
											</button>
										</th>
									)}
								</tr>
							</thead>

							{/* Corpo da tabela com detalhes */}
							<tbody className="divide-y divide-gray-200">
								{/* Linha para cada detalhe */}
								{mockProducts[0].detalhes.map((detail, index) => (
									<tr
										key={detail.id}
										className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
									>
										<td className="px-6 py-4 text-sm font-medium text-gray-900">
											{detail.label}
											<button className="ml-2 text-blue-500 hover:text-blue-700">
												<Plus className="h-3 w-3" />
											</button>
										</td>
										{productsToCompare.map((product) => {
											const productDetail = product.detalhes.find(
												(d) => d.id === detail.id,
											);
											return (
												<td
													key={product.id}
													className="px-6 py-4 text-sm text-gray-700 text-center"
												>
													{productDetail ? productDetail.value : "-"}
												</td>
											);
										})}
										{selectedProducts.length < 3 && (
											<td className="px-6 py-4"></td>
										)}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/* Resumo dos produtos selecionados */}
				<div className="mt-8 bg-white rounded-lg shadow-sm p-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">
						Resumo da Comparação
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{productsToCompare.map((product) => (
							<div key={product.id} className="border rounded-lg p-4">
								<h3 className="font-semibold text-gray-900 mb-2">
									{product.plano}
								</h3>
								<p className="text-sm text-gray-600 mb-3">{product.seguradora}</p>
								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span>Cobertura Médica:</span>
										<span className="font-medium">
											USD {product.coberturaMedica.toLocaleString()}
										</span>
									</div>
									<div className="flex justify-between">
										<span>Bagagem:</span>
										<span className="font-medium">
											USD {product.coberturaBagagem.toLocaleString()}
										</span>
									</div>
									<div className="flex justify-between">
										<span>COVID-19:</span>
										<span className="font-medium">
											{product.coberturaPandemia ? "SIM" : "NÃO"}
										</span>
									</div>
								</div>
								<div className="mt-4 pt-4 border-t">
									<div className="text-center">
										<p className="text-lg font-bold text-green-600">
											{formatPrice(product.preco)}
										</p>
										<button className="w-full mt-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
											Comprar
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Modal de envio por email */}
			{showEmailModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Enviar comparação por e-mail
						</h3>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Seu e-mail:
								</label>
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="seu@email.com"
								/>
							</div>
							<div className="flex space-x-3">
								<button
									onClick={handleSendEmail}
									className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
									disabled={!email}
								>
									Enviar
								</button>
								<button
									onClick={() => setShowEmailModal(false)}
									className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
								>
									Cancelar
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ComparacaoPage;
