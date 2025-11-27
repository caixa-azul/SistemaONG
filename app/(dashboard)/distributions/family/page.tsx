import Link from "next/link";
import { getFamilyDistributions, getFamilyDistributionStats } from "@/actions/distributions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Package, Users, TrendingUp, Plus } from "lucide-react";

export default async function FamilyDistributionsPage() {
    const statsResult = await getFamilyDistributionStats();
    const distributionsResult = await getFamilyDistributions();

    const stats = statsResult.success ? statsResult.data : null;
    const distributions = (distributionsResult.success && distributionsResult.data) ? distributionsResult.data : [];

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

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            KIT_ALIMENTO_GENERICO: "Kit Genérico",
            KIT_ALIMENTO_FAMILIA: "Kit Família",
            KIT_ALIMENTO_ACOLHIMENTO: "Kit Acolhimento",
            LEITE_CONAB: "Leite CONAB",
        };
        return labels[type] || type;
    };

    const getProgramBadge = (program: string | null) => {
        if (!program) return null;

        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
            CONAB: "default",
            ACOLHIMENTO: "secondary",
            REGULAR: "outline",
            EVENTO: "destructive",
        };

        return (
            <Badge variant={variants[program] || "outline"}>
                {program}
            </Badge>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Distribuições Familiares</h1>
                    <p className="text-muted-foreground">
                        Gestão de kits de alimentos e programas sociais
                    </p>
                </div>
                <Link href="/distributions/family/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Distribuição
                    </Button>
                </Link>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Distribuições</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.total || 0}</div>
                        <p className="text-xs text-muted-foreground">Desde o início</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.thisMonth || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Entregas em {new Date().toLocaleDateString("pt-BR", { month: "long" })}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Famílias Atendidas</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.uniqueBeneficiaries || 0}</div>
                        <p className="text-xs text-muted-foreground">Beneficiários únicos</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Programa CONAB</CardTitle>
                        <Package className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.conab || 0}</div>
                        <p className="text-xs text-muted-foreground">Entregas CONAB</p>
                    </CardContent>
                </Card>
            </div>

            {/* Distributions Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Histórico de Distribuições</CardTitle>
                    <CardDescription>Lista completa de entregas registradas</CardDescription>
                </CardHeader>
                <CardContent>
                    {distributions.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                            <h3 className="mt-4 text-lg font-semibold">Nenhuma distribuição registrada</h3>
                            <p className="text-muted-foreground mt-2 mb-4">
                                Comece registrando a primeira distribuição familiar
                            </p>
                            <Link href="/distributions/family/new">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nova Distribuição
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Beneficiário</TableHead>
                                    <TableHead>CPF</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Programa</TableHead>
                                    <TableHead>Quantidade</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {distributions.map((dist: any) => (
                                    <TableRow key={dist.id}>
                                        <TableCell>{formatDate(dist.deliveryDate)}</TableCell>
                                        <TableCell className="font-medium">{dist.beneficiary.fullName}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {formatCPF(dist.beneficiary.cpf)}
                                        </TableCell>
                                        <TableCell>{getTypeLabel(dist.distributionType)}</TableCell>
                                        <TableCell>{getProgramBadge(dist.program)}</TableCell>
                                        <TableCell>{dist.quantity}</TableCell>
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
