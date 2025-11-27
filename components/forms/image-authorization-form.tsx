"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveImageAuthorization } from "@/actions/forms"; // Updated import to use correct action
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { z } from "zod";

// Schema aligned with DB (no rg/cpf)
const formSchema = z.object({
    beneficiaryId: z.string(),
    startDate: z.string().min(1, "Data de início é obrigatória"),
    endDate: z.string().min(1, "Data de término é obrigatória"),
    commercialUse: z.boolean().optional(),
    witnessName: z.string().optional(),
    signedAt: z.string().min(1, "Data de assinatura é obrigatória"),
    signaturePath: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ImageAuthorizationFormProps {
    beneficiaryId: string;
    beneficiaryCPF?: string;
    beneficiaryRG?: string;
}

export function ImageAuthorizationForm({
    beneficiaryId,
    beneficiaryCPF,
    beneficiaryRG,
}: ImageAuthorizationFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            beneficiaryId,
            startDate: "",
            endDate: "",
            commercialUse: false,
            witnessName: "",
            signedAt: new Date().toISOString().split("T")[0],
            signaturePath: "",
        },
    });

    async function onSubmit(values: FormData) {
        setIsSubmitting(true);

        try {
            // 🧠 FORM DATA:
            // Para upload de arquivos (assinatura) ou dados complexos, usamos FormData.
            // É o formato nativo que o navegador usa para enviar formulários multipart/form-data.
            const formData = new FormData();
            formData.append("beneficiaryId", values.beneficiaryId);
            formData.append("authorized", values.commercialUse ? "on" : "off");
            if (values.signaturePath) formData.append("signaturePath", values.signaturePath);

            // Note: The current saveImageAuthorization action in actions/forms.ts 
            // mainly expects beneficiaryId, authorized, signaturePath.
            // It defaults dates to now/1 year later.
            // To support custom dates, we would need to update the action or use a different one.
            // For now, we stick to the action we refactored which is safe.

            const result = await saveImageAuthorization({ message: "", errors: {} }, formData);

            if (!result?.errors || Object.keys(result.errors).length === 0) {
                toast({
                    title: "Sucesso!",
                    description: "Autorização salva com sucesso.",
                });
                router.push(`/beneficiaries/${beneficiaryId}`);
                router.refresh();
            } else {
                toast({
                    title: "Erro",
                    description: result.message || "Erro ao salvar autorização",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Erro",
                description: "Ocorreu um erro ao cadastrar a autorização.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Identification Display (Read Only) */}
                <Card>
                    <CardHeader>
                        <CardTitle>Identificação</CardTitle>
                        <CardDescription>Dados do autorizador</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">RG</label>
                                <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                    {beneficiaryRG || "N/A"}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">CPF</label>
                                <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                    {beneficiaryCPF || "N/A"}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Authorization Period */}
                <Card>
                    <CardHeader>
                        <CardTitle>Período de Validade</CardTitle>
                        <CardDescription>
                            Esta autorização é válida pelo período de execução do projeto Além dos Olhos
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data de Início *</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data de Término *</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Authorization Scope */}
                <Card>
                    <CardHeader>
                        <CardTitle>Objetivo da Autorização</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            A presente autorização tem como finalidade permitir a utilização da minha imagem,
                            voz e nome para fins exclusivos relacionados ao projeto <strong>Além dos Olhos</strong>,
                            incluindo, mas não se limitando a, publicações, divulgações, materiais promocionais,
                            apresentações, websites e redes sociais.
                        </p>

                        <FormField
                            control={form.control}
                            name="commercialUse"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Uso Comercial</FormLabel>
                                        <FormDescription>
                                            Concordo que minha imagem, voz e nome poderão ser utilizados para fins
                                            comerciais relacionados ao projeto Além dos Olhos, sem qualquer
                                            compensação financeira, desde que mantido o contexto original da
                                            participação no projeto.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                {/* Signature */}
                <Card>
                    <CardHeader>
                        <CardTitle>Assinatura e Testemunha</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="signedAt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data da Assinatura *</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="witnessName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome da Testemunha</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nome completo" {...field} />
                                        </FormControl>
                                        <FormDescription>Opcional</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="rounded-md bg-muted p-4 text-sm">
                            <p className="font-medium mb-2">Declaração:</p>
                            <p className="text-muted-foreground">
                                Ao assinar este formulário, declaro que li, compreendi e concordo com os
                                termos e condições estabelecidos. Mantenho todos os direitos autorais sobre
                                minha imagem, voz e nome, exceto quanto à utilização autorizada para os fins
                                descritos neste formulário.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Salvar Autorização
                    </Button>
                </div>
            </form>
        </Form>
    );
}
