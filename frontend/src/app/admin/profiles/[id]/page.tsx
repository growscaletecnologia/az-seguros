"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClipboardCheck } from "lucide-react";
import { toast } from "sonner";
import { profilesService, UserFunction } from "@/services/profiles.service";
import { useTheme } from "next-themes";
import React from "react";

// Schema de validação
const profileSchema = z.object({
  name: z.string().min(1, "Nome do perfil é obrigatório"),
  userActions: z.array(
    z.object({
      functionId: z.string(),
      actions: z.string().length(4)
    })
  )
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileForm({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { theme } = useTheme();
  
  // Desembrulha os parâmetros usando React.use()
  const { id } = React.use(params);
  const isNew = id === "new";
  
  const [isPending, setIsPending] = useState(false);
  const [userFunctions, setUserFunctions] = useState<UserFunction[]>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      userActions: []
    }
  });

  const watchUserActions = watch("userActions");

  // Carregar funções de usuário e dados do perfil se estiver editando
  useEffect(() => {
    const loadUserFunctions = async () => {
      try {
        const functions = await profilesService.getUserFunctions();
        setUserFunctions(functions);
        
        // Inicializar userActions com todas as funções e permissões zeradas
        const initialUserActions = functions.map(func => ({
          functionId: func.id,
          actions: "0000" // Ver, Criar, Editar, Excluir - todos desativados
        }));
        
        setValue("userActions", initialUserActions);
        
        // Se estiver editando, carregar dados do perfil
        if (!isNew) {
          const profile = await profilesService.getProfileById(id);
          setValue("name", profile.name);
          
          // Mapear as ações do perfil para o formulário
          if (profile.userActions && profile.userActions.length > 0) {
            setValue("userActions", profile.userActions);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados necessários");
      }
    };

    loadUserFunctions();
  }, [isNew, id, setValue]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsPending(true);
      
      if (isNew) {
        await profilesService.createProfile(data);
        toast.success("Perfil criado com sucesso!");
      } else {
        await profilesService.updateProfile(id, data);
        toast.success("Perfil atualizado com sucesso!");
      }
      
      router.push("/admin/profiles");
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      toast.error("Erro ao salvar perfil");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="mx-10 my-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span>{isNew ? "Criar Perfil" : "Editar Perfil"}</span>
          <p>
            <ClipboardCheck />
          </p>
        </CardTitle>

        <CardDescription>
          Preencha os detalhes abaixo para {isNew ? "criar um novo" : "editar o"} perfil
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="mb-4">
            <label
              htmlFor="name"
              className={`block mb-4 text-sm font-medium text-gray-700 ${
                theme === "dark" ? "text-white" : ""
              }`}
            >
              Nome do Perfil
            </label>
            <Input
              placeholder="Ex: Administrador"
              id="name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-4">
            {userFunctions.map((userFunction) => {
              const index = userFunctions.findIndex(
                (f) => f.id === userFunction.id
              );
              const currentActions =
                watchUserActions[index]?.actions || "0000";

              return (
                <div key={userFunction.id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="font-medium text-lg mb-4">{userFunction.displayName}</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {["Ver", "Criar", "Editar", "Excluir"].map(
                      (action, actionIndex) => (
                        <div key={action} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{action}</span>
                          <Controller
                            name={`userActions.${index}.actions`}
                            control={control}
                            render={() => (
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  id={`action-${userFunction.id}-${action}`}
                                  className="peer hidden"
                                  checked={
                                    currentActions[actionIndex] === "1"
                                  }
                                  onChange={() => {
                                    const newActions =
                                      currentActions.split("");
                                    newActions[actionIndex] =
                                      newActions[actionIndex] === "1"
                                        ? "0"
                                        : "1";
                                    setValue(
                                      `userActions.${index}.actions`,
                                      newActions.join("")
                                    );
                                  }}
                                />
                                <label
                                  htmlFor={`action-${userFunction.id}-${action}`}
                                  className={`flex items-center cursor-pointer relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                                    currentActions[actionIndex] === "1"
                                      ? "bg-blue-600"
                                      : theme === "dark"
                                      ? "bg-gray-700"
                                      : "bg-gray-300"
                                  }`}
                                >
                                  <span
                                    className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                                      currentActions[actionIndex] === "1"
                                        ? "translate-x-5"
                                        : "translate-x-0"
                                    }`}
                                  />
                                </label>
                              </div>
                            )}
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between mx-3">
        <Button
          variant={"secondary"}
          type="button"
          onClick={() => router.push("/admin/profiles")}
        >
          Cancelar
        </Button>
        <Button onClick={handleSubmit(onSubmit)} type="submit">
          {isPending ? "Salvando..." : isNew ? "Criar Perfil" : "Salvar Alterações"}
        </Button>
      </CardFooter>
    </Card>
  );
}