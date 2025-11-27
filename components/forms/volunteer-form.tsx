"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createVolunteerWithAddress } from "@/actions/volunteers";
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
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const formSchema = z.object({
    // Volunteer fields
    fullName: z.string().min(3, "Nome completo é obrigatório"),
    dateOfBirth: z.string().min(1, "Data de nascimento é obrigatória"),
    cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/, "CPF inválido"),
    rg: z.string().min(1, "RG é obrigatório"),
    email: z.string().email("E-mail inválido").optional().or(z.literal("")),
    phoneNumber: z.string().min(1, "Telefone é obrigatório"),
    joinDate: z.string().min(1, "Data de adesão é obrigatória"),

    // Address fields
    street: z.string().min(1, "Rua/Av. é obrigatória"),
    number: z.string().min(1, "Número é obrigatório"),
    neighborhood: z.string().min(1, "Bairro é obrigatório"),
    city: z.string().min(1, "Cidade é obrigatória"),
    state: z.string().length(2, "UF deve ter 2 caracteres"),
    zipCode: z.string().optional(),
    complement: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function VolunteerForm() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            dateOfBirth: "",
            cpf: "",
            rg: "",
            email: "",
            phoneNumber: "",
            joinDate: new Date().toISOString().split("T")[0],
            street: "",
            number: "",
            neighborhood: "",
            city: "",
            state: "",
            zipCode: "",
            complement: "",
        },
    });

    async function onSubmit(values: FormData) {
        setIsSubmitting(true);

        try {
            const volunteerData = {
                fullName: values.fullName,
                dateOfBirth: new Date(values.dateOfBirth),
                cpf: values.cpf,
                rg: values.rg,
                email: values.email,
                phoneNumber: values.phoneNumber,
                joinDate: new Date(values.joinDate),
            };

            const addressData = {
                street: values.street,
                number: values.number,
                neighborhood: values.neighborhood,
                city: values.city,
                state: values.state,
                zipCode: values.zipCode,
                complement: values.complement,
            };

            const result = await createVolunteerWithAddress(volunteerData, addressData);

            if (result.success) {
                toast({
                    title: "Sucesso!",
                    description: "Voluntário cadastrado com sucesso.",
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
                description: "Ocorreu um erro ao cadastrar o voluntário.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informações Pessoais</CardTitle>
                        <CardDescription>Dados cadastrais do voluntário</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome Completo *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nome completo do voluntário" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="dateOfBirth"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data de Nascimento *</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="joinDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data de Adesão *</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormDescription>Data de início como voluntário</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="cpf"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CPF *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="000.000.000-00" {...field} />
                                        </FormControl>
                                        <FormDescription>Formato: 000.000.000-00 ou apenas números</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="rg"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>RG *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="RG" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Contato</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Telefone *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="(00) 00000-0000" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>E-mail</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="email@exemplo.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Address */}
                <Card>
                    <CardHeader>
                        <CardTitle>Endereço</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="md:col-span-2">
                                <FormField
                                    control={form.control}
                                    name="street"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Rua/Av. *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nome da rua" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Número *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nº" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="neighborhood"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bairro *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Bairro" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="complement"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Complemento</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Apto, Casa, etc." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cidade *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Cidade" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>UF *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="SC" maxLength={2} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="zipCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CEP</FormLabel>
                                        <FormControl>
                                            <Input placeholder="00000-000" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                        Cadastrar Voluntário
                    </Button>
                </div>
            </form>
        </Form>
    );
}
