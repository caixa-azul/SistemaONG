"use server";

// ⬅️ ORIGEM: zod (Biblioteca de validação)
import { z } from "zod";
// ⬅️ ORIGEM: /lib/prisma.ts (Conexão Singleton)
import { prisma } from "@/lib/prisma";
// ⬅️ ORIGEM: next/cache (Utilidade do Next.js para limpar cache de rota)
import { revalidatePath } from "next/cache";
// ⬅️ ORIGEM: next/navigation (Redirecionamento server-side)
import { redirect } from "next/navigation";
// ⬅️ ORIGEM: @prisma/client (Tipos gerados automaticamente pelo Prisma)
import { Prisma } from "@prisma/client";
// ⬅️ ORIGEM: /types/index.ts (Enums e tipos globais)
import { DonationType, FinancialMethod, UnitOfMeasure } from "@/types";
// ⬅️ ORIGEM: /auth.ts (Sessão do usuário)
import { auth } from "@/auth";

// ⬅️ ORIGEM: /types/index.ts (Tipo para Server Actions com useFormState)
import { State } from "@/types";

const CreateDonationSchema = z.object({
    type: z.nativeEnum(DonationType),
    donorName: z.string().optional(),
    donorEmail: z.string().email().optional().or(z.literal("")),
    donorPhone: z.string().optional(),
    anonymous: z.coerce.boolean(),
    // Financial
    amount: z.coerce.number().optional(),
    method: z.nativeEnum(FinancialMethod).optional(),
    // Material
    itemName: z.string().optional(),
    quantity: z.coerce.number().optional(),
    unit: z.nativeEnum(UnitOfMeasure).optional(),
});

// ➡️ DESTINO: Usado por /components/forms/donation-form.tsx
export async function createDonation(prevState: State, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { message: "Unauthorized" };
    }

    const validatedFields = CreateDonationSchema.safeParse({
        type: formData.get("type"),
        donorName: formData.get("donorName"),
        donorEmail: formData.get("donorEmail"),
        donorPhone: formData.get("donorPhone"),
        anonymous: formData.get("anonymous"),
        amount: formData.get("amount"),
        method: formData.get("method"),
        itemName: formData.get("itemName"),
        quantity: formData.get("quantity"),
        unit: formData.get("unit"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Donation.",
        };
    }

    const { type, donorName, donorEmail, donorPhone, anonymous, amount, method, itemName, quantity, unit } = validatedFields.data;

    try {
        // 🧠 TRANSACTION: Executa múltiplas operações no banco como se fossem uma só.
        // Se falhar em criar a doação OU atualizar o estoque, TUDO é cancelado (Rollback).
        // Isso garante que nunca teremos dados inconsistentes (ex: doação sem estoque).
        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // 1. Create Donation Record
            const donation = await tx.donation.create({
                data: {
                    type,
                    donorName,
                    donorEmail,
                    donorPhone,
                    anonymous,
                    amount: amount ? amount : undefined,
                    method: method ? method : undefined,
                    itemName: itemName ? itemName : undefined,
                    quantity: quantity ? quantity : undefined,
                    unit: unit ? unit : undefined,
                    registeredById: session.user.id,
                },
            });

            // 2. Update Ledger or Inventory
            // 🧠 LOGIC: Dependendo do tipo de doação, atualizamos tabelas diferentes.
            if (type === "FINANCIAL" && amount) {
                await tx.financialLedger.create({
                    data: {
                        description: `Donation from ${anonymous ? "Anonymous" : donorName || "Unknown"}`,
                        amount: amount,
                        balanceAfter: 0, // TODO: Calculate actual balance
                        donationId: donation.id,
                    },
                });
                // Nota: O cálculo do saldo normalmente exigiria buscar o último saldo.
                // Para este boilerplate, poderíamos precisar de um sistema de razão mais robusto ou um trigger.
                // Simplificado por enquanto.
            } else if (type === "MATERIAL" && itemName && quantity && unit) {
                // Check if item exists
                const existingItem = await tx.inventory.findUnique({
                    where: { itemName },
                });

                if (existingItem) {
                    // ⚡ INCREMENT: O Prisma tem operações atômicas.
                    // `increment: quantity` é mais seguro que ler, somar e salvar (evita Race Conditions).
                    await tx.inventory.update({
                        where: { id: existingItem.id },
                        data: { quantity: { increment: quantity } },
                    });
                } else {
                    await tx.inventory.create({
                        data: {
                            itemName,
                            quantity,
                            unit,
                            donationId: donation.id, // Vincular à primeira doação deste item? Ou talvez apenas rastrear.
                            // O schema tem donationId único no Inventory, o que implica 1:1.
                            // Isso pode ser uma limitação de design do schema se quisermos rastrear estoque de múltiplas doações.
                            // Por enquanto, vamos ignorar vincular donationId diretamente ao Inventory se for um agregado.
                            // Na verdade, o schema diz: donationId String? @unique.
                            // Isso significa que um item de estoque pode ser vinculado a UMA doação.
                            // Isso é provável para rastreamento de "Ativo" em vez de rastreamento de "Commodity".
                            // Mas para "Arroz", recebemos múltiplas doações.
                            // Vamos apenas atualizar a quantidade e NÃO definir donationId se já existir.
                        },
                    });
                }
            }
        });
    } catch (error) {
        console.error(error);
        return {
            message: "Database Error: Failed to Create Donation.",
        };
    }

    revalidatePath("/donations");
    redirect("/donations");
}
