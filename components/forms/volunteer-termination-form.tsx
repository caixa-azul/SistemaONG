"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { terminateVolunteer } from "@/actions/volunteers";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const formSchema = z.object({
    volunteerId: z.string().min(1, "ID do voluntário é obrigatório"),
    terminationDate: z.string().min(1, "Data de encerramento é obrigatória"),
    terminationReason: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface VolunteerTerminationFormProps {
    volunteerId?: string;
    volunteerName?: string;
}

export function VolunteerTerminationForm({
    volunteerId,
    volunteerName,
}: VolunteerTerminationFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            volunteerId: volunteerId || "",
            terminationDate: new Date().toISOString().split("T")[0],
            terminationReason: "",
        },
    });

    async function onSubmit(values: FormData) {
        setIsSubmitting(true);

        try {
            const data = {
                volunteerId: values.volunteerId,
                terminationDate: new Date(values.terminationDate),
                terminationReason: values.terminationReason,
            };

            const result = await terminateVolunteer(data);

            if (result.success) {
                toast({
                    title: "Sucesso!",
                    description: "Serviço voluntário encerrado com sucesso.",
                });
                router.push("/volunteers");
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
                description: "Ocorreu um erro ao encerrar o serviço voluntário.",
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
                        <CardTitle>Encerramento de Serviço Voluntário</CardTitle>
                        <CardDescription>
                            {volunteerName
                                ? `Encerrar serviço de: ${volunteerName}`
                                : "Informações sobre o encerramento"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {!volunteerId && (
                            <FormField
                                control={form.control}
                                name="volunteerId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>ID do Voluntário *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Cole o ID do voluntário" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Navegue para a lista de voluntários e copie o ID
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="terminationDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Data de Encerramento *</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormDescription>Data de término do serviço voluntário</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="terminationReason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Motivo do Encerramento</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Descreva o motivo do encerramento (opcional)..."
                                            className="min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Ex: Mudança de cidade, questões pessoais, conclusão do projeto, etc.
                                    </FormDescription>
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
                    <Button type="submit" variant="destructive" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Encerrar Serviço Voluntário
                    </Button>
                </div>
            </form>
        </Form>
    );
}
