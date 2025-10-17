// "use client";

// import { Button } from "@/components/ui/button";
// import {
// 	Card,
// 	CardContent,
// 	CardDescription,
// 	CardHeader,
// 	CardTitle,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { settingsService } from "@/services/settings.service";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";

// /**
//  * Página de configurações do sistema no painel administrativo
//  */
// export default function ConfiguracoesPage() {
// 	const [loading, setLoading] = useState(true);
// 	const [saving, setSaving] = useState(false);
// 	const [gtmSettings, setGtmSettings] = useState({
// 		gtm_head_code: "",
// 		gtm_body_code: "",
// 	});

// 	// Carrega as configurações do GTM ao iniciar
// 	useEffect(() => {
// 		const loadGtmSettings = async () => {
// 			try {
// 				setLoading(true);
// 				const settings = await settingsService.getGtmSettings();
// 				setGtmSettings({
// 					gtm_head_code: settings.gtm_head_code || "",
// 					gtm_body_code: settings.gtm_body_code || "",
// 				});
// 			} catch (error) {
// 				console.error("Erro ao carregar configurações GTM:", error);
// 				toast.error("Erro ao carregar configurações do Google Tag Manager");
// 			} finally {
// 				setLoading(false);
// 			}
// 		};

// 		loadGtmSettings();
// 	}, []);

// 	// Salva as configurações do GTM
// 	const saveGtmSettings = async () => {
// 		try {
// 			setSaving(true);
// 			await settingsService.updateGtmSettings(gtmSettings);
// 			toast.success("Configurações do Google Tag Manager salvas com sucesso");
// 		} catch (error) {
// 			console.error("Erro ao salvar configurações GTM:", error);
// 			toast.error("Erro ao salvar configurações do Google Tag Manager");
// 		} finally {
// 			setSaving(false);
// 		}
// 	};

// 	return (
// 		<div className="space-y-6">
// 			<div className="flex items-center justify-between">
// 				<h1 className="text-2xl font-bold">Configurações do Sistema</h1>
// 			</div>

// 			<Tabs defaultValue="gtm" className="space-y-4">
// 				<TabsList>
// 					<TabsTrigger value="gtm">Google Tag Manager</TabsTrigger>
// 					{/* <TabsTrigger value="analytics" disabled>Google Analytics</TabsTrigger>
//           <TabsTrigger value="seo" disabled>SEO</TabsTrigger> */}
// 				</TabsList>

// 				<TabsContent value="gtm" className="space-y-4">
// 					<Card>
// 						<CardHeader>
// 							<CardTitle>Configurações do Google Tag Manager</CardTitle>
// 							<CardDescription>
// 								Configure os scripts do Google Tag Manager para rastreamento de
// 								eventos no site.
// 							</CardDescription>
// 						</CardHeader>
// 						<CardContent className="space-y-4">
// 							{loading ? (
// 								<div className="flex justify-center py-8">
// 									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
// 								</div>
// 							) : (
// 								<>
// 									<div className="space-y-2">
// 										<label
// 											htmlFor="gtm_head_code"
// 											className="text-sm font-medium"
// 										>
// 											Código para o &lt;head&gt;
// 										</label>
// 										<textarea
// 											id="gtm_head_code"
// 											className="min-h-32 w-full rounded-md border border-gray-300 p-2 text-sm font-mono"
// 											placeholder="<!-- Google Tag Manager -->"
// 											value={gtmSettings.gtm_head_code}
// 											onChange={(e) =>
// 												setGtmSettings({
// 													...gtmSettings,
// 													gtm_head_code: e.target.value,
// 												})
// 											}
// 										/>
// 										{/* <p className="text-xs text-gray-500">
//                       Cole o código do GTM que deve ser inserido na seção &lt;head&gt; do site.
//                     </p> */}
// 									</div>

// 									<div className="space-y-2">
// 										<label
// 											htmlFor="gtm_body_code"
// 											className="text-sm font-medium"
// 										>
// 											Código para o &lt;body&gt;
// 										</label>
// 										<textarea
// 											id="gtm_body_code"
// 											className="min-h-32 w-full rounded-md border border-gray-300 p-2 text-sm font-mono"
// 											placeholder="<!-- Google Tag Manager (noscript) -->"
// 											value={gtmSettings.gtm_body_code}
// 											onChange={(e) =>
// 												setGtmSettings({
// 													...gtmSettings,
// 													gtm_body_code: e.target.value,
// 												})
// 											}
// 										/>
// 										{/* <p className="text-xs text-gray-500">
//                       Cole o código do GTM que deve ser inserido logo após a abertura da tag &lt;body&gt;.
//                     </p> */}
// 									</div>

// 									<div className="flex justify-end">
// 										<Button
// 											onClick={saveGtmSettings}
// 											disabled={saving}
// 											className="bg-blue-600 hover:bg-blue-700"
// 										>
// 											{saving ? "Salvando..." : "Salvar Configurações"}
// 										</Button>
// 									</div>
// 								</>
// 							)}
// 						</CardContent>
// 					</Card>
// 				</TabsContent>
// 			</Tabs>
// 		</div>
// 	);
// }



"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { settingsService } from "@/services/settings.service";
import { useEffect, useState } from "react";
import { toast } from "sonner";

/**
 * Página de configurações do sistema no painel administrativo
 */
export default function ConfiguracoesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [gtmSettings, setGtmSettings] = useState({
    gtm_head_code: "",
    gtm_body_code: "",
  });

  const [openIaSettings, setOpenIaSettings] = useState({
    apiKey: "",
    model: "gpt-4-turbo",
    isEnabled: false,
  });

  // Carrega configurações do GTM
  useEffect(() => {
    const loadGtmSettings = async () => {
      try {
        setLoading(true);
        const settings = await settingsService.getGtmSettings();
        setGtmSettings({
          gtm_head_code: settings.gtm_head_code || "",
          gtm_body_code: settings.gtm_body_code || "",
        });
      } catch (error) {
        console.error("Erro ao carregar configurações GTM:", error);
        toast.error("Erro ao carregar configurações do Google Tag Manager");
      } finally {
        setLoading(false);
      }
    };
    loadGtmSettings();
  }, []);

  const saveGtmSettings = async () => {
    try {
      setSaving(true);
      await settingsService.updateGtmSettings(gtmSettings);
      toast.success("Configurações do Google Tag Manager salvas com sucesso");
    } catch (error) {
      console.error("Erro ao salvar configurações GTM:", error);
      toast.error("Erro ao salvar configurações do Google Tag Manager");
    } finally {
      setSaving(false);
    }
  };

  // Salva a integração fake com OpenIA
  const saveOpenIaSettings = async () => {
    try {
      setSaving(true);
      // fake service
      await new Promise((r) => setTimeout(r, 1200));
      console.log("🚀 Integração OpenIA  salva:", openIaSettings);
      toast.success("Configurações da OpenIA salvas com sucesso");
    } catch (error) {
      console.error("Erro ao salvar OpenIA:", error);
      toast.error("Erro ao salvar configurações da OpenIA");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Configurações do Sistema</h1>
      </div>

      <Tabs defaultValue="gtm" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gtm">Google Tag Manager</TabsTrigger>
          <TabsTrigger value="openia">Integração OpenIA</TabsTrigger>
        </TabsList>

        {/* ======== TAB GTM ======== */}
        <TabsContent value="gtm" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Google Tag Manager</CardTitle>
              <CardDescription>
                Configure os scripts do Google Tag Manager para rastreamento de
                eventos no site.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label htmlFor="gtm_head_code" className="text-sm font-medium">
                      Código para o &lt;head&gt;
                    </label>
                    <textarea
                      id="gtm_head_code"
                      className="min-h-32 w-full rounded-md border border-gray-300 p-2 text-sm font-mono"
                      placeholder="<!-- Google Tag Manager -->"
                      value={gtmSettings.gtm_head_code}
                      onChange={(e) =>
                        setGtmSettings({
                          ...gtmSettings,
                          gtm_head_code: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="gtm_body_code" className="text-sm font-medium">
                      Código para o &lt;body&gt;
                    </label>
                    <textarea
                      id="gtm_body_code"
                      className="min-h-32 w-full rounded-md border border-gray-300 p-2 text-sm font-mono"
                      placeholder="<!-- Google Tag Manager (noscript) -->"
                      value={gtmSettings.gtm_body_code}
                      onChange={(e) =>
                        setGtmSettings({
                          ...gtmSettings,
                          gtm_body_code: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={saveGtmSettings}
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {saving ? "Salvando..." : "Salvar Configurações"}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ======== TAB OPENIA ======== */}
        <TabsContent value="openia" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integração com OpenIA</CardTitle>
              <CardDescription>
                Configure a integração com a API da OpenIA (simulação).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Chave de API </label>
                <input
                  type="password"
                  placeholder="sk-xxxxxxxxxxxxxxxxx"
                  value={openIaSettings.apiKey}
                  onChange={(e) =>
                    setOpenIaSettings({ ...openIaSettings, apiKey: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Modelo</label>
                <select
                  value={openIaSettings.model}
                  onChange={(e) =>
                    setOpenIaSettings({ ...openIaSettings, model: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2"
                >
				  <option value="gpt-5">GPT-5</option>
				  <option value="gpt-5-thinking">GPT-5 Thinking</option>
				  <option value="gpt-4-o">GPT-4o</option>
                  <option value="gpt-3.5o">GPT-3.5</option>
                  <option value="gpt-o1-mini">GPT-o1 Mini</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="isEnabled"
                  type="checkbox"
                  checked={openIaSettings.isEnabled}
                  onChange={(e) =>
                    setOpenIaSettings({ ...openIaSettings, isEnabled: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                <label htmlFor="isEnabled" className="text-sm text-gray-700">
                  Ativar integração com OpenIA
                </label>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={saveOpenIaSettings}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {saving ? "Salvando..." : "Salvar Integração"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
