"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { State } from "@/types";

const TransactionSchema = z.object({
    description: z.string().min(1, "Description is required"),
    amount: z.coerce.number(), // Can be negative for expenses
});

export async function recordTransaction(prevState: State, formData: FormData) {
    const validatedFields = TransactionSchema.safeParse({
        description: formData.get("description"),
        amount: formData.get("amount"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Record Transaction.",
        };
    }

    const { description, amount } = validatedFields.data;

    try {
        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // Get last balance
            // 🧠 LOGIC: Para calcular o saldo atual, precisamos do saldo anterior.
            // Buscamos o último registro ordenado por data.
            const lastEntry = await tx.financialLedger.findFirst({
                orderBy: { date: 'desc' },
            });

            // 🧠 COERCION: O banco retorna Decimal, mas JavaScript trata como objeto ou string.
            // Convertemos para Number para fazer contas simples (cuidado com precisão em apps reais de banco!).
            const currentBalance = lastEntry ? Number(lastEntry.balanceAfter) : 0;
            const newBalance = currentBalance + amount;

            await tx.financialLedger.create({
                data: {
                    description,
                    amount,
                    balanceAfter: newBalance,
                },
            });
        });
    } catch (_error) {
        return {
            message: "Database Error: Failed to Record Transaction.",
        };
    }

    revalidatePath("/financial");
    redirect("/financial");
}
