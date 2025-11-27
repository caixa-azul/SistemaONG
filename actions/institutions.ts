"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { institutionSchema, institutionalDistributionSchema } from "@/lib/schemas/domain";
import { auth } from "@/auth";

/**
 * Create a new institution
 */
export async function createInstitution(data: unknown) {
    try {
        const session = await auth();
        if (!session) return { success: false, error: "Unauthorized" };

        const validatedData = institutionSchema.parse(data);

        const institution = await prisma.institution.create({
            data: {
                name: validatedData.name,
                cnpj: validatedData.cnpj,
                email: validatedData.email,
                phone: validatedData.phone,
                addressId: validatedData.addressId,
                contactPersonName: validatedData.contactPersonName,
                contactPersonCPF: validatedData.contactPersonCPF,
            },
            include: {
                address: true,
            },
        });

        revalidatePath("/distributions/institutional");

        return { success: true, data: institution };
    } catch (error: any) {
        console.error("Error creating institution:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Create institution with address
 */
export async function createInstitutionWithAddress(
    institutionData: any,
    addressData: any
) {
    try {
        const session = await auth();
        if (!session) return { success: false, error: "Unauthorized" };

        const institution = await prisma.$transaction(async (tx) => {
            const address = await tx.address.create({
                data: addressData,
            });

            const newInstitution = await tx.institution.create({
                data: {
                    ...institutionData,
                    addressId: address.id,
                },
                include: {
                    address: true,
                },
            });

            return newInstitution;
        });

        revalidatePath("/distributions/institutional");

        return { success: true, data: institution };
    } catch (error: any) {
        console.error("Error creating institution with address:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Get all institutions
 */
export async function getInstitutions() {
    try {
        const session = await auth();
        if (!session) return { success: false, error: "Unauthorized" };

        const institutions = await prisma.institution.findMany({
            include: {
                address: true,
                distributions: {
                    orderBy: {
                        deliveryDate: "desc",
                    },
                    take: 5,
                },
            },
            orderBy: {
                name: "asc",
            },
        });

        return { success: true, data: institutions };
    } catch (error: any) {
        console.error("Error fetching institutions:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Get institution by ID
 */
export async function getInstitutionById(id: string) {
    try {
        const session = await auth();
        if (!session) return { success: false, error: "Unauthorized" };

        const institution = await prisma.institution.findUnique({
            where: { id },
            include: {
                address: true,
                distributions: {
                    include: {
                        items: true,
                    },
                    orderBy: {
                        deliveryDate: "desc",
                    },
                },
            },
        });

        if (!institution) {
            return { success: false, error: "Instituição não encontrada" };
        }

        return { success: true, data: institution };
    } catch (error: any) {
        console.error("Error fetching institution:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Create institutional distribution
 */
export async function createInstitutionalDistribution(data: unknown) {
    try {
        const session = await auth();
        if (!session) return { success: false, error: "Unauthorized" };

        const validatedData = institutionalDistributionSchema.parse(data);

        const distribution = await prisma.$transaction(async (tx) => {
            const newDistribution = await tx.institutionalDistribution.create({
                data: {
                    institutionId: validatedData.institutionId,
                    distributionType: validatedData.distributionType,
                    program: validatedData.program,
                    deliveryDate: validatedData.deliveryDate,
                    recipientSignaturePath: validatedData.recipientSignaturePath,
                    observations: validatedData.observations,
                    createdById: session.user.id,
                },
            });

            // Criar itens da distribuição
            if (validatedData.items && validatedData.items.length > 0) {
                await tx.distributionItem.createMany({
                    data: validatedData.items.map((item: any) => ({
                        distributionId: newDistribution.id,
                        itemName: item.itemName,
                        quantity: item.quantity,
                        observations: item.observations,
                    })),
                });
            }

            // Buscar distribuição completa com itens
            const completeDistribution = await tx.institutionalDistribution.findUnique({
                where: { id: newDistribution.id },
                include: {
                    institution: true,
                    items: true,
                },
            });

            return completeDistribution;
        });

        revalidatePath("/distributions/institutional");
        revalidatePath(`/institutions/${validatedData.institutionId}`);

        return { success: true, data: distribution };
    } catch (error: any) {
        console.error("Error creating institutional distribution:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Get all institutional distributions
 */
export async function getInstitutionalDistributions() {
    try {
        const session = await auth();
        if (!session) return { success: false, error: "Unauthorized" };

        const distributions = await prisma.institutionalDistribution.findMany({
            include: {
                institution: {
                    select: {
                        id: true,
                        name: true,
                        cnpj: true,
                        contactPersonName: true,
                    },
                },
                items: true,
            },
            orderBy: {
                deliveryDate: "desc",
            },
        });

        return { success: true, data: distributions };
    } catch (error: any) {
        console.error("Error fetching institutional distributions:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Get institutional distribution statistics
 */
export async function getInstitutionalDistributionStats() {
    try {
        const session = await auth();
        if (!session) return { success: false, error: "Unauthorized" };

        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const totalInstitutions = await prisma.institution.count();

        const totalDistributions = await prisma.institutionalDistribution.count();

        const distributionsThisMonth = await prisma.institutionalDistribution.count({
            where: {
                deliveryDate: { gte: firstDayOfMonth },
            },
        });

        const conabDistributions = await prisma.institutionalDistribution.count({
            where: {
                program: "CONAB",
            },
        });

        return {
            success: true,
            data: {
                totalInstitutions,
                totalDistributions,
                thisMonth: distributionsThisMonth,
                conab: conabDistributions,
            },
        };
    } catch (error: any) {
        console.error("Error fetching institutional distribution stats:", error);
        return { success: false, error: error.message };
    }
}
