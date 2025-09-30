"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { frontSectionsService, type FrontSection, type CreateFrontSectionDto } from "@/services/frontsections.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import * as LucideIcons from "lucide-react";

// Lista exata de ícones do DTO do backend
const AVAILABLE_ICONS = [
  // Ícones de negócios/financeiro
  'DollarSign', 'Euro', 'PoundSterling', 'CreditCard', 'Banknote', 'TrendingUp', 'TrendingDown',
  // Ícones de tempo/suporte
  'Clock', 'Clock3', 'Clock9', 'Timer', 'Hourglass', 'Calendar', 'CalendarDays',
  // Ícones de segurança
  'Shield', 'ShieldCheck', 'ShieldAlert', 'Lock', 'Unlock', 'Key', 'Eye', 'EyeOff',
  // Ícones de pessoas/clientes
  'User', 'Users', 'UserCheck', 'UserPlus', 'UserX', 'Heart', 'Star', 'Award',
  // Ícones de comunicação
  'Phone', 'PhoneCall', 'MessageCircle', 'Mail', 'Send', 'Headphones',
  // Ícones de verificação/qualidade
  'CheckCircle', 'CheckSquare', 'Badge', 'Trophy', 'Target', 'Zap',
  // Ícones de localização/viagem
  'MapPin', 'Globe', 'Plane', 'Car', 'Train', 'Ship', 'Compass', 'Navigation',
  // Outros ícones úteis
  'Settings', 'Cog', 'Wrench', 'Tool', 'Package', 'Gift', 'Sparkles', 'Rocket'
] as const;

// Cores disponíveis para background
const AVAILABLE_COLORS = [
  'blue', 'green', 'red', 'yellow', 'purple', 'pink', 'indigo', 'gray', 'orange', 'teal'
] as const;

const frontSectionSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(100, "Título deve ter no máximo 100 caracteres"),
  description: z.string().min(1, "Descrição é obrigatória").max(500, "Descrição deve ter no máximo 500 caracteres"),
  icon: z.enum(AVAILABLE_ICONS, { required_error: "Selecione um ícone" }),
  bgColor: z.enum(AVAILABLE_COLORS).default('blue'),
  order: z.number().min(1, "Ordem deve ser maior que 0").default(1),
});

type FrontSectionFormValues = z.infer<typeof frontSectionSchema>;

interface FrontSectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSectionSaved: (section: FrontSection) => void;
  editingSection?: FrontSection | null;
}

/**
 * Modal para adicionar/editar seções da página inicial
 */
export function FrontSectionModal({ 
  open, 
  onOpenChange, 
  onSectionSaved, 
  editingSection 
}: FrontSectionModalProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<FrontSectionFormValues>({
    resolver: zodResolver(frontSectionSchema),
    defaultValues: {
      title: editingSection?.title || "",
      description: editingSection?.description || "",
      icon: (editingSection?.icon as any) || "DollarSign",
      bgColor: (editingSection?.bgColor as any) || "blue",
      order: editingSection?.order || 1,
    },
  });

  /**
   * Renderiza o ícone selecionado
   */
  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (!IconComponent) return null;
    return <IconComponent className="h-4 w-4" />;
  };

  /**
   * Submete o formulário
   */
  const onSubmit = async (values: FrontSectionFormValues) => {
    try {
      setLoading(true);
      
      const sectionData: CreateFrontSectionDto = {
        title: values.title,
        description: values.description,
        icon: values.icon,
        bgColor: values.bgColor,
        order: values.order,
      };

      let savedSection: FrontSection;

      if (editingSection) {
        // Atualizar seção existente
        savedSection = await frontSectionsService.update(editingSection.id, sectionData);
        toast.success("Seção atualizada com sucesso!");
      } else {
        // Criar nova seção
        savedSection = await frontSectionsService.create(sectionData);
        toast.success("Seção criada com sucesso!");
      }
      
      onSectionSaved(savedSection);
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Erro ao salvar seção:", error);
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        "Erro ao salvar seção. Tente novamente.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fecha o modal e reseta o formulário
   */
  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingSection ? "Editar Seção" : "Adicionar Nova Seção"}
          </DialogTitle>
          <DialogDescription>
            {editingSection 
              ? "Edite as informações da seção 'Por que escolher'." 
              : "Crie uma nova seção para 'Por que escolher'."
            }
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Melhor Preço" 
                      {...field} 
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva os benefícios desta seção..." 
                      {...field} 
                      disabled={loading}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ícone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um ícone">
                            {field.value && (
                              <div className="flex items-center gap-2">
                                {renderIcon(field.value)}
                                <span>{field.value}</span>
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60">
                        {AVAILABLE_ICONS.map((iconName) => (
                          <SelectItem key={iconName} value={iconName}>
                            <div className="flex items-center gap-2">
                              {renderIcon(iconName)}
                              <span>{iconName}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bgColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cor de Fundo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma cor">
                            {field.value && (
                              <div className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded bg-${field.value}-500`}></div>
                                <span className="capitalize">{field.value}</span>
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {AVAILABLE_COLORS.map((color) => (
                          <SelectItem key={color} value={color}>
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded bg-${color}-500`}></div>
                              <span className="capitalize">{color}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ordem de Exibição</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      min="1"
                      placeholder="1" 
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-muted-foreground">
                    Define a ordem em que esta seção aparecerá na página.
                  </p>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading 
                  ? (editingSection ? "Salvando..." : "Criando...") 
                  : (editingSection ? "Salvar Alterações" : "Criar Seção")
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}