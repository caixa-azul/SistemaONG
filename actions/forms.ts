"use server";

// ⬅️ ORIGEM: zod (Biblioteca de validação)
import { z } from "zod";
// ⬅️ ORIGEM: /lib/prisma.ts (Conexão Singleton com o Banco de Dados)
import { prisma } from "@/lib/prisma";
// ⬅️ ORIGEM: next/cache (Utilidade do Next.js para limpar cache de rota)
import { revalidatePath } from "next/cache";
// ⬅️ ORIGEM: /types/index.ts (Tipo para Server Actions com useFormState)
import { State } from "@/types";
// ⬅️ ORIGEM: /auth.ts (Sessão do usuário)
import { auth } from "@/auth";
// ⬅️ ORIGEM: /lib/schemas/domain.ts (Validação Zod)
import {
    HousingTypeEnum,
    HousingConditionEnum,
    SocialAssessment
} from "@/lib/schemas/domain";

// Schema local adaptando dados do formulário para o schema do DB
const SocialAssessmentFormSchema = z.object({
    beneficiaryId: z.string(),
    familyIncome: z.string().min(1, "Renda familiar é obrigatória"),
    householdSize: z.coerce.number().min(1, "Mínimo de 1 membro"),
    housingType: HousingTypeEnum,
    // Campos ausentes no formulário original, fornecendo padrões ou opcionais
    housingCondition: HousingConditionEnum.default("REGULAR"),
    governmentBenefits: z.string().optional(),
    healthIssues: z.string().optional(),
    professionalStatus: z.string().optional(),
    expenses: z.coerce.number().optional(),
});

const ImageAuthorizationFormSchema = z.object({
    beneficiaryId: z.string(),
    authorized: z.boolean(),
    signaturePath: z.string().optional(),
});

// ➡️ DESTINO: Usado por /components/forms/social-assessment-form.tsx
export async function saveSocialAssessment(prevState: State, formData: FormData): Promise<State> {
    const session = await auth();
    if (!session?.user) {
        return { message: "Não autorizado", errors: {} };
    }

    // Mapear campos do formulário legado para o novo schema
    const rawData = {
        beneficiaryId: formData.get("beneficiaryId"),
        familyIncome: formData.get("familyIncome"),
        householdSize: formData.get("familyMemberCount"), // Mapped from familyMemberCount
        housingType: mapHousingStatus(formData.get("housingStatus") as string),
        governmentBenefits: formData.get("governmentBenefits"),
        healthIssues: formData.get("healthIssues"),
        professionalStatus: formData.get("professionalStatus"),
        expenses: formData.get("expenses"),
    };

    const validatedFields = SocialAssessmentFormSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Campos inválidos. Falha ao salvar avaliação.",
        };
    }

    const { beneficiaryId, ...data } = validatedFields.data;

    try {
        await prisma.socialAssessment.upsert({
            where: { beneficiaryId },
            update: {
                ...data,
                // Garantir que campos obrigatórios para o Prisma estejam presentes (padrões)
                hasSanitation: false,
                hasWater: false,
                hasSewage: false,
                hasGarbageCollection: false,
                hasSchoolNearby: false,
                hasPublicTransport: false,
                consentGiven: true, // Assumed true on submission
            },
            create: {
                beneficiaryId,
                ...data,
                // Padrões para campos obrigatórios
                hasSanitation: false,
                hasWater: false,
                hasSewage: false,
                hasGarbageCollection: false,
                hasSchoolNearby: false,
                hasPublicTransport: false,
                consentGiven: true,
            },
        });
    } catch (error) {
        console.error("Database Error:", error);
        return {
            message: "Erro de banco de dados: Falha ao salvar avaliação.",
        };
    }

    revalidatePath(`/beneficiaries/${beneficiaryId}`);
    return { message: "Avaliação salva com sucesso!", errors: {} };
}

// ➡️ DESTINO: Usado por /components/forms/image-authorization-form.tsx
export async function saveImageAuthorization(prevState: State, formData: FormData): Promise<State> {
    const session = await auth();
    if (!session?.user) {
        return { message: "Não autorizado", errors: {} };
    }

    const validatedFields = ImageAuthorizationFormSchema.safeParse({
        beneficiaryId: formData.get("beneficiaryId"),
        authorized: formData.get("authorized") === "on",
        signaturePath: formData.get("signaturePath"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Campos inválidos.",
        };
    }

    const { beneficiaryId, ...data } = validatedFields.data;
    const now = new Date();
    const oneYearLater = new Date(now);
    oneYearLater.setFullYear(now.getFullYear() + 1);

    try {
        await prisma.imageAuthorization.upsert({
            where: { beneficiaryId },
            update: {
                commercialUse: data.authorized,
                signaturePath: data.signaturePath,
                // Required fields defaults
                startDate: now,
                endDate: oneYearLater,
                signedAt: now,
            },
            create: {
                beneficiaryId,
                commercialUse: data.authorized,
                signaturePath: data.signaturePath,
                // Required fields defaults
                startDate: now,
                endDate: oneYearLater,
                signedAt: now,
            },
        });
    } catch (error) {
        console.error("Database Error:", error);
        return {
            message: "Erro de banco de dados: Falha ao salvar autorização.",
        };
    }

    revalidatePath(`/beneficiaries/${beneficiaryId}`);
    return { message: "Autorização salva com sucesso!", errors: {} };
}

// Helper para mapear status legado para novo Enum
function mapHousingStatus(status: string | null): string | undefined {
    if (!status) return undefined;
    const map: Record<string, string> = {
        "OWNED": "PROPRIA",
        "RENTED": "ALUGADA",
        "CEDED": "CEDIDA",
        "OTHER": "OUTRA"
    };
    return map[status] || "OUTRA";
}
