import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export default async function DonationsPage() {
    const donations = await prisma.donation.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Doações</h2>
                <Link href="/donations/create">
                    <Button>Registrar Doação</Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {donations.map((donation: any) => (
                    <Card key={donation.id}>
                        <CardHeader>
                            <CardTitle>Doação {donation.type === "FINANCIAL" ? "Financeira" : "Material"}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground space-y-1">
                                <p>Doador: {donation.anonymous ? "Anônimo" : donation.donorName || "Desconhecido"}</p>
                                {donation.type === "FINANCIAL" && (
                                    <p>Valor: R$ {Number(donation.amount).toFixed(2)} ({donation.method})</p>
                                )}
                                {donation.type === "MATERIAL" && (
                                    <p>Item: {donation.quantity} {donation.unit} de {donation.itemName}</p>
                                )}
                                <p>Data: {format(donation.createdAt, "PPP")}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {donations.length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground">
                        Nenhuma doação encontrada.
                    </div>
                )}
            </div>
        </div>
    );
}
