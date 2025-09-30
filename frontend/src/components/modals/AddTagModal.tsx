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
import { tagsService, type CreateTagDTO } from "@/services/tags.service";
import { generateSlug, isValidSlug } from "@/utils/slug";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const tagSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(50, "Nome deve ter no máximo 50 caracteres"),
  slug: z.string()
    .min(1, "Slug é obrigatório")
    .max(50, "Slug deve ter no máximo 50 caracteres")
    .refine((slug) => isValidSlug(slug), {
      message: "Slug deve conter apenas letras minúsculas, números e hífens, sem espaços ou acentos"
    }),
  description: z.string().optional(),
});

type TagFormValues = z.infer<typeof tagSchema>;

interface AddTagModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTagAdded: (tag: any) => void;
}

/**
 * Modal para adicionar nova tag
 */
export function AddTagModal({ open, onOpenChange, onTagAdded }: AddTagModalProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });

  // Observa mudanças no campo name para gerar slug automaticamente
  const watchName = form.watch("name");
  
  useEffect(() => {
    if (watchName) {
      const generatedSlug = generateSlug(watchName);
      form.setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [watchName, form]);

  const onSubmit = async (values: TagFormValues) => {
    try {
      setLoading(true);
      
      const tagData: CreateTagDTO = {
        name: values.name,
        slug: values.slug,
        description: values.description || undefined,
      };

      const newTag = await tagsService.create(tagData);
      
      toast.success("Tag criada com sucesso!");
      onTagAdded(newTag);
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Erro ao criar tag:", error);
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        "Erro ao criar tag. Tente novamente.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Tag</DialogTitle>
          <DialogDescription>
            Crie uma nova tag para categorizar seus posts.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Tag</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Digite o nome da tag" 
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
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="slug-da-tag" 
                      {...field} 
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-muted-foreground">
                    O slug é gerado automaticamente baseado no nome, mas pode ser editado.
                  </p>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva a tag (opcional)" 
                      {...field} 
                      disabled={loading}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
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
                {loading ? "Criando..." : "Criar Tag"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}