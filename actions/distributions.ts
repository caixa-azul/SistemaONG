"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { familyDistributionSchema } from "@/lib/schemas/domain";
import { auth } from "@/auth";

/**
 * Create a new family distribution
 */
export async function createFamilyDistribution(data: unknown) {
    try {
        const session = await auth();
        if (!session) return { success: false, error: "Unauthorized" };

        const validatedData = familyDistributionSchema.parse(data);

        const distribution = await prisma.familyDistribution.create({
            data: {
                beneficiaryId: validatedData.beneficiaryId,
                distributionType: validatedData.distributionType,
                program: validatedData.program,
                quantity: validatedData.quantity,
                deliveryDate: validatedData.deliveryDate,
                signaturePath: validatedData.signaturePath,
                observations: validatedData.observations,
                createdById: session.user.id, // 🛡️ AUDIT: Registramos QUEM fez a entrega.
            },
            include: {
                beneficiary: {
                    select: {
                        fullName: true,
                        cpf: true,
                    },
                },
            },
        });

        // ⚡ REVALIDATE PATH: Atualiza DUAS páginas diferentes.
        // 1. A lista geral de distribuições.
        // 2. O perfil do beneficiário (que mostra o histórico dele).
        revalidatePath("/distributions/family");
        revalidatePath(`/beneficiaries/${validatedData.beneficiaryId}`);

        return { success: true, data: distribution };
    } catch (error: any) {
        console.error("Error creating family distribution:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Get all family distributions with beneficiary details
 */
export async function getFamilyDistributions() {
    try {
        const session = await auth();
        if (!session) return { success: false, error: "Unauthorized" };

        const distributions = await prisma.familyDistribution.findMany({
            include: {
                beneficiary: {
                    select: {
                        id: true,
                        fullName: true,
                        cpf: true,
                        phoneNumber: true,
                    },
                },
            },
            orderBy: {
                deliveryDate: "desc",
            },
        });

        return { success: true, data: distributions };
    } catch (error: any) {
        console.error("Error fetching family distributions:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Get family distribution by ID
 */
export async function getFamilyDistributionById(id: string) {
    try {
        const session = await auth();
        if (!session) return { success: false, error: "Unauthorized" };

        const distribution = await prisma.familyDistribution.findUnique({
            where: { id },
            include: {
                beneficiary: {
                    select: {
                        id: true,
                        fullName: true,
                        cpf: true,
                        rg: true,
                        phoneNumber: true,
                        address: true,
                    },
                },
            },
        });

        if (!distribution) {
            return { success: false, error: "Distribuição não encontrada" };
        }

        return { success: true, data: distribution };
    } catch (error: any) {
        console.error("Error fetching family distribution:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Get distributions by beneficiary ID
 */
export async function getFamilyDistributionsByBeneficiary(beneficiaryId: string) {
    try {
        const session = await auth();
        if (!session) return { success: false, error: "Unauthorized" };

        const distributions = await prisma.familyDistribution.findMany({
            where: { beneficiaryId },
            orderBy: {
                deliveryDate: "desc",
            },
        });

        return { success: true, data: distributions };
    } catch (error: any) {
        console.error("Error fetching distributions:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Get distribution statistics
 */
export async function getFamilyDistributionStats() {
    try {
        const session = await auth();
        if (!session) return { success: false, error: "Unauthorized" };

        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const totalDistributions = await prisma.familyDistribution.count();

        const distributionsThisMonth = await prisma.familyDistribution.count({
            where: {
                deliveryDate: { gte: firstDayOfMonth },
            },
        });

        const conabDistributions = await prisma.familyDistribution.count({
            where: {
                program: "CONAB",
            },
        });

        const uniqueBeneficiaries = await prisma.familyDistribution.findMany({
            select: { beneficiaryId: true },
            distinct: ["beneficiaryId"],
        });

        return {
            success: true,
            data: {
                total: totalDistributions,
                thisMonth: distributionsThisMonth,
                conab: conabDistributions,
                uniqueBeneficiaries: uniqueBeneficiaries.length,
            },
        };
    } catch (error: any) {
        console.error("Error fetching distribution stats:", error);
        return { success: false, error: error.message };
    }
}
