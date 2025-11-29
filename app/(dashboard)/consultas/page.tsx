import { Suspense } from 'react';
import { getFilteredDistributions } from '@/actions/consultas';
import { FilterSidebar } from './filter-sidebar';
import { ResultsTable } from './results-table';
import { ConsultasReportPDF } from '@/components/pdf/consultas-report-pdf';
import { ActivityReport } from '@/components/pdf/activity-report';
import { PDFDownloadButton } from '@/components/pdf/pdf-download-button';

// ⚡ FORCE DYNAMIC: Forçamos a página a ser dinâmica (SSR) porque ela depende dos parâmetros da URL.
// Se fosse estática, o Next.js geraria o HTML uma vez e nunca mais mudaria.
export const dynamic = 'force-dynamic';

interface PageProps {
    // 🧠 SEARCH PARAMS: No Next.js 15+, searchParams é uma Promise!
    // Temos que usar 'await' para ler os parâmetros da URL (ex: ?search=maria).
    searchParams: Promise<{
        search?: string;
        startDate?: string;
        endDate?: string;
        programs?: string | string[];
        page?: string;
    }>;
}

// ⚡ SERVER COMPONENT: Esta página roda no servidor.
// Ela recebe os parâmetros da URL, busca os dados no banco e envia o HTML pronto.
export default async function ConsultasPage({ searchParams }: PageProps) {
    const params = await searchParams;

    // Normalização dos parâmetros
    const page = Number(params.page) || 1;
    const programs = Array.isArray(params.programs)
        ? params.programs
        : params.programs
            ? [params.programs]
            : [];

    const filters = {
        search: params.search,
        startDate: params.startDate,
        endDate: params.endDate,
        programs,
        page,
        pageSize: 10,
    };

    // 🧠 DATA FETCHING: Buscamos os dados filtrados direto do banco de dados.
    // Como estamos no servidor, isso é muito rápido e seguro.
    const results = await getFilteredDistributions(filters);

    // 🧠 REPORT DATA: Buscamos TODOS os dados (até 1000) para o relatório oficial.
    // Isso garante que o PDF tenha o mês inteiro, não só a página atual.
    // Diferente da tabela visual que é paginada, o relatório precisa ser completo.
    const reportResults = await getFilteredDistributions({ ...filters, pageSize: 1000, page: 1 });

    // Cálculo de Estatísticas para o Relatório
    const stats = {
        totalDistributions: reportResults.total,
        totalItems: reportResults.data.reduce((acc, item) => acc + item.quantity, 0),
        totalFamilies: new Set(reportResults.data.map(item => item.beneficiaryId)).size
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Consultas Avançadas</h1>
                    <p className="text-muted-foreground">
                        Explore os dados de distribuições e beneficiários.
                    </p>
                </div>
                <PDFDownloadButton
                    pdfDocument={
                        <ActivityReport
                            data={reportResults.data}
                            stats={stats}
                            filters={{ startDate: filters.startDate, endDate: filters.endDate }}
                        />
                    }
                    filename="relatorio-oficial-atividades"
                    label="Exportar Relatório Oficial"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                    <Suspense fallback={<div>Carregando filtros...</div>}>
                        <FilterSidebar />
                    </Suspense>
                </div>
                <div className="md:col-span-3">
                    <Suspense fallback={<div>Carregando resultados...</div>}>
                        <ResultsTable data={results} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
