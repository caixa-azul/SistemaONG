import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export default async function FinancialPage() {
    // 🧠 LEDGER LOGIC: O livro-razão (ledger) armazena cada transação.
    // O saldo atual é simplesmente o `balanceAfter` da transação mais recente.
    const ledger = await prisma.financialLedger.findMany({
        orderBy: { date: "desc" },
    });

    const currentBalance = ledger.length > 0 ? Number(ledger[0].balanceAfter) : 0;

    return (
        <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Registro Financeiro</h2>
                <div className="text-2xl font-bold">
                    Saldo: R$ {currentBalance.toFixed(2)}
                </div>
            </div>

            <div className="rounded-md border">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground">
                        <tr>
                            <th className="p-4 font-medium">Data</th>
                            <th className="p-4 font-medium">Descrição</th>
                            <th className="p-4 font-medium text-right">Valor</th>
                            <th className="p-4 font-medium text-right">Saldo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ledger.map((entry: any) => (
                            <tr key={entry.id} className="border-t">
                                <td className="p-4">{format(entry.date, "PPP")}</td>
                                <td className="p-4">{entry.description}</td>
                                <td className={`p-4 text-right ${Number(entry.amount) >= 0 ? "text-green-600" : "text-red-600"}`}>
                                    {Number(entry.amount) >= 0 ? "+" : ""}{Number(entry.amount).toFixed(2)}
                                </td>
                                <td className="p-4 text-right font-medium">
                                    {Number(entry.balanceAfter).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                        {ledger.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-4 text-center text-muted-foreground">
                                    Nenhuma transação encontrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
