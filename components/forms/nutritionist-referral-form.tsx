"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { nutritionistReferralSchema, SpecialtyEnum } from "@/lib/schemas/domain";
import { createNutritionistReferral } from "@/actions/beneficiaries";
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
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const formSchema = z.object({
    beneficiaryId: z.string(),
    specialty: SpecialtyEnum,
    indication: z.string().optional(),
    weight: z.string().optional(),
    height: z.string().optional(),
    observations: z.string().optional(),
    referredBy: z.string().min(1, "Nome do responsável é obrigatório"),
    referrerRole: z.string().min(1, "Cargo é obrigatório"),
    referralDate: z.string().min(1, "Data do encaminhamento é obrigatória"),
});

type FormData = z.infer<typeof formSchema>;

interface NutritionistReferralFormProps {
    beneficiaryId: string;
}

export function NutritionistReferralForm({ beneficiaryId }: NutritionistReferralFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            beneficiaryId,
            specialty: undefined,
            indication: "",
            weight: "",
            height: "",
            observations: "",
            referredBy: "",
            referrerRole: "",
            referralDate: new Date().toISOString().split("T")[0],
        },
    });

    const selectedSpecialty = form.watch("specialty");
    const isNutritionist = selectedSpecialty === "NUTRICIONISTA";

    async function onSubmit(values: FormData) {
        setIsSubmitting(true);

        try {
            const data = {
                beneficiaryId: values.beneficiaryId,
                specialty: values.specialty,
                indication: values.indication,
                weight: values.weight ? parseFloat(values.weight) : undefined,
                height: values.height ? parseFloat(values.height) : undefined,
                observations: values.observations,
                referredBy: values.referredBy,
                referrerRole: values.referrerRole,
                referralDate: new Date(values.referralDate),
            };

            const result = await createNutritionistReferral(data);

            if (result.success) {
                toast({
                    title: "Sucesso!",
                    description: "Encaminhamento registrado com sucesso.",
                });
                router.push(`/beneficiaries/${beneficiaryId}`);
                router.refresh();
            } else {
                toast({
                    title: "Erro",
                    description: result.error as string,
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Erro",
                description: "Ocorreu um erro ao registrar o encaminhamento.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Specialty Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle>Especialidade / Encaminhamento</CardTitle>
                        <CardDescription>Marcar a especialidade e preencher campos relevantes</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="specialty"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Especialidade *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione a especialidade" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="PSICOLOGO">Psicólogo</SelectItem>
                                            <SelectItem value="ASSISTENTE_SOCIAL">Assistente Social</SelectItem>
                                            <SelectItem value="NUTRICIONISTA">Nutricionista</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {isNutritionist && (
                            <FormField
                                control={form.control}
                                name="indication"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Indicação</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione a indicação" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Criança c/ comorbidade">
                                                    Criança c/ comorbidade
                                                </SelectItem>
                                                <SelectItem value="Gestante alto risco">Gestante alto risco</SelectItem>
                                                <SelectItem value="Cirurgia bariátrica">Cirurgia bariátrica</SelectItem>
                                                <SelectItem value="Psiquiatria">Psiquiatria</SelectItem>
                                                <SelectItem value="Outro">Outro</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </CardContent>
                </Card>

                {/* Health Metrics (for Nutritionist) */}
                {isNutritionist && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Medidas</CardTitle>
                            <CardDescription>Se aplicável</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="weight"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Peso (kg)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="Ex: 70.5"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="height"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Estatura (m)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="Ex: 1.75"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Observations */}
                <Card>
                    <CardHeader>
                        <CardTitle>Referências / Observações</CardTitle>
                        <CardDescription>
                            Informações para a especialidade / motivo do encaminhamento
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="observations"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Observações</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Descreva o motivo do encaminhamento e informações relevantes..."
                                            className="min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                {/* Referrer Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Responsável pelo Encaminhamento</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="referredBy"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nome do responsável" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="referrerRole"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cargo *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Cargo/Função" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="referralDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Data do Encaminhamento *</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                        Registrar Encaminhamento
                    </Button>
                </div>
            </form>
        </Form>
    );
}
