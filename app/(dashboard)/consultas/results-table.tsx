'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FilteredDistributionResult } from '@/actions/consultas';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ResultsTableProps {
    data: FilteredDistributionResult;
}

export function ResultsTable({ data }: ResultsTableProps) {
    const { replace } = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    // 🧠 PAGINAÇÃO:
    // Ao mudar de página, mantemos todos os filtros atuais e só mudamos o parâmetro 'page'.
    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        replace(`${pathname}?${params.toString()}`);
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    return (
        <div className="space-y-4">
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Beneficiário</TableHead>
                            <TableHead>CPF</TableHead>
                            <TableHead>Programa</TableHead>
                            <TableHead>Qtd</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                    Nenhum resultado encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{formatDate(item.deliveryDate)}</TableCell>
                                    <TableCell className="font-medium">{item.beneficiary.fullName}</TableCell>
                                    <TableCell>{item.beneficiary.cpf}</TableCell>
                                    <TableCell>{item.program || '-'}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    Página {data.page} de {data.totalPages || 1} ({data.total} registros)
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(data.page - 1)}
                        disabled={data.page <= 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(data.page + 1)}
                        disabled={data.page >= data.totalPages}
                    >
                        Próximo
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
