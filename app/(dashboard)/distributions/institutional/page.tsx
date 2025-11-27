import Link from "next/link";
import {
    getInstitutions,
    getInstitutionalDistributions,
    getInstitutionalDistributionStats,
} from "@/actions/institutions";
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
import { Building2, Package, TrendingUp, Plus, Users } from "lucide-react";

export default async function InstitutionalDistributionsPage() {
    const statsResult = await getInstitutionalDistributionStats();
    const distributionsResult = await getInstitutionalDistributions();
    const institutionsResult = await getInstitutions();

    const stats = statsResult.success ? statsResult.data : null;
    const distributions = (distributionsResult.success && distributionsResult.data) ? distributionsResult.data : [];
    const institutions = (institutionsResult.success && institutionsResult.data) ? institutionsResult.data : [];

    const formatCNPJ = (cnpj: string) => {
        const cleaned = cnpj.replace(/\D/g, "");
        if (cleaned.length === 14) {
            return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
        }
        return cnpj;
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("pt-BR");
    };

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            ALIMENTOS_EVENTOS: "Alimentos de Eventos",
            ALIMENTOS_REGULARES: "Alimentos Regulares",
            ALIMENTOS_CONAB: "Alimentos CONAB",
            FRUTAS_VERDURAS_CONAB: "Frutas/Verduras CONAB",
        };
        return labels[type] || type;
    };

    const getProgramBadge = (program: string | null) => {
        if (!program) return null;

        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
            CONAB: "default",
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
                    <h1 className="text-3xl font-bold tracking-tight">Distribuições Institucionais</h1>
                    <p className="text-muted-foreground">
                        Gestão de parcerias e distribuições para organizações
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/distributions/institutional/institutions/new">
                        <Button variant="outline">
                            <Building2 className="mr-2 h-4 w-4" />
                            Nova Instituição
                        </Button>
                    </Link>
                    <Link href="/distributions/institutional/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nova Distribuição
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Instituições Parceiras</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalInstitutions || 0}</div>
                        <p className="text-xs text-muted-foreground">Organizações cadastradas</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Distribuições</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalDistributions || 0}</div>
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
                        <CardTitle className="text-sm font-medium">Programa CONAB</CardTitle>
                        <Package className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.conab || 0}</div>
                        <p className="text-xs text-muted-foreground">Distribuições CONAB</p>
                    </CardContent>
                </Card>
            </div>

            {/* Institutions List */}
            <Card>
                <CardHeader>
                    <CardTitle>Instituições Parceiras</CardTitle>
                    <CardDescription>Organizações cadastradas para distribuições</CardDescription>
                </CardHeader>
                <CardContent>
                    {institutions.length === 0 ? (
                        <div className="text-center py-8">
                            <Building2 className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                            <h3 className="mt-4 text-lg font-semibold">Nenhuma instituição cadastrada</h3>
                            <p className="text-muted-foreground mt-2 mb-4">
                                Cadastre a primeira instituição parceira
                            </p>
                            <Link href="/distributions/institutional/institutions/new">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nova Instituição
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {institutions.map((inst: any) => (
                                <Card key={inst.id}>
                                    <CardHeader>
                                        <CardTitle className="text-base">{inst.name}</CardTitle>
                                        <CardDescription>CNPJ: {formatCNPJ(inst.cnpj)}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-sm space-y-1">
                                            <p><strong>Responsável:</strong> {inst.contactPersonName}</p>
                                            {inst.phone && <p><strong>Telefone:</strong> {inst.phone}</p>}
                                            {inst.distributions && inst.distributions.length > 0 && (
                                                <p className="text-muted-foreground mt-2">
                                                    {inst.distributions.length} distribuições registradas
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Distributions History */}
            <Card>
                <CardHeader>
                    <CardTitle>Histórico de Distribuições</CardTitle>
                    <CardDescription>Entregas realizadas para instituições</CardDescription>
                </CardHeader>
                <CardContent>
                    {distributions.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                            <h3 className="mt-4 text-lg font-semibold">Nenhuma distribuição registrada</h3>
                            <p className="text-muted-foreground mt-2 mb-4">
                                Registre a primeira distribuição institucional
                            </p>
                            <Link href="/distributions/institutional/new">
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
                                    <TableHead>Instituição</TableHead>
                                    <TableHead>CNPJ</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Programa</TableHead>
                                    <TableHead>Itens</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {distributions.map((dist: any) => (
                                    <TableRow key={dist.id}>
                                        <TableCell>{formatDate(dist.deliveryDate)}</TableCell>
                                        <TableCell className="font-medium">{dist.institution.name}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {formatCNPJ(dist.institution.cnpj)}
                                        </TableCell>
                                        <TableCell>{getTypeLabel(dist.distributionType)}</TableCell>
                                        <TableCell>{getProgramBadge(dist.program)}</TableCell>
                                        <TableCell>{dist.items?.length || 0} itens</TableCell>
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
