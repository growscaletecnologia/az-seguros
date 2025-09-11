"use client";

import {
	CheckCircle2,
	Clock3,
	CreditCard,
	Mail,
	Phone,
	Shield,
	ShieldCheck,
	User,
	Users,
} from "lucide-react";

type Traveler = { nome: string; documento: string };
type Order = {
	id: string;
	cliente: { nome: string; email: string; telefone: string };
	viagem: {
		origem: string;
		destino: string;
		embarque: string;
		desembarque: string;
	};
	produto: {
		seguradora: string;
		plano: string;
		coberturaMedicaUSD: number;
		bagagemUSD: number;
		cancelamentoUSD: number;
		covid: boolean;
	};
	viajantes: Traveler[];
	pagamento: {
		metodo: "Cartão de Crédito" | "Pix";
		parcelas?: number;
		status: "Aprovado" | "Processando";
	};
	preco: { subtotal: number; taxas: number; desconto: number; total: number };
};

const order: Order = {
	id: "AZ-102784",
	cliente: {
		nome: "José Pereira",
		email: "jose.pereira@email.com",
		telefone: "(11) 99999-0000",
	},
	viagem: {
		origem: "Brasil",
		destino: "Europa (Schengen)",
		embarque: "04/09/2025",
		desembarque: "20/09/2025",
	},
	produto: {
		seguradora: "Mutravel Assist",
		plano: "MTA 15 Brasil + Telemedicina Albert",
		coberturaMedicaUSD: 60000,
		bagagemUSD: 1200,
		cancelamentoUSD: 5000,
		covid: true,
	},
	viajantes: [
		{ nome: "José Pereira", documento: "CPF 123.456.789-00" },
		{ nome: "Ana Souza", documento: "CPF 987.654.321-00" },
	],
	pagamento: { metodo: "Cartão de Crédito", parcelas: 5, status: "Aprovado" },
	preco: { subtotal: 168.32, taxas: 6.41, desconto: 12.43, total: 162.3 },
};

function Money({ value }: { value: number }) {
	return <span>R$ {value.toFixed(2).replace(".", ",")}</span>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
	return <h3 className="text-sm font-semibold text-gray-900">{children}</h3>;
}

/** Header com logo “escudo” + nome da marca */
function BrandBar() {
	return (
		<div className="flex items-center justify-between px-6 py-4 border-b">
			<div className="flex items-center gap-2">
				<div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center">
					<Shield className="h-5 w-5 text-white" />
				</div>
				<span className="text-sm font-bold text-blue-800 tracking-tight">
					Seguro Viagem
				</span>
			</div>
			<span className="text-[11px] text-gray-500">Pedido #{order.id}</span>
		</div>
	);
}

/** Trilha de progresso (apenas esta área é verde) */
function ProgressRail({
	current = 3, // 1..3
}: {
	current?: 1 | 2 | 3;
}) {
	const steps = ["Pedido recebido", "Aguardando pagamento", "Apólice emitida"];
	return (
		<div className="px-6 pt-5">
			<div className="relative">
				{/* linha */}
				<div className="absolute top-1/2 left-0 right-0 h-1 bg-green-500/70 -translate-y-1/2 rounded" />
				<div className="relative z-10 grid grid-cols-3">
					{steps.map((label, i) => {
						const done = i + 1 <= current;
						return (
							<div key={label} className="flex flex-col items-center">
								<div
									className={`h-7 w-7 rounded-full grid place-items-center ring-2 ${
										done
											? "bg-green-500 text-white ring-green-600"
											: "bg-white text-green-600 ring-green-400"
									}`}
								>
									<CheckCircle2 className="h-5 w-5" />
								</div>
								<span className="mt-2 text-[11px] text-green-700 text-center leading-3">
									{label}
								</span>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

function EmailCard({
	title,
	subtitle,
	tone = "approved",
	ctaText,
	progressStep = 3,
	footerNote,
}: {
	title: string;
	subtitle: string;
	tone: "approved" | "processing";
	ctaText: string;
	progressStep?: 1 | 2 | 3;
	footerNote?: string;
}) {
	const isApproved = tone === "approved";
	// Predominantemente AZUL no restante do layout
	const headerBar = "bg-blue-700";
	const badgeClass = isApproved
		? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
		: "bg-blue-50 text-blue-700 ring-1 ring-blue-200";
	const Icon = isApproved ? CheckCircle2 : Clock3;
	const callToAction =
		"inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700";

	return (
		<div className="w-full max-w-[760px] rounded-xl border shadow-sm overflow-hidden bg-white">
			{/* Faixa superior azul */}
			<div className={`${headerBar} h-10 w-full`} />

			{/* Header de marca */}
			<BrandBar />

			{/* Progresso (verde) */}
			<ProgressRail current={progressStep} />

			<div className="px-6 pb-6">
				{/* Badge e título */}
				<div className="mt-4 mb-2">
					<span
						className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${badgeClass}`}
					>
						<Icon className="h-4 w-4" />
						{isApproved ? "Compra aprovada" : "Pedido em processamento"}
					</span>
				</div>

				<h2 className="text-xl font-bold text-gray-900 leading-6">{title}</h2>
				<p className="text-gray-600 mt-1">{subtitle}</p>

				{/* Destaque azul */}
				<div className="mt-4 rounded-lg p-4 bg-blue-50 ring-1 ring-blue-100">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
						<div className="text-sm text-gray-700">
							<p>
								Olá, <strong>{order.cliente.nome}</strong> — recebemos seu
								pedido para o plano <strong>{order.produto.plano}</strong> da{" "}
								<strong>{order.produto.seguradora}</strong>.
							</p>
							<p className="mt-1">
								Viagem de <strong>{order.viagem.embarque}</strong> a{" "}
								<strong>{order.viagem.desembarque}</strong> —{" "}
								<strong>{order.viagem.destino}</strong>.
							</p>
						</div>

						<button className={callToAction}>{ctaText}</button>
					</div>
				</div>

				{/* Resumo do plano */}
				<div className="mt-6 grid gap-4 sm:grid-cols-2">
					<div className="rounded-lg border p-4">
						<SectionTitle>Resumo do plano</SectionTitle>
						<dl className="mt-2 text-sm text-gray-700 space-y-1.5">
							<div className="flex justify-between">
								<dt>Seguradora</dt>
								<dd className="font-medium">{order.produto.seguradora}</dd>
							</div>
							<div className="flex justify-between">
								<dt>Plano</dt>
								<dd className="font-medium">{order.produto.plano}</dd>
							</div>
							<div className="flex justify-between">
								<dt>DMH</dt>
								<dd className="font-medium">
									USD {order.produto.coberturaMedicaUSD.toLocaleString()}
								</dd>
							</div>
							<div className="flex justify-between">
								<dt>Bagagem</dt>
								<dd className="font-medium">
									USD {order.produto.bagagemUSD.toLocaleString()}
								</dd>
							</div>
							<div className="flex justify-between">
								<dt>Cancelamento</dt>
								<dd className="font-medium">
									USD {order.produto.cancelamentoUSD.toLocaleString()}
								</dd>
							</div>
							<div className="flex justify-between">
								<dt>COVID-19</dt>
								<dd className="font-medium">
									{order.produto.covid ? "Incluído" : "Não incluso"}
								</dd>
							</div>
						</dl>
					</div>

					<div className="rounded-lg border p-4">
						<SectionTitle>Pagamento e preço</SectionTitle>
						<div className="mt-2 text-sm text-gray-700 space-y-1.5">
							<p className="flex items-center justify-between">
								<span className="flex items-center gap-2">
									<CreditCard className="h-4 w-4 text-gray-500" /> Método
								</span>
								<span className="font-medium">
									{order.pagamento.metodo}
									{order.pagamento.parcelas
										? ` • ${order.pagamento.parcelas}x`
										: ""}
								</span>
							</p>
							<div className="border-t my-2" />
							<p className="flex items-center justify-between">
								<span>Subtotal</span>{" "}
								<span className="font-medium">
									<Money value={order.preco.subtotal} />
								</span>
							</p>
							<p className="flex items-center justify-between">
								<span>Taxas</span>{" "}
								<span className="font-medium">
									<Money value={order.preco.taxas} />
								</span>
							</p>
							<p className="flex items-center justify-between">
								<span>Desconto</span>{" "}
								<span className="font-medium text-blue-700">
									- <Money value={order.preco.desconto} />
								</span>
							</p>
							<div className="border-t my-2" />
							<p className="flex items-center justify-between text-base">
								<span className="font-semibold">Total</span>{" "}
								<span className="font-extrabold text-blue-700">
									<Money value={order.preco.total} />
								</span>
							</p>
						</div>
					</div>
				</div>

				{/* Viajantes */}
				<div className="mt-6 rounded-lg border p-4">
					<SectionTitle>Viajantes</SectionTitle>
					<ul className="mt-2 divide-y text-sm">
						{order.viajantes.map((v, i) => (
							<li key={i} className="py-2 flex items-center justify-between">
								<span className="flex items-center gap-2 text-gray-800">
									{order.viajantes.length > 1 ? (
										<Users className="h-4 w-4 text-gray-500" />
									) : (
										<User className="h-4 w-4 text-gray-500" />
									)}
									{v.nome}
								</span>
								<span className="text-gray-500">{v.documento}</span>
							</li>
						))}
					</ul>
				</div>

				{/* Ajuda */}
				<div className="mt-6 grid gap-4 sm:grid-cols-2">
					<div className="rounded-lg border p-4">
						<SectionTitle>Como utilizar o seguro</SectionTitle>
						<p className="mt-2 text-sm text-gray-600">
							Em caso de necessidade, entre em contato com a central 24h
							informando o número do pedido <strong>{order.id}</strong>. O
							atendimento indica o prestador mais próximo.
						</p>
					</div>
					<div className="rounded-lg border p-4">
						<SectionTitle>Atendimento</SectionTitle>
						<div className="mt-2 text-sm text-gray-700 space-y-1.5">
							<p className="flex items-center gap-2">
								<Mail className="h-4 w-4 text-gray-500" /> {order.cliente.email}
							</p>
							<p className="flex items-center gap-2">
								<Phone className="h-4 w-4 text-gray-500" />{" "}
								{order.cliente.telefone}
							</p>
							<p className="flex items-center gap-2">
								<ShieldCheck className="h-4 w-4 text-gray-500" /> Cobertura
								válida durante todo o período da viagem.
							</p>
						</div>
					</div>
				</div>

				{footerNote ? (
					<p className="mt-6 text-[11px] text-gray-500">{footerNote}</p>
				) : null}
			</div>
		</div>
	);
}

export default function EmailShowcase() {
	return (
		<main className="min-h-screen w-full bg-white flex flex-col items-center justify-start py-10 gap-10">
			{/* COMPRA APROVADA */}
			<EmailCard
				tone="approved"
				title="Seu pedido foi aprovado, José!"
				subtitle="Seu pagamento foi confirmado e o seu voucher estará disponível em instantes."
				ctaText="Baixar voucher"
				progressStep={3}
				footerNote="Importante: consulte o Manual do Segurado e os canais 24h da seguradora. Guarde este e-mail."
			/>

			{/* PEDIDO EM PROCESSAMENTO */}
			<EmailCard
				tone="processing"
				title="Seu pedido está em processamento"
				subtitle="Estamos validando seu pagamento e gerando o seu voucher. Você receberá outro e-mail quando tudo estiver pronto."
				ctaText="Acompanhar status"
				progressStep={2}
				footerNote="Se o pagamento não for confirmado em até 30 minutos, o pedido será automaticamente cancelado."
			/>
		</main>
	);
}
