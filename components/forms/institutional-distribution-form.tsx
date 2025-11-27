"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    InstitutionalDistributionTypeEnum,
    DistributionProgramEnum,
} from "@/lib/schemas/domain";
import { createInstitutionalDistribution } from "@/actions/institutions";
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
import { Loader2, Plus, Trash2 } from "lucide-react";
import { z } from "zod";

const formSchema = z.object({
    institutionId: z.string().min(1, "Instituição é obrigatória"),
    distributionType: InstitutionalDistributionTypeEnum,
    program: DistributionProgramEnum.optional(),
    deliveryDate: z.string().min(1, "Data de entrega é obrigatória"),
    observations: z.string().optional(),
    items: z.array(
        z.object({
            itemName: z.string().min(1, "Nome do item é obrigatório"),
            quantity: z.string().min(1, "Quantidade é obrigatória"),
            observations: z.string().optional(),
        })
    ).min(1, "Adicione pelo menos um item"),
});

type FormData = z.infer<typeof formSchema>;

interface InstitutionalDistributionFormProps {
    institutionId?: string;
    institutionName?: string;
}

export function InstitutionalDistributionForm({
    institutionId,
    institutionName,
}: InstitutionalDistributionFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            institutionId: institutionId || "",
            distributionType: undefined,
            program: undefined,
            deliveryDate: new Date().toISOString().split("T")[0],
            observations: "",
            items: [{ itemName: "", quantity: "", observations: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items",
    });

    async function onSubmit(values: FormData) {
        setIsSubmitting(true);

        try {
            const data = {
                institutionId: values.institutionId,
                distributionType: values.distributionType,
                program: values.program,
                deliveryDate: new Date(values.deliveryDate),
                observations: values.observations,
                items: values.items,
            };

            const result = await createInstitutionalDistribution(data);

            if (result.success) {
                toast({
                    title: "Sucesso!",
                    description: "Distribuição institucional registrada com sucesso.",
                });
                router.push("/distributions/institutional");
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
                {/* Institution Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle>Instituição Destino</CardTitle>
                        <CardDescription>
                            {institutionName ? `Distribuição para: ${institutionName}` : "Selecione a instituição"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!institutionId && (
                            <FormField
                                control={form.control}
                                name="institutionId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>ID da Instituição *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Cole o ID da instituição" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Navegue para a lista de instituições e copie o ID
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o tipo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="ALIMENTOS_EVENTOS">
                                                Alimentos de Eventos
                                            </SelectItem>
                                            <SelectItem value="ALIMENTOS_REGULARES">
                                                Alimentos Regulares
                                            </SelectItem>
                                            <SelectItem value="ALIMENTOS_CONAB">
                                                Alimentos CONAB
                                            </SelectItem>
                                            <SelectItem value="FRUTAS_VERDURAS_CONAB">
                                                Frutas e Verduras CONAB
                                            </SelectItem>
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
                                            <SelectItem value="EVENTO">Evento</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                    </CardContent>
                </Card>

                {/* Distribution Items */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Itens da Distribuição</CardTitle>
                                <CardDescription>Alimentos e quantidades entregues</CardDescription>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => append({ itemName: "", quantity: "", observations: "" })}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Adicionar Item
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {fields.map((field, index) => (
                            <Card key={field.id}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm">Item #{index + 1}</CardTitle>
                                        {fields.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => remove(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name={`items.${index}.itemName`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nome do Item</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Ex: Arroz, Feijão, Leite" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`items.${index}.quantity`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Quantidade</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Ex: 10kg, 5 caixas" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.observations`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Observações</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Observações sobre este item" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>
                </Card>

                {/* General Observations */}
                <Card>
                    <CardHeader>
                        <CardTitle>Observações Gerais</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="observations"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Observações gerais sobre a distribuição..."
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
