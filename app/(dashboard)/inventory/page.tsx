import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export default async function InventoryPage() {
    const inventory = await prisma.inventory.findMany({
        orderBy: { itemName: "asc" },
    });

    return (
        <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Estoque</h2>
                {/* Add Item button could go here */}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {inventory.map((item: any) => (
                    // 🧠 CONDITIONAL STYLING: Se o estoque estiver baixo, mudamos a cor da borda.
                    // Isso ajuda o usuário a identificar problemas rapidamente.
                    <Card key={item.id} className={item.quantity <= item.minThreshold ? "border-red-500" : ""}>
                        <CardHeader>
                            <CardTitle>{item.itemName}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground space-y-1">
                                <p className="text-2xl font-bold text-foreground">{item.quantity} {item.unit}</p>
                                <p>Limite Mínimo: {item.minThreshold}</p>
                                <p>Última Atualização: {format(item.updatedAt, "PPP")}</p>
                                {item.quantity <= item.minThreshold && (
                                    <p className="text-red-500 font-medium">Estoque Baixo!</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {inventory.length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground">
                        Estoque vazio.
                    </div>
                )}
            </div>
        </div>
    );
}
