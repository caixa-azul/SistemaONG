"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { volunteerSchema, volunteerTerminationSchema } from "@/lib/schemas/domain";
import { auth } from "@/auth";

/**
 * Create a new volunteer with address
 */
export async function createVolunteerWithAddress(
    volunteerData: any,
    addressData: any
) {
    try {
        const session = await auth();
        if (!session) return { success: false, error: "Unauthorized" };

        // 🧠 TRANSACTION: Criar voluntário E endereço juntos.
        // Se falhar ao criar o voluntário, o endereço não deve ficar "órfão" no banco.
        const volunteer = await prisma.$transaction(async (tx) => {
            const address = await tx.address.create({
                data: addressData,
            });

            const newVolunteer = await tx.volunteer.create({
                data: {
                    ...volunteerData,
                    addressId: address.id,
                    status: "ACTIVE", // 🧠 DEFAULT VALUE: Todo voluntário começa como ATIVO.
                },
                include: {
                    address: true,
                },
            });

            return newVolunteer;
        });

        revalidatePath("/volunteers");

        return { success: true, data: volunteer };
    } catch (error: any) {
        console.error("Error creating volunteer:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Get all volunteers
 */
export async function getVolunteers() {
    try {
        const session = await auth();
        if (!session) return { success: false, error: "Unauthorized" };

        const volunteers = await prisma.volunteer.findMany({
            include: {
                address: true,
            },
            orderBy: {
                joinDate: "desc",
            },
        });

        return { success: true, data: volunteers };
    } catch (error: any) {
        console.error("Error fetching volunteers:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Get volunteer by ID
 */
export async function getVolunteerById(id: string) {
    try {
        const session = await auth();
        if (!session) return { success: false, error: "Unauthorized" };

        const volunteer = await prisma.volunteer.findUnique({
            where: { id },
            include: {
                address: true,
            },
        });

        if (!volunteer) {
            return { success: false, error: "Voluntário não encontrado" };
        }

        return { success: true, data: volunteer };
    } catch (error: any) {
        console.error("Error fetching volunteer:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Terminate a volunteer
 */
export async function terminateVolunteer(data: unknown) {
    try {
        const session = await auth();
        if (!session) return { success: false, error: "Unauthorized" };

        const validatedData = volunteerTerminationSchema.parse(data);
        let volunteerId = validatedData.volunteerId;

        // 🧠 LOOKUP: Se não veio ID, busca por Nome + Data de Nascimento
        if (!volunteerId) {
            if (!validatedData.fullName || !validatedData.dateOfBirth) {
                return { success: false, error: "É necessário informar o ID ou Nome e Data de Nascimento." };
            }

            // Busca exata (case insensitive para nome seria ideal, mas Prisma Postgres requer mode: insensitive)
            // Para data de nascimento, usamos um intervalo para ignorar problemas de fuso horário (UTC vs Local).
            const searchDate = new Date(validatedData.dateOfBirth);
            const nextDay = new Date(searchDate);
            nextDay.setDate(nextDay.getDate() + 1);

            const volunteers = await prisma.volunteer.findMany({
                where: {
                    fullName: {
                        equals: validatedData.fullName,
                        mode: "insensitive",
                    },
                    dateOfBirth: {
                        gte: searchDate,
                        lt: nextDay,
                    },
                },
            });

            if (volunteers.length === 0) {
                return { success: false, error: "Voluntário não encontrado com esses dados." };
            }

            if (volunteers.length > 1) {
                return { success: false, error: "Múltiplos voluntários encontrados. Por favor, use o ID para maior segurança." };
            }

            volunteerId = volunteers[0].id;
        }

        const volunteer = await prisma.volunteer.update({
            where: { id: volunteerId },
            data: {
                status: "TERMINATED",
                terminationDate: validatedData.terminationDate,
                terminationReason: validatedData.terminationReason,
            },
            include: {
                address: true,
            },
        });

        revalidatePath("/volunteers");
        if (volunteerId) {
            revalidatePath(`/volunteers/${volunteerId}`);
        }

        return { success: true, data: volunteer };
    } catch (error: any) {
        console.error("Error terminating volunteer:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Get volunteer statistics
 */
export async function getVolunteerStats() {
    try {
        const session = await auth();
        if (!session) return { success: false, error: "Unauthorized" };

        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const totalVolunteers = await prisma.volunteer.count();

        const activeVolunteers = await prisma.volunteer.count({
            where: { status: "ACTIVE" },
        });

        const terminatedVolunteers = await prisma.volunteer.count({
            where: { status: "TERMINATED" },
        });

        const newThisMonth = await prisma.volunteer.count({
            where: {
                joinDate: { gte: firstDayOfMonth },
            },
        });

        return {
            success: true,
            data: {
                total: totalVolunteers,
                active: activeVolunteers,
                terminated: terminatedVolunteers,
                newThisMonth,
            },
        };
    } catch (error: any) {
        console.error("Error fetching volunteer stats:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Update a volunteer
 */
export async function updateVolunteer(
    id: string,
    volunteerData: any,
    addressData: any
) {
    try {
        const session = await auth();
        if (!session) return { success: false, error: "Unauthorized" };

        // 🧠 TRANSACTION: Atualizar voluntário E endereço juntos.
        const volunteer = await prisma.$transaction(async (tx) => {
            // 1. Update Address
            // First find the address ID associated with this volunteer
            const currentVolunteer = await tx.volunteer.findUnique({
                where: { id },
                select: { addressId: true }
            });

            if (!currentVolunteer) {
                throw new Error("Voluntário não encontrado");
            }

            // Update address if it exists
            if (currentVolunteer.addressId) {
                await tx.address.update({
                    where: { id: currentVolunteer.addressId },
                    data: addressData,
                });
            }

            // 2. Update Volunteer
            const updatedVolunteer = await tx.volunteer.update({
                where: { id },
                data: {
                    ...volunteerData,
                },
                include: {
                    address: true,
                },
            });

            return updatedVolunteer;
        });

        revalidatePath("/volunteers");
        revalidatePath(`/volunteers/${id}`);

        return { success: true, data: volunteer };
    } catch (error: any) {
        console.error("Error updating volunteer:", error);
        // Handle unique constraint violations gracefully if needed, 
        // though Prisma usually handles "same value" updates fine.
        return { success: false, error: error.message };
    }
}
