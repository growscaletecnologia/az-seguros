"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, PlusCircle, Trash2, BarChart3, FileText } from "lucide-react";
import AuthService from "@/lib/services/auth-service";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { couponsService } from "@/services/api/coupons";
import { Coupon, CouponUsage, UpdateCouponDto } from "@/types/coupons";

const CuponsPage = () => {
	const [cupons, setCupons] = useState<Coupon[]>([]);
	const [loading, setLoading] = useState(true);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
	const [activeTab, setActiveTab] = useState("gerenciar");
	const [couponUsages, setCouponUsages] = useState<CouponUsage[]>([]);
	const [loadingUsages, setLoadingUsages] = useState(false);
	const [selectedCouponForReport, setSelectedCouponForReport] = useState<string>("");
	
	const [novoCupom, setNovoCupom] = useState({
		code: "",
		discount: 0,
		discountType: "PERCENTAGE",
		expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 dias a partir de hoje
		usageLimit: 100,
		front_publishable: false,
		description: "",
		userId: AuthService.getUser()?.id,
	});

	// Carregar cupons ao iniciar
	useEffect(() => {
		loadCoupons();
	}, []);

	const loadCoupons = async () => {
		try {
			setLoading(true);
			const data = await couponsService.getAll();
			setCupons(data);
		} catch (error) {
			toast.error("Erro ao carregar cupons");
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const criarCupom = async () => {
		try {
			setLoading(true);
			await couponsService.create(novoCupom);
			toast.success("Cupom criado com sucesso!");
			setDialogOpen(false);
			resetForm();
			loadCoupons();
		} catch (error) {
			toast.error("Erro ao criar cupom");
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const atualizarCupom = async () => {
		if (!editingCoupon) return;
		
		try {
			setLoading(true);
			const updateData: UpdateCouponDto = {
				code: novoCupom.code,
				discount: novoCupom.discount,
				discountType: novoCupom.discountType,
				expiresAt: novoCupom.expiresAt,
				usageLimit: novoCupom.usageLimit,
				front_publishable: novoCupom.front_publishable,
				description: novoCupom.description,
			};
			
			await couponsService.update(editingCoupon.id, updateData);
			toast.success("Cupom atualizado com sucesso!");
			setDialogOpen(false);
			resetForm();
			loadCoupons();
		} catch (error) {
			toast.error("Erro ao atualizar cupom");
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const toggleCupomStatus = async (cupom: Coupon) => {
		try {
			setLoading(true);
			const newStatus = cupom.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
			await couponsService.update(cupom.id, { status: newStatus });
			toast.success(`Cupom ${newStatus === 'ACTIVE' ? 'ativado' : 'desativado'} com sucesso!`);
			loadCoupons();
		} catch (error) {
			toast.error("Erro ao alterar status do cupom");
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const excluirCupom = async (id: string) => {
		if (confirm("Tem certeza que deseja excluir este cupom?")) {
			try {
				setLoading(true);
				await couponsService.remove(id);
				toast.success("Cupom excluído com sucesso!");
				loadCoupons();
			} catch (error) {
				toast.error("Erro ao excluir cupom");
				console.error(error);
			} finally {
				setLoading(false);
			}
		}
	};
	
	const resetForm = () => {
		setNovoCupom({
			code: "",
			discount: 0,
			discountType: "PERCENTAGE",
			expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
			usageLimit: 100,
			front_publishable: false,
			description: "",
			userId: AuthService.getUser()?.id,
		});
		setEditingCoupon(null);
	};
	
	const editarCupom = (cupom: Coupon) => {
		setEditingCoupon(cupom);
		setNovoCupom({
			code: cupom.code,
			discount: cupom.discount,
			discountType: cupom.discountType,
			expiresAt: new Date(cupom.expiresAt).toISOString().split('T')[0],
			usageLimit: cupom.usageLimit,
			front_publishable: cupom.front_publishable,
			description: cupom.description || "",
		});
		setDialogOpen(true);
	};
	
	// Carregar relatório de uso de um cupom específico
	const loadCouponUsageReport = async (couponId: string) => {
		if (!couponId) return;
		
		try {
			setLoadingUsages(true);
			const coupon = await couponsService.getById(couponId);
			if (coupon && coupon.usages) {
				setCouponUsages(coupon.usages);
			} else {
				setCouponUsages([]);
			}
		} catch (error) {
			toast.error("Erro ao carregar relatório de uso do cupom");
			console.error(error);
		} finally {
			setLoadingUsages(false);
		}
	};

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Gerenciamento de Cupons</h1>
				
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger asChild>
						<Button 
							onClick={() => {
								resetForm();
								setDialogOpen(true);
							}}
							className="flex items-center gap-2"
						>
							<PlusCircle className="h-4 w-4" />
							Novo Cupom
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[600px]">
						<DialogHeader>
							<DialogTitle>
								{editingCoupon ? "Editar Cupom" : "Criar Novo Cupom"}
							</DialogTitle>
						</DialogHeader>
						
						<div className="grid grid-cols-2 gap-4 py-4">
							<div className="col-span-2">
								<Label htmlFor="code">Código do Cupom</Label>
								<Input
									id="code"
									value={novoCupom.code}
									onChange={(e) => setNovoCupom({...novoCupom, code: e.target.value.toUpperCase()})}
									placeholder="Ex: PROMO20"
									className="mt-1"
								/>
							</div>
							
							<div>
								<Label htmlFor="discountType">Tipo de Desconto</Label>
								<Select 
									value={novoCupom.discountType} 
									onValueChange={(value: 'PERCENTAGE' | 'FIXED') => 
										setNovoCupom({...novoCupom, discountType: value})
									}
								>
									<SelectTrigger className="mt-1">
										<SelectValue placeholder="Selecione o tipo" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="PERCENTAGE">Percentual (%)</SelectItem>
										<SelectItem value="FIXED">Valor Fixo (R$)</SelectItem>
									</SelectContent>
								</Select>
							</div>
							
							<div>
								<Label htmlFor="discount">
									Desconto ({novoCupom.discountType === 'PERCENTAGE' ? '%' : 'R$'})
								</Label>
								<Input
									id="discount"
									type="number"
									value={novoCupom.discount}
									onChange={(e) => setNovoCupom({...novoCupom, discount: Number(e.target.value)})}
									min="0"
									max={novoCupom.discountType === 'PERCENTAGE' ? 100 : undefined}
									className="mt-1"
								/>
							</div>
							
							<div>
								<Label htmlFor="expiresAt">Data de Expiração</Label>
								<Input
									id="expiresAt"
									type="date"
									value={novoCupom.expiresAt}
									onChange={(e) => setNovoCupom({...novoCupom, expiresAt: e.target.value})}
									className="mt-1"
								/>
							</div>
							
							<div>
								<Label htmlFor="usageLimit">Limite de Uso</Label>
								<Input
									id="usageLimit"
									type="number"
									value={novoCupom.usageLimit}
									onChange={(e) => setNovoCupom({...novoCupom, usageLimit: Number(e.target.value)})}
									min="1"
									className="mt-1"
								/>
							</div>
							
							<div className="col-span-2">
								<Label htmlFor="description">Descrição</Label>
								<Input
									id="description"
									value={novoCupom.description || ''}
									onChange={(e) => setNovoCupom({...novoCupom, description: e.target.value})}
									placeholder="Descrição do cupom"
									className="mt-1"
								/>
							</div>
							
							<div className="col-span-2 flex items-center space-x-2">
								<Switch
									id="front_publishable"
									checked={novoCupom.front_publishable}
									onCheckedChange={(checked) => setNovoCupom({...novoCupom, front_publishable: checked})}
								/>
								<Label htmlFor="front_publishable">
									Exibir na tela inicial
								</Label>
							</div>
						</div>
						
						<div className="flex justify-end gap-2">
							<Button variant="outline" onClick={() => setDialogOpen(false)}>
								Cancelar
							</Button>
							<Button 
								onClick={editingCoupon ? atualizarCupom : criarCupom}
								disabled={loading || !novoCupom.code || novoCupom.discount <= 0}
							>
								{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								{editingCoupon ? "Atualizar" : "Criar"}
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Cupons Existentes</CardTitle>
				</CardHeader>
				<CardContent>
					{loading && !cupons.length ? (
						<div className="flex justify-center py-8">
							<Loader2 className="h-8 w-8 animate-spin text-gray-400" />
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full table-auto">
								<thead>
									<tr className="border-b">
										<th className="px-4 py-2 text-left">Código</th>
										<th className="px-4 py-2 text-left">Desconto</th>
										<th className="px-4 py-2 text-left">Expiração</th>
										<th className="px-4 py-2 text-left">Uso</th>
										<th className="px-4 py-2 text-left">Exibe na tela principal</th>
										<th className="px-4 py-2 text-left">Status</th>
										<th className="px-4 py-2 text-left">Ações</th>
									</tr>
								</thead>
								<tbody>
									{cupons.length === 0 ? (
										<tr>
											<td colSpan={7} className="px-4 py-8 text-center text-gray-500">
												Nenhum cupom encontrado
											</td>
										</tr>
									) : (
										cupons.map((cupom) => (
											<tr key={cupom.id} className="border-b">
												<td className="px-4 py-2 font-mono font-bold">
													{cupom.code}
												</td>
												<td className="px-4 py-2">
													{cupom.discount}
													{cupom.discountType === "PERCENTAGE" ? "%" : " R$"}
												</td>
												<td className="px-4 py-2">
													{new Date(cupom.expiresAt).toLocaleDateString()}
												</td>
												<td className="px-4 py-2">
													{cupom.usages?.length || 0}/{cupom.usageLimit}
													<div className="w-full bg-gray-200 rounded-full h-2 mt-1">
														<div
															className="bg-blue-600 h-2 rounded-full"
															style={{
																width: `${((cupom.usages?.length || 0) / cupom.usageLimit) * 100}%`,
															}}
														></div>
													</div>
												</td>
												<td className="px-4 py-2">
													{cupom.front_publishable ? (
														<span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">
															Sim
														</span>
													) : (
														<span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">
															Não
														</span>
													)}
												</td>
												<td className="px-4 py-2">
													<span
														className={`px-2 py-1 text-xs rounded ${
															cupom.status === 'ACTIVE'
																? "bg-green-100 text-green-800"
																: cupom.status === 'EXPIRED'
																? "bg-yellow-100 text-yellow-800"
																: "bg-red-100 text-red-800"
														}`}
													>
														{cupom.status === 'ACTIVE' 
															? "Ativo" 
															: cupom.status === 'EXPIRED'
															? "Expirado"
															: "Inativo"}
													</span>
												</td>
												<td className="px-4 py-2">
													<div className="flex space-x-2">
														<Button
															variant="outline"
															size="sm"
															onClick={() => editarCupom(cupom)}
														>
															Editar
														</Button>
														<Button
															variant="outline"
															size="sm"
															onClick={() => toggleCupomStatus(cupom)}
															className={cupom.status === 'ACTIVE' ? "text-yellow-600" : "text-green-600"}
														>
															{cupom.status === 'ACTIVE' ? "Desativar" : "Ativar"}
														</Button>
														<Button
															variant="outline"
															size="sm"
															onClick={() => excluirCupom(cupom.id)}
															className="text-red-600"
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default CuponsPage;
