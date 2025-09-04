"use client";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";

interface Pedido {
	id: number;
	numeroPedido: string;
	cliente: string;
	emailCliente: string;
	produto: string;
	valor: number;
	status: "pendente" | "pago" | "cancelado" | "reembolsado";
	dataPedido: string;
	dataViagem: string;
	destino: string;
}

const PedidosPage = () => {
	const [pedidos] = useState<Pedido[]>([
		{
			id: 1,
			numeroPedido: "PED-2024-001",
			cliente: "João Silva",
			emailCliente: "joao@email.com",
			produto: "Seguro Europa Premium",
			valor: 285.54,
			status: "pago",
			dataPedido: "2025-03-15",
			dataViagem: "2025-09-15",
			destino: "Europa",
		},
		{
			id: 2,
			numeroPedido: "PED-2024-002",
			cliente: "Maria Santos",
			emailCliente: "maria@email.com",
			produto: "Seguro EUA Básico",
			valor: 169.66,
			status: "pendente",
			dataPedido: "2025-09-15",
			dataViagem: "2025-09-16",
			destino: "Estados Unidos",
		},
		{
			id: 3,
			numeroPedido: "PED-2024-003",
			cliente: "Pedro Costa",
			emailCliente: "pedro@email.com",
			produto: "Seguro Mundial",
			valor: 450.0,
			status: "cancelado",
			dataPedido: "2025-09-04",
			dataViagem: "2025-09-16",
			destino: "Ásia",
		},

		{
			id: 4,
			numeroPedido: "PED-2024-003",
			cliente: "Lucas Costa",
			emailCliente: "lucas@email.com",
			produto: "Seguro Mundial",
			valor: 450.0,
			status: "pago",
			dataPedido: "2025-09-04",
			dataViagem: "2025-09-16",
			destino: "Ásia",
		},
		{
			id: 5,
			numeroPedido: "PED-2024-003",
			cliente: "Gabriel silva",
			emailCliente: "gabriel@email.com",
			produto: "Seguro Mundial",
			valor: 450.0,
			status: "pago",
			dataPedido: "2025-09-04",
			dataViagem: "2025-09-16",
			destino: "Ásia",
		},
		{
			id: 6,
			numeroPedido: "PED-2024-003",
			cliente: "Pedro Costa",
			emailCliente: "pedro@email.com",
			produto: "Seguro Mundial",
			valor: 450.0,
			status: "pago",
			dataPedido: "2025-09-04",
			dataViagem: "2025-09-16",
			destino: "Ásia",
		},
		{
			id: 7,
			numeroPedido: "PED-2024-003",
			cliente: "Pedro Costa",
			emailCliente: "pedro@email.com",
			produto: "Seguro Mundial",
			valor: 450.0,
			status: "cancelado",
			dataPedido: "2025-09-04",
			dataViagem: "2025-09-16",
			destino: "Ásia",
		},
		{
			id: 8,
			numeroPedido: "PED-2024-003",
			cliente: "Pedro Costa",
			emailCliente: "pedro@email.com",
			produto: "Seguro Mundial",
			valor: 450.0,
			status: "pago",
			dataPedido: "2025-09-04",
			dataViagem: "2025-09-16",
			destino: "Ásia",
		},

		{
			id: 9,
			numeroPedido: "PED-2024-003",
			cliente: "Pedro Costa",
			emailCliente: "pedro@email.com",
			produto: "Seguro Mundial",
			valor: 450.0,
			status: "cancelado",
			dataPedido: "2025-09-04",
			dataViagem: "2025-09-16",
			destino: "Ásia",
		},
		{
			id: 10,
			numeroPedido: "PED-2024-003",
			cliente: "Pedro Costa",
			emailCliente: "pedro@email.com",
			produto: "Seguro Mundial",
			valor: 450.0,
			status: "cancelado",
			dataPedido: "2025-09-04",
			dataViagem: "2025-09-16",
			destino: "Ásia",
		},
		{
			id: 11,
			numeroPedido: "PED-2024-003",
			cliente: "Pedro Costa",
			emailCliente: "pedro@email.com",
			produto: "Seguro Mundial",
			valor: 450.0,
			status: "cancelado",
			dataPedido: "2025-09-04",
			dataViagem: "2025-09-16",
			destino: "Ásia",
		},
		{
			id: 12,
			numeroPedido: "PED-2024-003",
			cliente: "Pedro Costa",
			emailCliente: "pedro@email.com",
			produto: "Seguro Mundial",
			valor: 450.0,
			status: "cancelado",
			dataPedido: "2025-09-04",
			dataViagem: "2025-09-16",
			destino: "Ásia",
		},
		{
			id: 13,
			numeroPedido: "PED-2024-003",
			cliente: "Pedro Costa",
			emailCliente: "pedro@email.com",
			produto: "Seguro Mundial",
			valor: 450.0,
			status: "cancelado",
			dataPedido: "2025-09-04",
			dataViagem: "2025-09-16",
			destino: "Ásia",
		},
		{
			id: 14,
			numeroPedido: "PED-2024-003",
			cliente: "Pedro Costa",
			emailCliente: "pedro@email.com",
			produto: "Seguro Mundial",
			valor: 450.0,
			status: "cancelado",
			dataPedido: "2025-09-04",
			dataViagem: "2025-09-16",
			destino: "Ásia",
		},
		{
			id: 15,
			numeroPedido: "PED-2024-004",
			cliente: "Maria Silva",
			emailCliente: "maria@email.com",
			produto: "Seguro Viagem",
			valor: 300.0,
			status: "pendente",
			dataPedido: "2025-09-05",
			dataViagem: "2025-09-17",
			destino: "Europa",
		},
	]);

	const [filtroCliente, setFiltroCliente] = useState("");
	const [filtroStatus, setFiltroStatus] = useState("");
	const [filtroData, setFiltroData] = useState("");
	const limparFiltros = () => {
		setFiltroCliente("");
		setFiltroStatus("");
		setFiltroData("");
	};

	const pedidosFiltrados = pedidos.filter((pedido) => {
		const matchCliente =
			pedido.cliente.toLowerCase().includes(filtroCliente.toLowerCase()) ||
			pedido.emailCliente.toLowerCase().includes(filtroCliente.toLowerCase());
		const matchStatus = filtroStatus === "" || pedido.status === filtroStatus;
		const matchData = filtroData === "" || pedido.dataPedido === filtroData; // compara com string "YYYY-MM-DD"

		return matchCliente && matchStatus && matchData;
	});

	const [paginaAtual, setPaginaAtual] = useState(1);
	const itensPorPagina = 5; // ajuste como quiser

	// total de páginas
	const totalPaginas = Math.ceil(pedidosFiltrados.length / itensPorPagina);

	// pega só os pedidos da página atual
	const indexInicial = (paginaAtual - 1) * itensPorPagina;
	const indexFinal = indexInicial + itensPorPagina;
	const pedidosPaginados = pedidosFiltrados.slice(indexInicial, indexFinal);
	const exportarExcel = () => {
		// Simulação de exportação para Excel
		const dados = pedidosFiltrados.map((pedido) => ({
			"Número do Pedido": pedido.numeroPedido,
			Cliente: pedido.cliente,
			Email: pedido.emailCliente,
			Produto: pedido.produto,
			Valor: `R$ ${pedido.valor.toFixed(2)}`,
			Status: pedido.status,
			"Data do Pedido": pedido.dataPedido,
			"Data da Viagem": pedido.dataViagem,
			Destino: pedido.destino,
		}));

		// Em uma implementação real, aqui seria usado uma biblioteca como xlsx
		console.log("Dados para exportação:", dados);
		alert(`Exportando ${dados.length} registros para Excel...`);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "pago":
				return "bg-green-100 text-green-800";
			case "pendente":
				return "bg-yellow-100 text-yellow-800";
			case "cancelado":
				return "bg-red-100 text-red-800";
			case "reembolsado":
				return "bg-blue-100 text-blue-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const totalVendas = pedidosFiltrados
		.filter((p) => p.status === "pago")
		.reduce((sum, p) => sum + p.valor, 0);

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">Listagem de Vendas</h1>

			{/* Filtros e estatísticas */}
			<div className="bg-white p-6 rounded-lg shadow mb-6">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
					<div>
						<label className="block text-sm font-medium mb-2">Filtrar por Data</label>
						<input
							type="date"
							className="w-full p-2 border rounded"
							value={filtroData}
							onChange={(e) => setFiltroData(e.target.value)}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-2">
							Filtrar por Cliente
						</label>
						<input
							type="text"
							className="w-full p-2 border rounded"
							placeholder="Nome ou email do cliente"
							value={filtroCliente}
							onChange={(e) => setFiltroCliente(e.target.value)}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2">Filtrar por Status</label>
						<select
							className="w-full p-2 border rounded"
							value={filtroStatus}
							onChange={(e) => setFiltroStatus(e.target.value)}
						>
							<option value="">Todos os status</option>
							<option value="pago">Pago</option>
							<option value="pendente">Pendente</option>
							<option value="cancelado">Cancelado</option>
							<option value="reembolsado">Reembolsado</option>
						</select>
					</div>

					<div className="flex gap-2  items-end">
						<button
							onClick={limparFiltros}
							className="w-full bg-primary text-white px-4 py-2 rounded hover:bg-secondary"
						>
							Limpar Filtros
						</button>
						<button
							onClick={exportarExcel}
							className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
						>
							Exportar Excel
						</button>
					</div>

					<div className="bg-blue-50 p-4 mt-1 rounded">
						<p className="text-sm text-blue-600">Total de Vendas Pagas</p>
						<p className="text-xl font-bold text-blue-800">
							R$ {totalVendas.toFixed(2)}
						</p>
					</div>
				</div>
			</div>

			{/* Tabela de pedidos */}
			<div className="bg-white p-6 rounded-lg shadow">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-semibold">
						Pedidos ({pedidosFiltrados.length} de {pedidos.length})
					</h2>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full table-auto">
						<thead>
							<tr className="bg-gray-50">
								<th className="px-4 py-2 text-left">Número</th>
								<th className="px-4 py-2 text-left">Cliente</th>
								<th className="px-4 py-2 text-left">Produto</th>
								<th className="px-4 py-2 text-left">Valor</th>
								<th className="px-4 py-2 text-left">Status</th>
								<th className="px-4 py-2 text-left">Data Pedido</th>
								<th className="px-4 py-2 text-left">Viagem</th>
								<th className="px-4 py-2 text-left">Destino</th>
							</tr>
						</thead>

						<tbody>
							{pedidosPaginados.map((pedido) => (
								<tr key={pedido.id} className="border-t hover:bg-gray-50">
									<td className="px-4 py-2 font-mono text-sm">
										{pedido.numeroPedido}
									</td>
									<td className="px-4 py-2">
										<div>
											<p className="font-medium">{pedido.cliente}</p>
											<p className="text-sm text-gray-600">
												{pedido.emailCliente}
											</p>
										</div>
									</td>
									<td className="px-4 py-2">{pedido.produto}</td>
									<td className="px-4 py-2 font-semibold">
										R$ {pedido.valor.toFixed(2)}
									</td>
									<td className="px-4 py-2">
										<span
											className={`px-2 py-1 text-xs rounded ${getStatusColor(
												pedido.status,
											)}`}
										>
											{pedido.status}
										</span>
									</td>
									<td className="px-4 py-2">{pedido.dataPedido}</td>
									<td className="px-4 py-2">{pedido.dataViagem}</td>
									<td className="px-4 py-2">{pedido.destino}</td>
								</tr>
							))}
						</tbody>

						{/* Paginação */}
						{totalPaginas > 1 && (
							<div className="flex justify-center items-center gap-2 mt-4">
								<button
									disabled={paginaAtual === 1}
									onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))}
									className="px-3 py-1 border rounded disabled:opacity-50"
								>
									<ChevronLeft></ChevronLeft>
								</button>

								{Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
									(pagina) => (
										<button
											key={pagina}
											onClick={() => setPaginaAtual(pagina)}
											className={`px-3 py-1 border rounded ${
												paginaAtual === pagina
													? "bg-blue-500 text-white"
													: "bg-white hover:bg-gray-100"
											}`}
										>
											{pagina}
										</button>
									),
								)}

								<button
									disabled={paginaAtual === totalPaginas}
									onClick={() =>
										setPaginaAtual((p) => Math.min(p + 1, totalPaginas))
									}
									className="px-3 py-1 border rounded disabled:opacity-50"
								>
									<ChevronRight></ChevronRight>
								</button>
							</div>
						)}
					</table>

					{pedidosFiltrados.length === 0 && (
						<div className="text-center py-8 text-gray-500">
							Nenhum pedido encontrado com os filtros aplicados.
						</div>
					)}
				</div>
			</div>

			{/* Resumo estatístico */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
				{["pago", "pendente", "cancelado", "reembolsado"].map((status) => {
					const count = pedidosFiltrados.filter((p) => p.status === status).length;
					const valor = pedidosFiltrados
						.filter((p) => p.status === status)
						.reduce((sum, p) => sum + p.valor, 0);

					return (
						<div key={status} className="bg-white p-4 rounded-lg shadow">
							<h3 className="text-sm font-medium text-gray-600 mb-2">
								{status.charAt(0).toUpperCase() + status.slice(1)}
							</h3>
							<p className="text-2xl font-bold">{count}</p>
							<p className="text-sm text-gray-600">R$ {valor.toFixed(2)}</p>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default PedidosPage;
