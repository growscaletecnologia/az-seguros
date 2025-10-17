"use client";

import { useCheckout } from "@/stores/checkout-store";
import {
	MapPin,
	Calendar,
	Users,
	User,
	CheckCircle,
	Tag,
	Shield,
	Lock,
	Building,
	CreditCard,
	Smartphone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { couponsService } from "@/services/api/coupons";
import { PlanCoverageViewer } from "@/components/planos/PlanCoverageViewer";
import { DESTINIES } from "@/types/destination";


export default function CheckoutPage() {
	const router = useRouter();
	const { plan, form } = useCheckout();
	console.log("FORM", form)

	const [segurados, setSegurados] = useState([
		{ nome: "", nascimento: "", cpf: "", age: 0, type: "age" },
	]);
	const [paymentMethod, setPaymentMethod] = useState("pix");
	const [couponCode, setCouponCode] = useState("");
	const [couponApplied, setCouponApplied] = useState(false);
	const [couponLoading, setCouponLoading] = useState(false);
	const [couponError, setCouponError] = useState("");
	const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const [responsavel, setResponsavel] = useState({ 
	nome: "",
	cpf: "",
	
	email: "",
    telefone: "",
	cep: "",         // Onde o usuário digita
    rua: "",
    numero: "",      // Este o usuário deve preencher após a busca
    complemento: "", // Opcional, usuário preenche
    bairro: "",
    cidade: "",
    uf: "",
	});
	const [cepLoading, setCepLoading] = useState(false);
	const [cepError, setCepError] = useState("");
	const [cpfError, setCpfError] = useState("");
	const [viewPlan , setViewPlan] = useState(false);
	const [initialCouponVerified, setInitialCouponVerified] = useState(false);
	const [seguradoErrors, setSeguradoErrors] = useState<
        { nascimento?: string; cpf?: string }[]
    >([{}]);
	useEffect(() => {
		if (!plan || !form) {
			toast.error("Nenhum plano selecionado.");
			router.replace("/planos");
		}
	}, [plan, form, router]);

	
	useEffect(() => {
		// Se o cupom inicial JÁ foi verificado/processado, SAIA.
		if (initialCouponVerified) {
			return; 
		}
		
		// Se há um cupom no formulário, inicie a verificação.
		if (form?.coupon) {
			// Chamada direta da lógica de verificação
			verifyCoupom().finally(() => {
				// Marca como verificado após a tentativa (sucesso ou falha)
				setInitialCouponVerified(true);
			});
		} else {
			// Se não houver cupom no form, marca como verificado para não rodar mais.
			setInitialCouponVerified(true); 
		}
		
	// Dependências ajustadas: apenas o form.coupon (pois initialCouponVerified gerencia o ciclo)
	}, [form?.coupon, initialCouponVerified]); 

	// Ajuste a função verifyCoupom para não ter o finally de setInitialCouponVerified
	async function verifyCoupom() {
		// 1. O cupom só será verificado se existir em 'form'.
		if (!form?.coupon) return; 

		setCouponLoading(true);
		setCouponError("");

		try {
			const couponData = await couponsService.getByCode(form.coupon); 
			
			setAppliedCoupon(couponData); 
			setCouponCode(form.coupon); 
			setCouponApplied(true);
		} catch (error: any) {
			const errorMessage = error?.response?.data?.message || "Cupom inválido ou expirado.";
			setCouponError(errorMessage);
			setAppliedCoupon(null);
			setCouponApplied(false);
		} finally {
			setCouponLoading(false);
			// REMOVA: setInitialCouponVerified(true); para evitar conflitos com o useEffect
		}
	}
	const calculateAge = (birthDate: string) => {
		if (!birthDate) return 0;
		const birth = new Date(birthDate);
		const today = new Date();
		let age = today.getFullYear() - birth.getFullYear();
		const monthDiff = today.getMonth() - birth.getMonth();
		if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
		return age;
	};

	const addSegurado = () =>{
		setSegurados([...segurados, { nome: "", nascimento: "", cpf: "", age: 0, type: "age" }]);
		setSeguradoErrors([...seguradoErrors, {}]);
	}
		

	const updateSegurado = (index: number, field: string, value: string) => {
        const novosSegurados = [...segurados];
        const novosErros = [...seguradoErrors];
        
        // 1. Atualiza o valor
        (novosSegurados[index] as any)[field] = value;
        
        // 2. Realiza a validação (Data e CPF)
        if (field === "nascimento") {
            // Validações de data
            const dateError = isBirthDateValid(value);
            novosErros[index].nascimento = dateError || undefined;

            // Se a data for válida, calcula a idade
            if (!dateError) {
                const idade = calculateAge(value);
                (novosSegurados[index] as any).age = idade;
            } else {
                (novosSegurados[index] as any).age = 0; // Zera a idade se a data for inválida
            }
        }
        
        if (field === "cpf") {
            // Validação de CPF (se não estiver vazio)
            if (value && !isValidCPF(value)) {
                novosErros[index].cpf = "CPF inválido.";
            } else {
                novosErros[index].cpf = undefined;
            }
        }

        setSegurados(novosSegurados);
        setSeguradoErrors(novosErros); // Atualiza o estado de erros
    };

	const removeSegurado = (index: number) => {
        setSegurados(segurados.filter((_, i) => i !== index));
        setSeguradoErrors(seguradoErrors.filter((_, i) => i !== index)); // Remove o objeto de erro
    }
	const classifyPassenger = (age: number) => {
		if (age <= 20) return "1 Criança até 20 anos";
		if (age <= 64) return "1 Adulto até 64 anos";
		return "1 Adulto maior de 64 anos";
	};

	const getPriceByAge = (age: number) => {
		if (!plan) return 0;
		const group = plan.ageGroups.find(
			(g: any) => age >= g.start && age <= g.end,
		);
		return group ? group.totalGroupValue : plan.totalPrice;
	};


	const calculateTotals = useMemo(() => {
		let subtotal = 0;
		for (const s of segurados) {
			subtotal += getPriceByAge(s.age);
		}

		const pixDiscount = paymentMethod === "pix" ? subtotal * 0.05 : 0;
		

		let couponDiscount = 0;
		
		if (appliedCoupon) { 
			const { discount, discountType } = appliedCoupon;
			
			if (discountType === "PERCENTAGE") {
				couponDiscount = subtotal * (discount / 100);
			} else if (discountType === "FIXED") {
				couponDiscount = discount;
			}
		}
	

		const totalAfterDiscounts = subtotal - pixDiscount - couponDiscount;

		return {
			subtotal,
			pixDiscount,
			couponDiscount, // Inclua o novo desconto aqui
			total: Math.max(0, totalAfterDiscounts), // Garante que o total nunca seja negativo
		};
	}, [segurados, paymentMethod, plan, appliedCoupon]); // Adicionar appliedCoupon
		
	const applyCoupon = async () => {
			if (!couponCode) return; // Se não houver código, não faz nada
			if (couponApplied) return; // Se já tem cupom aplicado (pode acontecer se o usuário clicar antes de remover)
			
			setCouponLoading(true);
			setCouponError("");

			try {
				// Chama o serviço com o código digitado no input
				const coupon = await couponsService.getByCode(couponCode);
				
				setAppliedCoupon(coupon); // Salva o objeto do cupom (com code, discount, discountType, description, etc.)
				setCouponApplied(true);
				toast.success("Cupom aplicado com sucesso!");
			} catch (error: any) {
				// Captura o erro detalhado do backend (400 ou 404)
				const errorMessage = error?.response?.data?.message || "Cupom inválido, expirado ou atingiu o limite de uso.";
				setCouponError(errorMessage);
				setAppliedCoupon(null);
				setCouponApplied(false);
			} finally {
				setCouponLoading(false);
			}
	};
	const handlePayment = async () => {
           
        if (paymentMethod === "pix" || paymentMethod === "credit") {
            if (!responsavel.nome.trim()) {
                toast.error("O nome do responsável pelo pagamento é obrigatório.");
                setIsProcessing(false);
                return;
            }
            if (!isValidCPF(responsavel.cpf)) {
                 toast.error("O CPF do responsável pelo pagamento é inválido.");
                 setCpfError("CPF inválido."); 
                 setIsProcessing(false);
                 return;
            }
        }
        
        setCpfError(""); 
        setIsProcessing(true);
        
    };

	if (!plan || !form) return null;

	const formatDate = (date: string) => {
		try {
			return format(parseISO(date), "EEE, dd MMM yyyy", { locale: ptBR });
		} catch {
			return date;
		}
	};
	const removeCoupon = () => {
			setCouponApplied(false);
			setAppliedCoupon(null);
			setCouponCode(""); // Limpa o código do input
			setCouponError(""); // Limpa qualquer erro anterior
			toast.info("Cupom removido.");
	};

	const handleCepSearch = async (cepValue: string) => {
        // 1. Limpa o CEP para apenas dígitos
        const cleanedCep = cepValue.replace(/\D/g, ''); 

        // 2. Valida se o CEP tem 8 dígitos
        if (cleanedCep.length !== 8) {
            setCepError(""); // Limpa erro se o formato estiver incompleto
            return;
        }

        setCepLoading(true);
        setCepError("");

        try {
            // A ViaCEP retorna JSON e usa o CEP puro na URL
            const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
            const data = await response.json();

            if (data.erro) {
                // Se a API retornar um erro (CEP não encontrado)
                setCepError("CEP não encontrado ou inválido.");
                // Limpa os campos de endereço que seriam preenchidos
                setResponsavel((prev) => ({
                    ...prev,
                    rua: "",
                    bairro: "",
                    cidade: "",
                    uf: "",
                }));
            } else {
                // Se o CEP for encontrado, atualiza o estado com os dados
                setResponsavel((prev) => ({
                    ...prev,
                    rua: data.logradouro,
                    bairro: data.bairro,
                    cidade: data.localidade,
                    uf: data.uf,
                    // O campo 'numero' deve ficar vazio para o usuário preencher
                    numero: "", 
                }));
                setCepError("");
                // Opcional: Tenta focar no campo número para o usuário continuar
                document.getElementById('numero')?.focus();
            }
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
            setCepError("Falha na comunicação com o serviço de CEP.");
        } finally {
            setCepLoading(false);
        }
    };
	function isValidCPF(cpf: string): boolean {
		cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos

		if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false; // Verifica tamanho e sequências repetidas

		let sum = 0;
		let remainder;

		// Validação do 1º dígito
		for (let i = 1; i <= 9; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
		remainder = (sum * 10) % 11;

		if (remainder === 10 || remainder === 11) remainder = 0;
		if (remainder !== parseInt(cpf.substring(9, 10))) return false;

		sum = 0;
		
		// Validação do 2º dígito
		for (let i = 1; i <= 10; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
		remainder = (sum * 10) % 11;

		if (remainder === 10 || remainder === 11) remainder = 0;
		if (remainder !== parseInt(cpf.substring(10, 11))) return false;

		return true;
	}

	// FUNÇÃO DE VALIDAÇÃO DE DATA (PODE FICAR NO COMPONENTE, mas é melhor externa)
	function isBirthDateValid(birthDate: string): string | null {
		if (!birthDate) return "A data de nascimento é obrigatória.";

		const birth = new Date(birthDate);
		const today = new Date();
		const minDate = new Date('1900-01-01');

		// Validação 1: Data futura
		if (birth > today) {
			return "A data de nascimento não pode ser futura.";
		}

		// Validação 2: Data anterior a 1900
		if (birth < minDate) {
			return "A data de nascimento mínima é 01/01/1900.";
		}

		// Se passou, está válido
		return null; 
	}
	return (
		<div className="bg-gray-50 min-h-screen py-6">
			<div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
				{/* COLUNA PRINCIPAL */}
				<div className="lg:col-span-2 space-y-6">
					{/* Identificação */}
					<div className="bg-white rounded-md shadow-sm border p-5">
						<h3 className="font-semibold text-gray-800 mb-3">
							Identificação dos Segurados
						</h3>
						{segurados.map((s, i) => (
							<div key={i} className="grid md:grid-cols-3 gap-2 mb-3 items-end">
								<input
									type="text"
									placeholder="Nome completo"
									value={s.nome}
									onChange={(e) => updateSegurado(i, "nome", e.target.value)}
									className="border rounded-md px-3 py-2"
								/>
								<div>
									<input
										type="date"
										value={s.nascimento}
										onChange={(e) => updateSegurado(i, "nascimento", e.target.value)}
										className={`border rounded-md px-3 py-2 w-full ${
											seguradoErrors[i]?.nascimento ? 'border-red-500' : 'border-gray-300'
										}`}
									/>
									{seguradoErrors[i]?.nascimento && (
										<p className="text-xs text-red-600 mt-1">{seguradoErrors[i].nascimento}</p>
									)}
								</div>
								<div className="flex gap-2">
								<div className="flex-1">
									<input
										type="text"
										placeholder="CPF"
										value={s.cpf}
										onChange={(e) => updateSegurado(i, "cpf", e.target.value)}
										className={`border rounded-md px-3 py-2 w-full ${
											seguradoErrors[i]?.cpf ? 'border-red-500' : 'border-gray-300'
										}`}
									/>
									{seguradoErrors[i]?.cpf && (
										<p className="text-xs text-red-600 mt-1">{seguradoErrors[i].cpf}</p>
									)}
								</div>
								{/* Botão de remover (mantido) */}
								{segurados.length > 1 && (
									<button
										onClick={() => removeSegurado(i)}
										// Usando a estilização solicitada
										className="mt-2 size-6 flex items-center justify-center text-red-600 text-sm border border-red-600 rounded-full font-medium p-1 transition-colors hover:bg-red-50" 
										title="Remover segurado"
									>
										–
									</button>
								)}
							</div>
								
							</div>
						))}
						<button
							onClick={addSegurado}
							className="w-full mt-2 border-2 border-dashed border-blue-400 text-blue-600 py-2 rounded-lg font-medium flex justify-center items-center hover:bg-blue-50"
						>
							+ Adicionar segurado
						</button>
					</div>

					
					 {/* ======= FORMA DE PAGAMENTO ======= */}
					{/* ======= FORMA DE PAGAMENTO ======= */}
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
								<p className="text-sm text-gray-600">Pagamento instantâneo</p>
							</div>
							</div>
							<div className="text-right">
							<p className="text-green-600 font-medium">5% de desconto</p>
							<p className="text-sm text-gray-600">
								R$ {(calculateTotals.subtotal * 0.05).toFixed(2)} de economia
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
								<p className="font-medium text-gray-900">Cartão de Crédito</p>
								<p className="text-sm text-gray-600">Parcelamento em até 12x</p>
							</div>
							</div>
							<div className="text-right">
							<p className="text-blue-600 font-medium">Até 12x sem juros</p>
							<p className="text-sm text-gray-600">
								R$ {(calculateTotals.total / 12).toFixed(2)}/mês
							</p>
							</div>
						</div>
						</label>
					</div>

					{/* ======= CAMPOS DE PIX OU CRÉDITO ======= */}
					<div className="mt-6 space-y-4">
						{/* SE PIX: aviso + nome + cpf */}
						{paymentMethod === "pix" && (
						<>
							<div className="bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm rounded-md p-3 flex items-start">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 mr-2 text-yellow-500 flex-shrink-0 mt-0.5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 9v2m0 4h.01M4.93 4.93a10.97 10.97 0 0114.14 0m-14.14 0a10.97 10.97 0 000 14.14m14.14-14.14a10.97 10.97 0 010 14.14M12 19.07a7.07 7.07 0 100-14.14 7.07 7.07 0 000 14.14z"
								/>
							</svg>
							<p>
								Lembrando que seu pagamento deverá ser realizado em até{" "}
								<strong>20 minutos</strong> após finalizar a compra.
							</p>
							</div>

							{/* Nome e CPF PIX */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
								Nome completo
								</label>
								<input
								type="text"
								placeholder="Nome completo"
								value={responsavel.nome}
								onChange={(e) =>
									setResponsavel({ ...responsavel, nome: e.target.value })
								}
								className="input-base border-2 rounded-lg p-3"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
								CPF
								</label>
								<input
								type="text"
								placeholder="000.000.000-00"
								value={responsavel.cpf}
								onChange={(e) => {
									const val = e.target.value;
									setResponsavel({ ...responsavel, cpf: val });
									
									if (val && !isValidCPF(val)) {
										setCpfError("CPF inválido.");
									} else {
										setCpfError("");
									}
								}}
								className={`input-base border-2 rounded-lg p-3 ${
									cpfError ? "border-red-500 focus:ring-red-500" : ""
								}`}
								/>
								{cpfError && (
								<p className="text-xs text-red-600 mt-1">{cpfError}</p>
								)}
							</div>
							</div>

							{/* Copiar dados */}
							<button
								type="button"
								onClick={() => {
									const firstSegurado = segurados[0];
									if (!firstSegurado) return;

									
									if (firstSegurado.age > 0 && firstSegurado.age < 18) {
										toast.error("Não é possível usar dados de um menor como responsável legal.");
										return;
									}

									
									setResponsavel(prev => ({
										...prev, 
										nome: firstSegurado.nome,
										cpf: firstSegurado.cpf,
									}));
								}}
								className="mt-2 text-sm text-blue-700 hover:underline"
							>
								Copiar dados do primeiro segurado
							</button>
						</>
						)}

						{/* SE CARTÃO DE CRÉDITO */}
						{paymentMethod === "credit" && (
						<>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
								Número do Cartão
								</label>
								<input
								type="text"
								placeholder="1234 5678 9012 3456"
								className="input-base border-2 rounded-lg p-3"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
								Nome no Cartão
								</label>
								<input
								type="text"
								placeholder="Nome como no cartão"
								className="input-base border-2 rounded-lg p-3"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
								Validade
								</label>
								<input type="text" placeholder="MM/AA" className="input-base border-2 rounded-lg p-3" />
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
								CVV
								</label>
								<input type="text" placeholder="123" className="input-base border-2 rounded-lg p-3" />
							</div>
							</div>

							<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Parcelas
							</label>
							<select className="input-base border-2 rounded-lg p-3">
								{[1, 2, 3, 6, 12].map((n) => (
								<option key={n}>
									{n}x de R$ {(calculateTotals.total / n).toFixed(2)} sem juros
								</option>
								))}
							</select>
							</div>

							{/* responsável (cópia funcional) */}
							<div className="mt-4">
							<h4 className="text-sm font-semibold text-gray-800 mb-2">
								Responsável pelo pagamento
							</h4>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<input
								type="text"
								placeholder="Nome completo"
								value={responsavel.nome}
								onChange={(e) =>
									setResponsavel({ ...responsavel, nome: e.target.value })
								}
								className="input-base border-2 rounded-lg p-3"
								/>
								<input
								type="text"
								placeholder="000.000.000-00"
								value={responsavel.cpf}
								onChange={(e) => {
										const val = e.target.value;
										setResponsavel({ ...responsavel, cpf: val });
										// Validação imediata:
										if (val && !isValidCPF(val)) {
											setCpfError("CPF inválido.");
										} else {
											setCpfError("");
										}
									}}
								/>
							</div>
							{cpfError && (
								<p className="text-xs text-red-600 mt-1">{cpfError}</p>
							)}

							<button
								type="button"
								onClick={() => {
									const firstSegurado = segurados[0];
									if (!firstSegurado) return;

									
									if (firstSegurado.age > 0 && firstSegurado.age < 18) {
										toast.error("Não é possível usar dados de um menor como responsável legal.");
										return;
									}

									setResponsavel(prev => ({
										...prev,
										nome: firstSegurado.nome,
										cpf: firstSegurado.cpf,
									}));
								}}
								className="mt-2 text-sm text-blue-700 hover:underline"
							>
								Copiar dados do primeiro segurado
							</button>
							</div>
						</>
						)}
					</div>
					</div>

					{/* ======= ENDEREÇO ======= */}
					{/* <div className="bg-white rounded-lg shadow-sm p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
							<Building className="h-5 w-5 mr-2 text-blue-600" />
							Endereço de Cobrança
						</h3>
						
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<input type="text" placeholder="Contato" className="input-base border-2 rounded-lg p-3 " />
						<input type="email" placeholder="Email" className="input-base border-2 rounded-lg p-3" />
						<input type="text" placeholder="Telefone" className="input-base border-2 rounded-lg p-3" />
						</div>

						<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
						<input type="text" placeholder="CEP" className="input-base border-2 rounded-lg p-3" />
						<input
							type="text"
							placeholder="Endereço"
							className="input-base border-2 rounded-lg p-3 md:col-span-2"
						/>
						<input type="text" placeholder="Número" className="input-base border-2 rounded-lg p-3" />
						<input type="text" placeholder="Complemento" className="input-base border-2 rounded-lg p-3" />
						<input type="text" placeholder="Bairro" className="input-base border-2 rounded-lg p-3" />
						<input type="text" placeholder="Cidade" className="input-base border-2 rounded-lg p-3" />
						<select className="input-base border-2 rounded-lg p-3 text-gray-700" defaultValue="">
							<option value="" disabled>Estado</option>
							{[
							"AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
							].map((uf) => (
							<option key={uf}>{uf}</option>
							))}
						</select>
						</div>
					</div> */}
					{/* ======= ENDEREÇO DE COBRANÇA (Novo Bloco) ======= */}
					<div className="bg-white rounded-lg shadow-sm p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
							<Building className="h-5 w-5 mr-2 text-blue-600" />
							Endereço de Cobrança
						</h3>
						
						{/* Contato, Email, Telefone */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<input
								type="text"
								placeholder="Contato (Nome para contato)"
								value={responsavel.nome}
								onChange={(e) => setResponsavel({ ...responsavel, nome: e.target.value })}
								className="input-base border-2 rounded-lg p-3" 
							/>
							<input
								type="email"
								placeholder="Email"
								value={responsavel.email}
								onChange={(e) => setResponsavel({ ...responsavel, email: e.target.value })}
								className="input-base border-2 rounded-lg p-3"
							/>
							<input
								type="text"
								placeholder="Telefone"
								value={responsavel.telefone}
								onChange={(e) => setResponsavel({ ...responsavel, telefone: e.target.value })}
								className="input-base border-2 rounded-lg p-3"
							/>
						</div>

						{/* CEP e Endereço */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
							
								{/* 1. INPUT CEP COM BUSCA */}
								<div className="md:col-span-1">
									<input
										type="text"
										placeholder="CEP"
										value={responsavel.cep}
										onChange={(e) => {
											// Mantém apenas dígitos no estado
											const val = e.target.value.replace(/\D/g, ''); 
											setResponsavel({ ...responsavel, cep: val });
											setCepError("");
										}}
										onBlur={(e) => handleCepSearch(e.target.value)}
										maxLength={8}
										disabled={cepLoading}
										className={`input-base border-2 rounded-lg p-3 ${
											cepError ? 'border-red-500' : 'border-gray-300'
										}`}
									/>
									{cepLoading && <p className="text-xs text-blue-600 mt-1">Buscando...</p>}
									{cepError && <p className="text-xs text-red-600 mt-1">{cepError}</p>}
								</div>

								{/* 2. INPUT RUA/LOGRADOURO */}
								<div className="md:col-span-2">
									<input
										type="text"
										placeholder="Endereço (Rua/Avenida)"
										value={responsavel.rua}
										onChange={(e) => setResponsavel({ ...responsavel, rua: e.target.value })}
										disabled={cepLoading || responsavel.rua.length > 0} // Desabilitado se preenchido
										className="input-base border-2 rounded-lg p-3 md:col-span-2  bg-gray-50"
									/>
								</div>

							{/* 3. INPUT NÚMERO */}
							<input
								id="numero"
								type="text"
								placeholder="Número"
								value={responsavel.numero}
								onChange={(e) => setResponsavel({ ...responsavel, numero: e.target.value })}
								className="input-base border-2 rounded-lg p-3"
							/>

							{/* 4. INPUT COMPLEMENTO */}
							<input
								type="text"
								placeholder="Complemento (Ex: Apt 101)"
								value={responsavel.complemento}
								onChange={(e) => setResponsavel({ ...responsavel, complemento: e.target.value })}
								className="input-base border-2 rounded-lg p-3"
							/>

							{/* 5. INPUT BAIRRO */}
							<input
								type="text"
								placeholder="Bairro"
								value={responsavel.bairro}
								onChange={(e) => setResponsavel({ ...responsavel, bairro: e.target.value })}
								disabled={cepLoading || responsavel.bairro.length > 0}
								className="input-base border-2 rounded-lg p-3 bg-gray-50"
							/>

							{/* 6. INPUT CIDADE */}
							<input
								type="text"
								placeholder="Cidade"
								value={responsavel.cidade}
								disabled={true} // Forçado desabilitado
								className="input-base border-2 rounded-lg p-3 bg-gray-50"
							/>
							
							{/* 7. INPUT UF/ESTADO */}
							<select 
								value={responsavel.uf}
								onChange={(e) => setResponsavel({ ...responsavel, uf: e.target.value })}
								disabled={true} // Forçado desabilitado
								className="input-base border-2 rounded-lg p-3 text-gray-700 bg-gray-50"
							>
								<option value="" disabled>Estado</option>
								{[
								"AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
								].map((uf) => (
								<option key={uf}>{uf}</option>
								))}
							</select>
						</div>
					</div>
				</div>

				{/* COLUNA DIREITA */}
				<div className="space-y-4 sticky top-4">
					{/* Resumo da compra */}
					<div className="bg-white rounded-md border shadow-sm p-5">
						<h4 className="font-semibold mb-3 text-gray-800">Resumo da compra</h4>
						{segurados.map((s, i) => (
							<div
								key={i}
								className="flex justify-between text-sm text-gray-700 border-b last:border-0 py-1"
							>
								<span>
									
									{s.age ? classifyPassenger(s.age) : "idade não informada"}
								</span>
								<span>
									R$
									{getPriceByAge(s.age).toLocaleString("pt-BR", {
										minimumFractionDigits: 2,
									})}
								</span>
							</div>
						))}

						<div className="mt-3 border-t pt-2 text-sm">
							<div className="flex justify-between">
								<span>Subtotal</span>
								<span>
									R$
									{calculateTotals.subtotal.toLocaleString("pt-BR", {
										minimumFractionDigits: 2,
									})}
								</span>
							</div>
							{paymentMethod === "pix" && (
								<div className="flex justify-between text-green-600">
									<span>Desconto Pix</span>
									<span>
										- R$
										{calculateTotals.pixDiscount.toLocaleString("pt-BR", {
											minimumFractionDigits: 2,
										})}
									</span>
								</div>
							)}
							{calculateTotals.couponDiscount > 0 && (
								<div className="flex justify-between text-blue-600">
									<span className="font-medium">Cupom aplicado</span>
									<span className="font-medium">
										- R$
										{calculateTotals.couponDiscount.toLocaleString("pt-BR", {
											minimumFractionDigits: 2,
										})}
									</span>
								</div>
							)}
							<div className="flex justify-between font-semibold mt-2">
								<span>Total</span>
								<span>
									R$
									{calculateTotals.total.toLocaleString("pt-BR", {
										minimumFractionDigits: 2,
									})}
								</span>
							</div>
						</div>
					</div>

					{/* Cupom */}
				<div className="rounded-md bg-white border border-gray-200 p-4">
					{appliedCoupon ? (
						// === MODO: CUPOM APLICADO (IMAGEM) ===
						<div className="space-y-3">
							<h4 className="font-semibold text-lg text-gray-800">Cupom aplicado</h4>
							<div className="border-t border-gray-200 pt-3">
								<p className="text-base font-bold text-gray-900 mb-1">
									{appliedCoupon.code}
								</p>
								<p className="text-sm text-gray-700">
									{/* Exibe a descrição se disponível, ou uma descrição padrão */}
									{appliedCoupon.description || 
									(appliedCoupon.discountType === "PERCENTAGE" 
										? `${appliedCoupon.discount}% OFF no seu seguro viagem`
										: `R$ ${appliedCoupon.discount.toFixed(2)} OFF`)
									}
								</p>
							</div>
							<button
								onClick={removeCoupon}
								className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline pt-2 block"
							>
								Trocar cupom
							</button>
						</div>
					) : (
						// === MODO: INPUT PARA APLICAR CUPOM ===
						<>
							<h4 className="font-semibold text-lg text-gray-800 mb-3">Cupom de desconto</h4>
							<div className="flex gap-2">
								<input
									type="text"
									placeholder="Preencha o cupom"
									value={couponCode}
									onChange={(e) => setCouponCode(e.target.value.toUpperCase())} // Capitaliza para facilitar
									className="flex-1 rounded-md p-0.5 border border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
								/>
								<button
									onClick={applyCoupon}
									disabled={couponLoading || !couponCode}
									className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50"
								>
									{couponLoading ? "Aplicando..." : "Aplicar"}
								</button>
							</div>
							{couponError && <p className="text-sm text-red-600 mt-2">{couponError}</p>}
						</>
					)}
				</div>

					{/* Card do plano */}
					<div className="bg-white rounded-md border shadow-sm p-5 text-sm">
						<p className="text-gray-700 font-medium mb-1">
							
							Viajando para {form.destination ? DESTINIES.filter((d)=>d.id === Number(form.destination))[0].name : ""}
						</p>
						<p className="text-gray-500 mb-2">
							{formatDate(form.departure)} - {formatDate(form.arrival)}
						</p>
						<img
							src={
								plan.provider_code === "hero"
									? "/seguradoras/hero.png"
									: "/seguradoras/my-travel-assist.png"
							}
							alt={plan.provider_name}
							className="w-32 mb-2"
						/>
						<div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md inline-block mb-2">
							Melhor custo benefício
						</div>
						<p className="font-semibold text-gray-800">{plan.name}</p>
						<p className="text-xs text-gray-600 mb-2">
							Faixa etária: {plan.ageGroups[0].start} a {plan?.ageGroups.at(-1)?.end} anos
						</p>
						
						<button 
							onClick={() => setViewPlan(!viewPlan)}
							className="text-green-700 font-medium block mb-1 hover:underline">
							Cobertura completa
						</button>
						<a
							href={plan?.provider_terms_url || ""}
							target="_blank"
							className="text-[#40368E] font-medium hover:underline"
						>
							Informações e Regras do Plano
						</a>
					</div>

					{/* Botão de compra */}
					<button
						onClick={handlePayment}
						disabled={isProcessing}
						className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50"
					>
						{isProcessing ? "Processando..." : "Efetuar Compra"}
					</button>
					<p className="text-[11px] text-gray-500 mt-2 text-center">
						Ao clicar em “Efetuar Compra” você concorda com os{" "}
						<span className="underline">Termos de Uso</span>,{" "}
						<span className="underline">Condições Gerais do Seguro</span> e{" "}
						<span className="underline">Cobertura do Produto</span>.
					</p>
				</div>
			</div>
											{viewPlan && (
												<PlanCoverageViewer
													planId={plan.code || 0}
													destination={form.destination ?? ""}
													departure={form.departure}
													arrival={form.arrival}
													onClose={() => setViewPlan(false	)}				
											/>
											)}
		</div>
	);
}
