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
import { PDFDownloadLink } from "@react-pdf/renderer";
import { VolunteerTerminationPDF } from "@/components/pdf/volunteer-termination-pdf";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FileDown, CheckCircle } from "lucide-react";

const formSchema = z.object({
    volunteerId: z.string().optional(),
    fullName: z.string().optional(),
    dateOfBirth: z.string().optional(),
    terminationDate: z.string().min(1, "Data de encerramento é obrigatória"),
    terminationReason: z.string().optional(),
}).superRefine((data, ctx) => {
    if (!data.volunteerId) {
        if (!data.fullName) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Nome completo é obrigatório",
                path: ["fullName"],
            });
        }
        if (!data.dateOfBirth) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Data de nascimento é obrigatória",
                path: ["dateOfBirth"],
            });
        }
    }
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
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successData, setSuccessData] = useState<any>(null);
    const [pendingValues, setPendingValues] = useState<FormData | null>(null);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            volunteerId: volunteerId || "",
            fullName: "",
            dateOfBirth: "",
            terminationDate: new Date().toISOString().split("T")[0],
            terminationReason: "",
        },
    });

    const handleFormSubmit = (values: FormData) => {
        setPendingValues(values);
        setShowConfirmation(true);
    };

    async function onConfirmTermination() {
        if (!pendingValues) {
            return;
        }

        setIsSubmitting(true);

        try {
            const data = {
                volunteerId: pendingValues.volunteerId,
                fullName: pendingValues.fullName,
                dateOfBirth: pendingValues.dateOfBirth ? new Date(pendingValues.dateOfBirth) : undefined,
                terminationDate: new Date(pendingValues.terminationDate),
                terminationReason: pendingValues.terminationReason,
            };

            const result = await terminateVolunteer(data);

            if (result.success) {
                setSuccessData(result.data);
                setShowConfirmation(false);
                setShowSuccessModal(true);
            } else {
                toast({
                    title: "Erro",
                    description: result.error as string,
                    variant: "destructive",
                });
                setShowConfirmation(false);
            }
        } catch (error) {
            toast({
                title: "Erro",
                description: "Ocorreu um erro ao encerrar o serviço voluntário.",
                variant: "destructive",
            });
            setShowConfirmation(false);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        router.push("/volunteers");
        router.refresh();
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Encerramento de Serviço Voluntário</CardTitle>
                            <CardDescription>
                                {volunteerName
                                    ? `Encerrar serviço de: ${volunteerName}`
                                    : "Informe os dados do voluntário para encerrar o serviço"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!volunteerId && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nome Completo do Voluntário *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Digite o nome completo" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Deve ser idêntico ao cadastro
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

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
                                </>
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

            {/* Confirmation Dialog */}
            <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza que deseja encerrar?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação irá alterar o status do voluntário para "Encerrado".
                            Você poderá baixar o termo de encerramento após confirmar.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                onConfirmTermination();
                            }}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Encerrar Voluntariado
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Success Modal with PDF */}
            <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-6 w-6" />
                            Serviço Encerrado com Sucesso!
                        </DialogTitle>
                        <DialogDescription>
                            O status do voluntário foi atualizado.
                            Baixe o termo de encerramento para assinatura.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex justify-center py-6">
                        {successData && (
                            <PDFDownloadLink
                                document={<VolunteerTerminationPDF data={successData} />}
                                fileName={`termo_encerramento_${successData.fullName.replace(/\s+/g, "_").toLowerCase()}.pdf`}
                            >
                                {({ loading }) => (
                                    <Button disabled={loading} className="w-full" variant="outline">
                                        {loading ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <FileDown className="mr-2 h-4 w-4" />
                                        )}
                                        Baixar Termo de Encerramento (PDF)
                                    </Button>
                                )}
                            </PDFDownloadLink>
                        )}
                    </div>

                    <DialogFooter>
                        <Button onClick={handleCloseSuccessModal}>
                            Fechar e Voltar para Lista
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
