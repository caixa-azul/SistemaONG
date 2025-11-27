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

        const volunteer = await prisma.$transaction(async (tx) => {
            const address = await tx.address.create({
                data: addressData,
            });

            const newVolunteer = await tx.volunteer.create({
                data: {
                    ...volunteerData,
                    addressId: address.id,
                    status: "ACTIVE",
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

        const volunteer = await prisma.volunteer.update({
            where: { id: validatedData.volunteerId },
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
        revalidatePath(`/volunteers/${validatedData.volunteerId}`);

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
