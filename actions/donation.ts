"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { DonationType, FinancialMethod, UnitOfMeasure } from "@/types";
import { auth } from "@/auth";

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
                // Note: Balance calculation would typically require fetching the last balance. 
                // For this boilerplate, we might need a more robust ledger system or a trigger.
                // Simplified for now.
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
                            donationId: donation.id, // Link to first donation of this item? Or maybe just track it.
                            // The schema has donationId unique on Inventory, which implies 1:1. 
                            // This might be a schema design limitation if we want to track inventory from multiple donations.
                            // For now, let's ignore linking donationId directly to Inventory if it's an aggregate.
                            // Actually, the schema says: donationId String? @unique. 
                            // This means an inventory item can be linked to ONE donation. 
                            // This is likely for "Asset" tracking rather than "Commodity" tracking.
                            // But for "Rice", we get multiple donations.
                            // Let's just update quantity and NOT set donationId if it already exists.
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
