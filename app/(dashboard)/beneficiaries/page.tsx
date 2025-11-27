"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, FileText, Image, Utensils, Loader2 } from "lucide-react";
import { getBeneficiaries } from "@/actions/beneficiaries";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface BeneficiaryData {
    id: string;
    fullName: string;
    cpf: string;
    phoneNumber: string | null;
    createdAt: Date;
    socialAssessment: any | null;
    imageAuthorization: any | null;
}

export default function BeneficiariesPage() {
    const router = useRouter();
    const [beneficiaries, setBeneficiaries] = useState<BeneficiaryData[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        withAssessment: 0,
        withImageAuth: 0,
        withReferrals: 0,
    });

    useEffect(() => {
        async function loadBeneficiaries() {
            const result = await getBeneficiaries();
            if (result.success && result.data) {
                setBeneficiaries(result.data as any);

                // Calculate stats
                const total = result.data.length;
                const withAssessment = result.data.filter((b: any) => b.socialAssessment).length;
                const withImageAuth = result.data.filter((b: any) => b.imageAuthorization).length;

                setStats({
                    total,
                    withAssessment,
                    withImageAuth,
                    withReferrals: 0, // TODO: Add when referrals are included
                });
            }
            setLoading(false);
        }

        loadBeneficiaries();
    }, []);

    const formatCPF = (cpf: string) => {
        const cleaned = cpf.replace(/\D/g, "");
        if (cleaned.length === 11) {
            return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        }
        return cpf;
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("pt-BR");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Beneficiários</h1>
                    <p className="text-muted-foreground">
                        Gestão de cadastros socioeconômicos e documentação
                    </p>
                </div>
                <Button onClick={() => router.push("/beneficiaries/new")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Beneficiário
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total de Beneficiários
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">
                            Cadastros ativos
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Avaliações Sociais
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.withAssessment}</div>
                        <p className="text-xs text-muted-foreground">
                            Cadastros completos
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Autorizações de Imagem
                        </CardTitle>
                        <Image className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.withImageAuth}</div>
                        <p className="text-xs text-muted-foreground">
                            Documentos assinados
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Encaminhamentos
                        </CardTitle>
                        <Utensils className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.withReferrals}</div>
                        <p className="text-xs text-muted-foreground">
                            Para nutricionista
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de Beneficiários</CardTitle>
                    <CardDescription>
                        Cadastrados no sistema Além dos Olhos
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : beneficiaries.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <Users className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-sm text-muted-foreground mb-4">
                                Nenhum beneficiário cadastrado ainda
                            </p>
                            <Button onClick={() => router.push("/beneficiaries/new")}>
                                <Plus className="mr-2 h-4 w-4" />
                                Cadastrar Primeiro Beneficiário
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>CPF</TableHead>
                                    <TableHead>Telefone</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Cadastrado em</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {beneficiaries.map((beneficiary) => (
                                    <TableRow
                                        key={beneficiary.id}
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => router.push(`/beneficiaries/${beneficiary.id}`)}
                                    >
                                        <TableCell className="font-medium">{beneficiary.fullName}</TableCell>
                                        <TableCell>{formatCPF(beneficiary.cpf)}</TableCell>
                                        <TableCell>{beneficiary.phoneNumber || "—"}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                {beneficiary.socialAssessment && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        Avaliação
                                                    </Badge>
                                                )}
                                                {beneficiary.imageAuthorization && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        Imagem
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>{formatDate(beneficiary.createdAt)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/beneficiaries/${beneficiary.id}`);
                                                }}
                                            >
                                                Ver detalhes
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
