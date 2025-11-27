import Link from "next/link";
import { getVolunteers, getVolunteerStats } from "@/actions/volunteers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { UserCheck, Users, TrendingUp, Plus, UserX } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function VolunteersPage() {
    const statsResult = await getVolunteerStats();
    const volunteersResult = await getVolunteers();

    const stats = statsResult.success ? statsResult.data : null;
    const volunteers = (volunteersResult.success && volunteersResult.data) ? volunteersResult.data : [];

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

    const getStatusBadge = (status: string) => {
        if (status === "ACTIVE") {
            return <Badge variant="default">Ativo</Badge>;
        }
        return <Badge variant="destructive">Encerrado</Badge>;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Voluntários</h1>
                    <p className="text-muted-foreground">
                        Gestão de voluntários e serviço comunitário
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/volunteers/terminate">
                        <Button variant="outline">
                            <UserX className="mr-2 h-4 w-4" />
                            Encerrar Serviço
                        </Button>
                    </Link>
                    <Link href="/volunteers/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Voluntário
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Voluntários</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.total || 0}</div>
                        <p className="text-xs text-muted-foreground">Todos os cadastros</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Voluntários Ativos</CardTitle>
                        <UserCheck className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.active || 0}</div>
                        <p className="text-xs text-muted-foreground">Em atividade</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Novos Este Mês</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.newThisMonth || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Adesões em {new Date().toLocaleDateString("pt-BR", { month: "long" })}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Serviços Encerrados</CardTitle>
                        <UserX className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.terminated || 0}</div>
                        <p className="text-xs text-muted-foreground">Total de encerramentos</p>
                    </CardContent>
                </Card>
            </div>

            {/* Volunteers Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Voluntários</CardTitle>
                    <CardDescription>Todos os voluntários cadastrados no sistema</CardDescription>
                </CardHeader>
                <CardContent>
                    {volunteers.length === 0 ? (
                        <div className="text-center py-12">
                            <UserCheck className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                            <h3 className="mt-4 text-lg font-semibold">Nenhum voluntário cadastrado</h3>
                            <p className="text-muted-foreground mt-2 mb-4">
                                Cadastre o primeiro voluntário para o serviço comunitário
                            </p>
                            <Link href="/volunteers/new">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Novo Voluntário
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>CPF</TableHead>
                                    <TableHead>Telefone</TableHead>
                                    <TableHead>Data de Adesão</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Data de Encerramento</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {volunteers.map((volunteer: any) => (
                                    <TableRow key={volunteer.id}>
                                        <TableCell className="font-medium">{volunteer.fullName}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {formatCPF(volunteer.cpf)}
                                        </TableCell>
                                        <TableCell>{volunteer.phoneNumber}</TableCell>
                                        <TableCell>{formatDate(volunteer.joinDate)}</TableCell>
                                        <TableCell>{getStatusBadge(volunteer.status)}</TableCell>
                                        <TableCell>
                                            {volunteer.terminationDate
                                                ? formatDate(volunteer.terminationDate)
                                                : "-"}
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
