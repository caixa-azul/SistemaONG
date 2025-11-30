"use server";

// ⬅️ ORIGEM: zod (Biblioteca de validação)
import { z } from "zod";
// ⬅️ ORIGEM: /lib/prisma.ts (Conexão Singleton com o Banco de Dados)
import { prisma } from "@/lib/prisma";
// ⬅️ ORIGEM: next/cache (Utilidade do Next.js para limpar cache de rota)
import { revalidatePath } from "next/cache";
// ⬅️ ORIGEM: next/navigation (Redirecionamento server-side)
import { redirect } from "next/navigation";
// ⬅️ ORIGEM: /types/index.ts (Enums e tipos globais)
import { UnitOfMeasure } from "@/types";
// ⬅️ ORIGEM: /auth.ts (Sessão do usuário)
import { auth } from "@/auth";

// ⬅️ ORIGEM: /types/index.ts (Tipo para Server Actions com useFormState)
import { State } from "@/types";

const InventorySchema = z.object({
    itemName: z.string().min(1, "Item name is required"),
    quantity: z.coerce.number().min(0),
    unit: z.nativeEnum(UnitOfMeasure),
    minThreshold: z.coerce.number().min(0).optional(),
});

// ➡️ DESTINO: Usado por /components/forms/inventory-form.tsx
export async function createInventoryItem(prevState: State, formData: FormData) {
    // 🛡️ AUTH CHECK: Apenas usuários logados podem criar itens.
    const session = await auth();
    if (!session?.user) {
        return { message: "Unauthorized", errors: {} };
    }

    // 🛡️ ZOD PARSE: Valida os dados do formulário.
    const validatedFields = InventorySchema.safeParse({
        itemName: formData.get("itemName"),
        quantity: formData.get("quantity"),
        unit: formData.get("unit"),
        minThreshold: formData.get("minThreshold"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Item.",
        };
    }

    const { itemName, quantity, unit, minThreshold } = validatedFields.data;

    try {
        await prisma.inventory.create({
            data: {
                itemName,
                quantity,
                unit,
                minThreshold: minThreshold || 5,
            },
        });
    } catch (_error) {
        // 🧠 ERROR HANDLING: Se o item já existe (Unique Constraint), o Prisma lança erro.
        return {
            message: "Database Error: Failed to Create Item. Item name might already exist.",
        };
    }

    // ⚡ REVALIDATE: Limpa o cache da página de inventário para mostrar o novo item.
    revalidatePath("/inventory");
    redirect("/inventory");
}

// ➡️ DESTINO: Usado por /components/forms/inventory-form.tsx
export async function updateInventoryItem(id: string, prevState: State, formData: FormData) {
    const session = await auth();
    if (!session?.user) {
        return { message: "Unauthorized", errors: {} };
    }

    const validatedFields = InventorySchema.safeParse({
        itemName: formData.get("itemName"),
        quantity: formData.get("quantity"),
        unit: formData.get("unit"),
        minThreshold: formData.get("minThreshold"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Update Item.",
        };
    }

    const { itemName, quantity, unit, minThreshold } = validatedFields.data;

    try {
        await prisma.inventory.update({
            where: { id },
            data: {
                itemName,
                quantity,
                unit,
                minThreshold,
            },
        });
    } catch (_error) {
        return {
            message: "Database Error: Failed to Update Item.",
        };
    }

    revalidatePath("/inventory");
    redirect("/inventory");
}
