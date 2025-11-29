"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { getBeneficiaryById } from "@/actions/beneficiaries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    FileText,
    Image,
    Utensils,
    Users,
    Package,
    Loader2,
    Plus,
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function BeneficiaryDetailsPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [beneficiary, setBeneficiary] = useState<any>(null);

    useEffect(() => {
        async function loadBeneficiary() {
            const result = await getBeneficiaryById(id);
            if (result.success && result.data) {
                setBeneficiary(result.data);
            }
            setLoading(false);
        }

        loadBeneficiary();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!beneficiary) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <p className="text-muted-foreground mb-4">Beneficiário não encontrado</p>
                <Button onClick={() => router.push("/beneficiaries")}>
                    Voltar para lista
                </Button>
            </div>
        );
    }

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
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push("/beneficiaries")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{beneficiary.fullName}</h1>
                        <p className="text-muted-foreground">CPF: {formatCPF(beneficiary.cpf)}</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => router.push(`/beneficiaries/${id}/assessment`)}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cadastro Socioeconômico</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {beneficiary.socialAssessment ? (
                            <Badge variant="secondary">Cadastrado</Badge>
                        ) : (
                            <Button size="sm" variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                Criar
                            </Button>
                        )}
                    </CardContent>
                </Card>

                <Card className="hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => router.push(`/beneficiaries/${id}/image-auth`)}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Autorização de Imagem</CardTitle>
                        <Image className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {beneficiary.imageAuthorization ? (
                            <Badge variant="secondary">Autorizado</Badge>
                        ) : (
                            <Button size="sm" variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                Criar
                            </Button>
                        )}
                    </CardContent>
                </Card>

                <Card className="hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => router.push(`/beneficiaries/${id}/referral`)}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Encaminhamento</CardTitle>
                        <Utensils className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Button size="sm" variant="outline">
                            <Plus className="mr-2 h-4 w-4" />
                            Novo
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Personal Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Informações Pessoais</CardTitle>
                </CardHeader>
                <CardContent>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Data de Nascimento</dt>
                            <dd className="text-sm">{formatDate(beneficiary.dateOfBirth)}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Gênero</dt>
                            <dd className="text-sm">{beneficiary.gender || "—"}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Raça/Cor</dt>
                            <dd className="text-sm">{beneficiary.race || "—"}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Estado Civil</dt>
                            <dd className="text-sm">{beneficiary.maritalStatus || "—"}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Telefone</dt>
                            <dd className="text-sm">{beneficiary.phoneNumber || "—"}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">E-mail</dt>
                            <dd className="text-sm">{beneficiary.email || "—"}</dd>
                        </div>
                    </dl>
                </CardContent>
            </Card>

            {/* Address */}
            {beneficiary.address && (
                <Card>
                    <CardHeader>
                        <CardTitle>Endereço</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">
                            {beneficiary.address.street}, {beneficiary.address.number}
                            {beneficiary.address.complement && `, ${beneficiary.address.complement}`}
                            <br />
                            {beneficiary.address.neighborhood} — {beneficiary.address.city}/{beneficiary.address.state}
                            {beneficiary.address.zipCode && <><br />CEP: {beneficiary.address.zipCode}</>}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Family Distributions */}
            {beneficiary.familyDistributions && beneficiary.familyDistributions.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Histórico de Distribuições</CardTitle>
                        <CardDescription>Kits de alimentos e programas</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Programa</TableHead>
                                    <TableHead>Quantidade</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {beneficiary.familyDistributions.map((dist: any) => (
                                    <TableRow key={dist.id}>
                                        <TableCell>{formatDate(dist.deliveryDate)}</TableCell>
                                        <TableCell>{dist.distributionType}</TableCell>
                                        <TableCell>{dist.program || "—"}</TableCell>
                                        <TableCell>{dist.quantity}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
