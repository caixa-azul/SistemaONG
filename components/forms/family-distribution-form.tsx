"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    FamilyDistributionTypeEnum,
    DistributionProgramEnum,
} from "@/lib/schemas/domain";
import { createFamilyDistribution } from "@/actions/distributions";
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
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search } from "lucide-react";
import { z } from "zod";

const formSchema = z.object({
    beneficiaryId: z.string().min(1, "Beneficiário é obrigatório"),
    distributionType: FamilyDistributionTypeEnum,
    program: DistributionProgramEnum.optional(),
    quantity: z.string().min(1, "Quantidade é obrigatória"),
    deliveryDate: z.string().min(1, "Data de entrega é obrigatória"),
    observations: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface FamilyDistributionFormProps {
    beneficiaryId?: string;
    beneficiaryName?: string;
}

export function FamilyDistributionForm({
    beneficiaryId,
    beneficiaryName,
}: FamilyDistributionFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchCPF, setSearchCPF] = useState("");

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            beneficiaryId: beneficiaryId || "",
            distributionType: undefined,
            program: undefined,
            quantity: "1",
            deliveryDate: new Date().toISOString().split("T")[0],
            observations: "",
        },
    });

    const selectedType = form.watch("distributionType");

    // Auto-select program based on distribution type
    const handleTypeChange = (value: any) => {
        form.setValue("distributionType", value);

        // Auto-set program for CONAB types
        if (value === "LEITE_CONAB") {
            form.setValue("program", "CONAB");
        } else if (value === "KIT_ALIMENTO_ACOLHIMENTO") {
            form.setValue("program", "ACOLHIMENTO");
        } else {
            form.setValue("program", "REGULAR");
        }
    };

    async function onSubmit(values: FormData) {
        setIsSubmitting(true);

        try {
            const data = {
                beneficiaryId: values.beneficiaryId,
                distributionType: values.distributionType,
                program: values.program,
                quantity: parseInt(values.quantity),
                deliveryDate: new Date(values.deliveryDate),
                observations: values.observations,
            };

            const result = await createFamilyDistribution(data);

            if (result.success) {
                toast({
                    title: "Sucesso!",
                    description: "Distribuição registrada com sucesso.",
                });
                router.push("/distributions/family");
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
                description: "Ocorreu um erro ao registrar a distribuição.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Beneficiary Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle>Beneficiário</CardTitle>
                        <CardDescription>
                            {beneficiaryName ? `Distribuição para: ${beneficiaryName}` : "Selecione o beneficiário"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!beneficiaryId && (
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Buscar por CPF..."
                                        value={searchCPF}
                                        onChange={(e) => setSearchCPF(e.target.value)}
                                    />
                                    <Button type="button" variant="outline">
                                        <Search className="h-4 w-4" />
                                    </Button>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="beneficiaryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>ID do Beneficiário *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Cole o ID do beneficiário" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Navegue para /beneficiaries e copie o ID
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Distribution Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Detalhes da Distribuição</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="distributionType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de Distribuição *</FormLabel>
                                    <Select onValueChange={handleTypeChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o tipo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="KIT_ALIMENTO_GENERICO">
                                                Kit de Alimentos Genérico
                                            </SelectItem>
                                            <SelectItem value="KIT_ALIMENTO_FAMILIA">
                                                Kit de Alimentos para Família
                                            </SelectItem>
                                            <SelectItem value="KIT_ALIMENTO_ACOLHIMENTO">
                                                Kit de Alimentos - Acolhimento
                                            </SelectItem>
                                            <SelectItem value="LEITE_CONAB">Leite CONAB</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="program"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Programa</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="REGULAR">Regular</SelectItem>
                                            <SelectItem value="CONAB">CONAB</SelectItem>
                                            <SelectItem value="ACOLHIMENTO">Acolhimento</SelectItem>
                                            <SelectItem value="EVENTO">Evento</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Programa ao qual esta distribuição está vinculada
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quantidade *</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="1" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Número de unidades/kits entregues
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="deliveryDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data de Entrega *</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="observations"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Observações</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Observações adicionais sobre a distribuição..."
                                            className="min-h-[100px]"
                                            {...field}
                                        />
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
                        Registrar Distribuição
                    </Button>
                </div>
            </form>
        </Form>
    );
}
