'use server';

// ⬅️ ORIGEM: /lib/prisma.ts (Conexão Singleton com o Banco de Dados)
import { prisma } from '@/lib/prisma';
// ⬅️ ORIGEM: @prisma/client (Tipos gerados automaticamente pelo Prisma)
import { FamilyDistribution, Prisma } from '@prisma/client';

// 🧠 TYPES: Definimos os tipos dos filtros para garantir que o frontend envie os dados certos.
// ➡️ DESTINO: Usado por /app/(dashboard)/distributions/family/page.tsx (Tipagem de props)
export type DistributionFilters = {
    search?: string;
    startDate?: string;
    endDate?: string;
    programs?: string[];
    page?: number;
    pageSize?: number;
};

// ➡️ DESTINO: Usado internamente e por componentes de lista
export type FilteredDistributionResult = {
    data: (FamilyDistribution & {
        beneficiary: {
            fullName: string;
            cpf: string;
        };
    })[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
};

// ⚡ SERVER ACTION: Esta função roda exclusivamente no servidor.
// Ela recebe os filtros do frontend e constrói a query do banco de dados.
// ➡️ DESTINO: Usado por /app/(dashboard)/distributions/family/page.tsx (Busca com filtros)
export async function getFilteredDistributions(
    filters: DistributionFilters
): Promise<FilteredDistributionResult> {
    const {
        search,
        startDate,
        endDate,
        programs,
        page = 1,
        pageSize = 10,
    } = filters;

    // 🧠 DYNAMIC QUERY: Começamos com um objeto vazio e vamos adicionando regras.
    // Se o filtro não existir, não adicionamos nada (traz tudo).
    const where: Prisma.FamilyDistributionWhereInput = {};

    // 1. Busca por Texto (Nome do Beneficiário ou CPF)
    // Usamos 'contains' para buscar partes do texto e 'mode: insensitive' para ignorar maiúsculas/minúsculas.
    if (search) {
        where.beneficiary = {
            OR: [
                { fullName: { contains: search, mode: 'insensitive' } },
                { cpf: { contains: search } },
            ],
        };
    }

    // 2. Filtro por Data (Intervalo)
    if (startDate || endDate) {
        where.deliveryDate = {};
        if (startDate) {
            // gte = Greater Than or Equal (Maior ou igual)
            where.deliveryDate.gte = new Date(startDate);
        }
        if (endDate) {
            // Ajustamos para o final do dia para pegar todas as distribuições daquele dia.
            // lte = Less Than or Equal (Menor ou igual)
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            where.deliveryDate.lte = end;
        }
    }

    // 3. Filtro por Programas (Multi-seleção)
    if (programs && programs.length > 0) {
        // 'in': Busca registros onde o programa está DENTRO da lista selecionada.
        where.program = {
            in: programs as any,
        };
    }

    // 🧠 PAGINAÇÃO: Calculamos quantos registros pular (skip) baseados na página atual.
    const skip = (page - 1) * pageSize;

    // ⚡ PARALLEL QUERIES: Rodamos duas buscas ao mesmo tempo:
    // 1. Os dados da página atual.
    // 2. O total de registros (para saber quantas páginas existem).
    const [data, total] = await Promise.all([
        prisma.familyDistribution.findMany({
            where,
            include: {
                beneficiary: {
                    select: {
                        fullName: true,
                        cpf: true,
                    },
                },
            },
            orderBy: {
                deliveryDate: 'desc', // Mais recentes primeiro
            },
            skip,
            take: pageSize,
        }),
        prisma.familyDistribution.count({ where }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
        data,
        total,
        page,
        pageSize,
        totalPages,
    };
}
