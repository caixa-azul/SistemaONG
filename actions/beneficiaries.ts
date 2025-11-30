// ⚡ USE SERVER: Indica que este código roda EXCLUSIVAMENTE no servidor.
// O código aqui nunca é enviado para o navegador do usuário, protegendo segredos de banco de dados.
"use server";

// ⬅️ ORIGEM: next/cache (Utilidade do Next.js para limpar cache de rota)
import { revalidatePath } from "next/cache";
// ⬅️ ORIGEM: /lib/prisma.ts (Conexão Singleton com o Banco de Dados)
import { prisma } from "@/lib/prisma";
// ⬅️ ORIGEM: /lib/schemas/domain.ts (Definições centrais de tipos e validações Zod)
import {
    beneficiarySchema,
    addressSchema,
    socialAssessmentSchema,
    imageAuthorizationSchema,
    nutritionistReferralSchema,
    type Beneficiary,
    type Address,
} from "@/lib/schemas/domain";
// ⬅️ ORIGEM: zod (Biblioteca de validação de schema)
import { z } from "zod";
// ⬅️ ORIGEM: /auth.ts (Sessão do usuário no servidor)
import { auth } from "@/auth";

// ============================================
// AÇÕES DE BENEFICIÁRIOS
// ============================================

// 🧠 SERVER ACTION: Uma função assíncrona que pode ser chamada diretamente do frontend (form action).
// ➡️ DESTINO: Usado por /components/forms/beneficiary-form.tsx
export async function createBeneficiary(data: unknown) {
    try {
        // 🛡️ AUTHENTICATION: Primeira linha de defesa.
        // Verificamos se quem está chamando essa função está logado.
        const session = await auth();
        if (!session) return { success: false, error: "Unauthorized" };

        // 🛡️ VALIDATION: Nunca confie no que vem do frontend.
        // O Zod garante que os dados têm o formato exato que esperamos (CPF válido, email correto, etc).
        // Se falhar, ele lança um erro antes de tocar no banco de dados.
        const validatedData = beneficiarySchema.parse(data);

        // 🧠 ORM (Prisma): Abstrai o SQL.
        // Em vez de escrever "INSERT INTO...", usamos um objeto JavaScript.
        const beneficiary = await prisma.beneficiary.create({
            data: {
                fullName: validatedData.fullName,
                dateOfBirth: validatedData.dateOfBirth,
                gender: validatedData.gender,
                race: validatedData.race,
                cpf: validatedData.cpf,
                rg: validatedData.rg,
                maritalStatus: validatedData.maritalStatus,
                phoneNumber: validatedData.phoneNumber,
                email: validatedData.email || null,
            },
        });

        // ⚡ REVALIDATION: O Next.js faz cache agressivo das páginas.
        // Avisamos aqui que a lista de beneficiários mudou, para ele limpar o cache
        // e mostrar os dados novos na próxima visita.
        revalidatePath("/beneficiaries");
        return { success: true, data: beneficiary };
    } catch (error) {
        // 🧠 ERROR HANDLING: Tratamento diferenciado de erros.
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues };
        }
        console.error("Error creating beneficiary:", error);
        return { success: false, error: "Erro ao criar beneficiário" };
    }
}

// ➡️ DESTINO: Usado por /components/forms/beneficiary-form.tsx (Fluxo completo)
export async function createBeneficiaryWithAddress(
    beneficiaryData: unknown,
    addressData: unknown
) {
    try {
        const session = await auth();
        if (!session) return { success: false, error: "Unauthorized" };

        // Validar ambos conjuntos de dados
        const validatedBeneficiary = beneficiarySchema.parse(beneficiaryData);
        const validatedAddress = addressSchema.parse(addressData);

        // Criar endereço primeiro, depois beneficiário
        const result = await prisma.$transaction(async (tx) => {
            const address = await tx.address.create({
                data: validatedAddress,
            });

            const beneficiary = await tx.beneficiary.create({
                data: {
                    fullName: validatedBeneficiary.fullName,
                    dateOfBirth: validatedBeneficiary.dateOfBirth,
                    gender: validatedBeneficiary.gender,
                    race: validatedBeneficiary.race,
                    cpf: validatedBeneficiary.cpf,
                    rg: validatedBeneficiary.rg,
                    maritalStatus: validatedBeneficiary.maritalStatus,
                    phoneNumber: validatedBeneficiary.phoneNumber,
                    email: validatedBeneficiary.email || null,
                    addressId: address.id,
                },
                include: {
                    address: true,
                },
            });

            return beneficiary;
        });

        revalidatePath("/beneficiaries");
        return { success: true, data: result };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues };
        }
        console.error("Error creating beneficiary with address:", error);
        return { success: false, error: "Erro ao criar beneficiário" };
    }
}

// ➡️ DESTINO: Usado por /app/(dashboard)/beneficiaries/page.tsx (Listagem)
export async function getBeneficiaries() {
    try {
        const session = await auth();
        if (!session) return { success: false, error: "Unauthorized" };

        const beneficiaries = await prisma.beneficiary.findMany({
            include: {
                address: true,
                socialAssessment: true,
                imageAuthorization: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return { success: true, data: beneficiaries };
    } catch (error) {
        console.error("Error fetching beneficiaries:", error);
        return { success: false, error: "Erro ao buscar beneficiários" };
    }
}

// ➡️ DESTINO: Usado por /app/(dashboard)/beneficiaries/[id]/page.tsx (Detalhes)
export async function getBeneficiaryById(id: string) {
    try {
        const session = await auth();
        if (!session) return { success: false, error: "Unauthorized" };

        const beneficiary = await prisma.beneficiary.findUnique({
            where: { id },
            include: {
                address: true,
                socialAssessment: {
                    include: {
                        familyMembers: true,
                    },
                },
                imageAuthorization: true,
                nutritionistReferrals: true,
                familyDistributions: {
                    orderBy: {
                        deliveryDate: "desc",
                    },
                },
            },
        });

        if (!beneficiary) {
            return { success: false, error: "Beneficiário não encontrado" };
        }

        return { success: true, data: beneficiary };
    } catch (error) {
        console.error("Error fetching beneficiary:", error);
        return { success: false, error: "Erro ao buscar beneficiário" };
    }
}

// ============================================
// AÇÕES DE AVALIAÇÃO SOCIAL
// ============================================

// ➡️ DESTINO: Usado por /components/forms/social-assessment-form.tsx
export async function createSocialAssessment(data: unknown) {
    try {
        const session = await auth();
        if (!session) return { success: false, error: "Unauthorized" };

        const validatedData = socialAssessmentSchema.parse(data);

        const assessment = await prisma.socialAssessment.create({
            data: {
                beneficiaryId: validatedData.beneficiaryId,
                householdSize: validatedData.householdSize,
                housingType: validatedData.housingType,
                housingCondition: validatedData.housingCondition,
                familyIncome: validatedData.familyIncome,
                healthAccess: validatedData.healthAccess,
                hasSanitation: validatedData.hasSanitation,
                hasWater: validatedData.hasWater,
                hasSewage: validatedData.hasSewage,
                hasGarbageCollection: validatedData.hasGarbageCollection,
                hasSchoolNearby: validatedData.hasSchoolNearby,
                schoolName: validatedData.schoolName,
                hasPublicTransport: validatedData.hasPublicTransport,
                socialPrograms: validatedData.socialPrograms,
                consentGiven: validatedData.consentGiven,
                consentDate: validatedData.consentDate,
                familyMembers: {
                    create: validatedData.familyMembers?.map((member) => ({
                        name: member.name,
                        age: member.age,
                        relationship: member.relationship,
                        educationLevel: member.educationLevel,
                        isStudying: member.isStudying,
                        occupation: member.occupation,
                        isPCD: member.isPCD,
                    })),
                },
            },
            include: {
                familyMembers: true,
            },
        });

        revalidatePath(`/beneficiaries/${validatedData.beneficiaryId}`);
        return { success: true, data: assessment };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues };
        }
        console.error("Error creating social assessment:", error);
        return { success: false, error: "Erro ao criar avaliação socioeconômica" };
    }
}

// ============================================
// AÇÕES DE AUTORIZAÇÃO DE IMAGEM
// ============================================

// ➡️ DESTINO: Usado por /components/forms/image-authorization-form.tsx
export async function createImageAuthorization(data: unknown) {
    try {
        const session = await auth();
        if (!session) return { success: false, error: "Unauthorized" };

        const validatedData = imageAuthorizationSchema.parse(data);

        const authorization = await prisma.imageAuthorization.create({
            data: {
                beneficiaryId: validatedData.beneficiaryId,
                startDate: validatedData.startDate,
                endDate: validatedData.endDate,
                commercialUse: validatedData.commercialUse,
                signaturePath: validatedData.signaturePath,
                witnessName: validatedData.witnessName,
                witnessSignaturePath: validatedData.witnessSignaturePath,
                signedAt: validatedData.signedAt,
            },
        });

        revalidatePath(`/beneficiaries/${validatedData.beneficiaryId}`);
        return { success: true, data: authorization };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues };
        }
        console.error("Error creating image authorization:", error);
        return { success: false, error: "Erro ao criar autorização de imagem" };
    }
}

// ============================================
// AÇÕES DE ENCAMINHAMENTO NUTRICIONAL
// ============================================

// ➡️ DESTINO: Usado por /components/forms/nutritionist-referral-form.tsx
export async function createNutritionistReferral(data: unknown) {
    try {
        const session = await auth();
        if (!session) return { success: false, error: "Unauthorized" };

        const validatedData = nutritionistReferralSchema.parse(data);

        const referral = await prisma.nutritionistReferral.create({
            data: validatedData,
        });

        revalidatePath(`/beneficiaries/${validatedData.beneficiaryId}`);
        return { success: true, data: referral };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues };
        }
        console.error("Error creating nutritionist referral:", error);
        return { success: false, error: "Erro ao criar encaminhamento" };
    }
}
