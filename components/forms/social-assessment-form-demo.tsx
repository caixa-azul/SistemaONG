"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HousingStatus } from "@/types";
import { useState } from "react";

const schema = z.object({
    beneficiaryId: z.string().optional(),
    familyIncome: z.coerce.number().min(0, "Renda deve ser maior ou igual a 0"),
    familyMemberCount: z.coerce.number().min(1, "Mínimo de 1 membro"),
    housingStatus: z.enum(["OWNED", "RENTED", "CEDED", "OTHER"]),
    governmentBenefits: z.string().optional(),
    healthIssues: z.string().optional(),
    professionalStatus: z.string().optional(),
    expenses: z.coerce.number().optional(),
});

type FormData = z.infer<typeof schema>;

export function SocialAssessmentFormDemo() {
    const [submittedData, setSubmittedData] = useState<FormData | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema) as any,
        defaultValues: {
            familyIncome: 0,
            familyMemberCount: 1,
            housingStatus: "OWNED",
            expenses: 0,
        },
    });

    const onSubmit = (data: FormData) => {
        setSubmittedData(data);
        alert("Formulário enviado (Simulação)! Veja os dados abaixo.");
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Avaliação Socioeconômica (DEMO)</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Renda Familiar (R$)</label>
                                <Input type="number" step="0.01" {...register("familyIncome")} />
                                {errors.familyIncome && <p className="text-red-500 text-xs">{errors.familyIncome.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Número de Membros</label>
                                <Input type="number" {...register("familyMemberCount")} />
                                {errors.familyMemberCount && <p className="text-red-500 text-xs">{errors.familyMemberCount.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Situação de Moradia</label>
                                <select
                                    {...register("housingStatus")}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="OWNED">Própria</option>
                                    <option value="RENTED">Alugada</option>
                                    <option value="CEDED">Cedida</option>
                                    <option value="OTHER">Outra</option>
                                </select>
                                {errors.housingStatus && <p className="text-red-500 text-xs">{errors.housingStatus.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Situação Profissional</label>
                                <Input {...register("professionalStatus")} placeholder="Ex: Autônomo, Desempregado" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Despesas Mensais (R$)</label>
                                <Input type="number" step="0.01" {...register("expenses")} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Benefícios Governamentais</label>
                            <Input {...register("governmentBenefits")} placeholder="Ex: Bolsa Família, BPC" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Questões de Saúde</label>
                            <textarea
                                {...register("healthIssues")}
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Descreva problemas de saúde na família..."
                            />
                        </div>

                        <Button type="submit">
                            Simular Envio
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {submittedData && (
                <Card>
                    <CardHeader>
                        <CardTitle>Dados Submetidos (Visualização)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-100 p-4 rounded-md overflow-auto">
                            {JSON.stringify(submittedData, null, 2)}
                        </pre>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
