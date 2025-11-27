"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    socialAssessmentSchema,
    HousingTypeEnum,
    HousingConditionEnum,
    HealthAccessEnum,
    SocialProgramEnum,
} from "@/lib/schemas/domain";
import { createSocialAssessment } from "@/actions/beneficiaries";
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
import { Loader2, Plus, Trash2 } from "lucide-react";
import { z } from "zod";

// Extend schema for form handling
const formSchema = z.object({
    beneficiaryId: z.string(),
    householdSize: z.number().int().min(1),
    housingType: HousingTypeEnum,
    housingCondition: HousingConditionEnum,
    familyIncome: z.string().min(1),

    healthAccess: z.array(HealthAccessEnum).optional(),
    hasSanitation: z.boolean().optional(),
    hasWater: z.boolean().optional(),
    hasSewage: z.boolean().optional(),
    hasGarbageCollection: z.boolean().optional(),

    hasSchoolNearby: z.boolean().optional(),
    schoolName: z.string().optional(),
    hasPublicTransport: z.boolean().optional(),

    socialPrograms: z.array(SocialProgramEnum).optional(),

    consentGiven: z.boolean().refine((val) => val === true, {
        message: "Consentimento é obrigatório",
    }),
    consentDate: z.string().optional(),

    familyMembers: z.array(
        z.object({
            name: z.string().min(1),
            age: z.string(),
            relationship: z.string().min(1),
            educationLevel: z.string().optional(),
            isStudying: z.boolean().optional(),
            occupation: z.string().optional(),
            isPCD: z.boolean().optional(),
        })
    ).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface SocialAssessmentFormProps {
    beneficiaryId: string;
}

export function SocialAssessmentForm({ beneficiaryId }: SocialAssessmentFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            beneficiaryId,
            householdSize: 1,
            housingType: undefined,
            housingCondition: undefined,
            familyIncome: "",
            healthAccess: [],
            hasSanitation: false,
            hasWater: false,
            hasSewage: false,
            hasGarbageCollection: false,
            hasSchoolNearby: false,
            schoolName: "",
            hasPublicTransport: false,
            socialPrograms: [],
            consentGiven: false,
            consentDate: "",
            familyMembers: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "familyMembers",
    });

    async function onSubmit(values: FormData) {
        setIsSubmitting(true);

        try {
            const data = {
                ...values,
                consentDate: values.consentDate ? new Date(values.consentDate) : undefined,
                familyMembers: values.familyMembers?.map((member) => ({
                    ...member,
                    age: parseInt(member.age),
                })),
            };

            const result = await createSocialAssessment(data);

            if (result.success) {
                toast({
                    title: "Sucesso!",
                    description: "Avaliação socioeconômica cadastrada com sucesso.",
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
                description: "Ocorreu um erro ao cadastrar a avaliação.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Composição Familiar</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="householdSize"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Número de pessoas *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="1"
                                            {...field}
                                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium">Membros da família</h4>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        append({
                                            name: "",
                                            age: "",
                                            relationship: "",
                                            educationLevel: "",
                                            isStudying: false,
                                            occupation: "",
                                            isPCD: false,
                                        })
                                    }
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Adicionar
                                </Button>
                            </div>

                            {fields.map((field, index) => (
                                <Card key={field.id}>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-sm">Membro #{index + 1}</CardTitle>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => remove(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="grid gap-3 md:grid-cols-3">
                                            <FormField
                                                control={form.control}
                                                name={`familyMembers.${index}.name`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Nome</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name={`familyMembers.${index}.age`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Idade</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name={`familyMembers.${index}.relationship`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Parentesco</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="flex gap-4">
                                            <FormField
                                                control={form.control}
                                                name={`familyMembers.${index}.isStudying`}
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                        <FormLabel>Estuda?</FormLabel>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name={`familyMembers.${index}.isPCD`}
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                        <FormLabel>PCD?</FormLabel>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Moradia</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="housingType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="ALUGADA">Alugada</SelectItem>
                                                <SelectItem value="PROPRIA">Própria</SelectItem>
                                                <SelectItem value="CEDIDA">Cedida</SelectItem>
                                                <SelectItem value="OUTRA">Outra</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="housingCondition"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Condição *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="BOA">Boa</SelectItem>
                                                <SelectItem value="REGULAR">Regular</SelectItem>
                                                <SelectItem value="FRAGIL">Frágil</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="familyIncome"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Renda familiar *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="R$ 1.200,00" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Termo de Consentimento</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="consentGiven"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel>
                                        Confirmo que as informações são verdadeiras *
                                    </FormLabel>
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Salvar
                    </Button>
                </div>
            </form>
        </Form>
    );
}
