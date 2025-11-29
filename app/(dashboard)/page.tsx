import { prisma } from "@/lib/prisma";
// ⚡ FORCE DYNAMIC: Por padrão, o Next.js tenta criar páginas estáticas (SSG).
// Como nosso dashboard muda o tempo todo (novos dados), forçamos ele a ser dinâmico (SSR).
// Isso garante que o usuário sempre veja os dados mais recentes.
export const dynamic = 'force-dynamic';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, HeartHandshake, Package, DollarSign } from "lucide-react";

// ⚡ SERVER COMPONENT: Esta página roda inteiramente no servidor.
// Podemos fazer chamadas diretas ao banco de dados (Prisma) aqui.
export default async function DashboardPage() {
    // 🧠 PARALLEL FETCHING: Em uma aplicação real, poderíamos usar Promise.all
    // para buscar esses dados em paralelo e deixar a página mais rápida.
    // Por enquanto, buscamos sequencialmente para facilitar a leitura.

    // 🧠 COUNT: O Prisma é muito eficiente em contar registros.
    // `count()` é muito mais rápido que buscar tudo (`findMany`) e contar o array.
    const totalBeneficiaries = await prisma.beneficiary.count();
    const beneficiariesWithAssessment = await prisma.beneficiary.count({
        where: { socialAssessment: { isNot: null } }
    });
    const totalDonations = await prisma.donation.count();

    // Calculate total financial donations
    const financialDonations = await prisma.donation.findMany({
        where: { type: "FINANCIAL" },
        select: { amount: true },
    });
    const totalFinancialAmount = financialDonations.reduce((acc: number, curr: { amount: any }) => acc + Number(curr.amount || 0), 0);

    const lowStockItems = await prisma.inventory.count({
        where: {
            quantity: { lte: 5 }
        }
    });

    // Buscar todo o estoque para contar estoque baixo corretamente
    const allInventory = await prisma.inventory.findMany();
    const lowStockCount = allInventory.filter((item: any) => item.quantity <= item.minThreshold).length;

    // Count family distributions this month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const familyDistributionsThisMonth = await prisma.familyDistribution.count({
        where: {
            deliveryDate: { gte: firstDayOfMonth }
        }
    });

    const stats = [
        {
            title: "Total Beneficiários",
            value: totalBeneficiaries,
            description: `${beneficiariesWithAssessment} com avaliação`,
            icon: Users,
            color: "text-violet-500",
        },
        {
            title: "Total de Doações",
            value: totalDonations,
            description: "Todo o período",
            icon: HeartHandshake,
            color: "text-pink-700",
        },
        {
            title: "Arrecadação Financeira",
            value: `R$ ${totalFinancialAmount.toFixed(2)}`,
            description: "Total de doações financeiras",
            icon: DollarSign,
            color: "text-emerald-500",
        },
        {
            title: "Itens com Estoque Baixo",
            value: lowStockCount,
            description: "Itens abaixo do limite",
            icon: Package,
            color: "text-orange-700",
        },
    ];

    return (
        <div className="p-6 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Visão Geral</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
