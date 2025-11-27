import { z } from "zod";

// ============================================
// ENUMS (matching Prisma)
// ============================================
export const RaceEnum = z.enum(["PRETO", "BRANCO", "AMARELO", "PARDO", "INDIGENA"]);
export const HousingTypeEnum = z.enum(["ALUGADA", "PROPRIA", "CEDIDA", "OUTRA"]);
export const HousingConditionEnum = z.enum(["BOA", "REGULAR", "FRAGIL"]);
export const HealthAccessEnum = z.enum(["UBS_SUS", "PLANO_SAUDE", "OUTRO"]);
export const SocialProgramEnum = z.enum(["BPC", "CAD_UNICO", "INSS", "PAIF", "PAEFI", "CESTA_BASICA", "OUTRO"]);
export const SpecialtyEnum = z.enum(["PSICOLOGO", "ASSISTENTE_SOCIAL", "NUTRICIONISTA"]);
export const FamilyDistributionTypeEnum = z.enum(["KIT_ALIMENTO_GENERICO", "KIT_ALIMENTO_FAMILIA", "KIT_ALIMENTO_ACOLHIMENTO", "LEITE_CONAB"]);
export const InstitutionalDistributionTypeEnum = z.enum(["ALIMENTOS_EVENTOS", "ALIMENTOS_REGULARES", "ALIMENTOS_CONAB", "FRUTAS_VERDURAS_CONAB"]);
export const DistributionProgramEnum = z.enum(["CONAB", "ACOLHIMENTO", "REGULAR", "EVENTO"]);
export const VolunteerStatusEnum = z.enum(["ACTIVE", "TERMINATED"]);
export const UserRoleEnum = z.enum(["ADMIN", "VOLUNTEER", "COORDINATOR", "VIEWER"]);
export const MaritalStatusEnum = z.enum(["SOLTEIRO", "CASADO", "DIVORCIADO", "VIUVO", "UNIAO_ESTAVEL"]);
export const FamilyRelationshipEnum = z.enum(["FILHO", "FILHA", "CONJUGE", "PAI", "MAE", "IRMAO", "IRMA", "AVO", "AVA", "NETO", "NETA", "OUTRO"]);

// ============================================
// MODULE A: BENEFICIARY MANAGEMENT
// ============================================

// Shared Address Schema
export const addressSchema = z.object({
    street: z.string().min(1, "Rua/Av. é obrigatória"),
    number: z.string().min(1, "Número é obrigatório"),
    neighborhood: z.string().min(1, "Bairro é obrigatório"),
    city: z.string().min(1, "Cidade é obrigatória"),
    state: z.string().length(2, "UF deve ter 2 caracteres"),
    zipCode: z.string().optional(),
    complement: z.string().optional(),
});

export const beneficiarySchema = z.object({
    fullName: z.string().min(3, "Nome completo é obrigatório"),
    dateOfBirth: z.date({
        message: "Data de nascimento é obrigatória",
    }),
    gender: z.string().optional(),
    race: RaceEnum.optional(),
    cpf: z
        .string()
        .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/, "CPF inválido"),
    rg: z.string().optional(),
    maritalStatus: MaritalStatusEnum.optional(),
    phoneNumber: z.string().optional(),
    email: z.string().email("E-mail inválido").optional().or(z.literal("")),
    addressId: z.string().optional(),
});

export const familyMemberSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    age: z.number().int().min(0).max(120),
    relationship: FamilyRelationshipEnum,
    educationLevel: z.string().optional(),
    isStudying: z.boolean().default(false),
    occupation: z.string().optional(),
    isPCD: z.boolean().default(false),
});

export const socialAssessmentSchema = z.object({
    beneficiaryId: z.string(),
    householdSize: z.number().int().min(1, "Deve haver pelo menos 1 pessoa"),
    housingType: HousingTypeEnum,
    housingCondition: HousingConditionEnum,
    familyIncome: z.string().min(1, "Renda familiar é obrigatória"),

    // Services
    healthAccess: z.array(HealthAccessEnum).default([]),
    hasSanitation: z.boolean().default(false),
    hasWater: z.boolean().default(false),
    hasSewage: z.boolean().default(false),
    hasGarbageCollection: z.boolean().default(false),

    // Education
    hasSchoolNearby: z.boolean().default(false),
    schoolName: z.string().optional(),
    hasPublicTransport: z.boolean().default(false),

    // Social Programs
    socialPrograms: z.array(SocialProgramEnum).default([]),

    // Consent
    consentGiven: z.boolean().refine((val) => val === true, {
        message: "Consentimento é obrigatório",
    }),
    consentDate: z.date().optional(),

    // Family members
    familyMembers: z.array(familyMemberSchema).optional(),
});

export const imageAuthorizationSchema = z.object({
    beneficiaryId: z.string(),
    // rg and cpf removed (normalized in Beneficiary)
    startDate: z.date({
        message: "Data de início é obrigatória",
    }),
    endDate: z.date({
        message: "Data de término é obrigatória",
    }),
    commercialUse: z.boolean().default(false),
    signaturePath: z.string().optional(),
    witnessName: z.string().optional(),
    witnessSignaturePath: z.string().optional(),
    signedAt: z.date(),
}).refine((data) => data.endDate > data.startDate, {
    message: "Data de término deve ser após a data de início",
    path: ["endDate"],
});

export const nutritionistReferralSchema = z.object({
    beneficiaryId: z.string(),
    specialty: SpecialtyEnum,
    indication: z.string().optional(),
    weight: z.number().positive().optional(),
    height: z.number().positive().optional(),
    observations: z.string().optional(),
    referredBy: z.string().min(1, "Nome do responsável é obrigatório"),
    referrerRole: z.string().min(1, "Cargo é obrigatório"),
    referralDate: z.date({
        message: "Data do encaminhamento é obrigatória",
    }),
});

// ============================================
// MODULE B: FAMILY ASSISTANCE
// ============================================
export const familyDistributionSchema = z.object({
    beneficiaryId: z.string().min(1, "Beneficiário é obrigatório"),
    distributionType: FamilyDistributionTypeEnum,
    program: DistributionProgramEnum.optional(),
    quantity: z.number().int().min(1, "Quantidade deve ser maior que 0"),
    deliveryDate: z.date({
        message: "Data de entrega é obrigatória",
    }),
    signaturePath: z.string().optional(),
    observations: z.string().optional(),
});

// ============================================
// MODULE C: INSTITUTIONAL PARTNERSHIP
// ============================================
export const institutionSchema = z.object({
    name: z.string().min(3, "Nome da instituição é obrigatório"),
    cnpj: z
        .string()
        .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/, "CNPJ inválido"),
    email: z.string().email("E-mail inválido").optional().or(z.literal("")),
    phone: z.string().optional(),
    addressId: z.string().optional(),
    contactPersonName: z.string().min(1, "Nome do responsável é obrigatório"),
    contactPersonCPF: z
        .string()
        .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/, "CPF inválido"),
});

export const distributionItemSchema = z.object({
    itemName: z.string().min(1, "Nome do item é obrigatório"),
    quantity: z.string().min(1, "Quantidade é obrigatória"),
    observations: z.string().optional(),
});

export const institutionalDistributionSchema = z.object({
    institutionId: z.string().min(1, "Instituição é obrigatória"),
    distributionType: InstitutionalDistributionTypeEnum,
    program: DistributionProgramEnum.optional(),
    deliveryDate: z.date({
        message: "Data de entrega é obrigatória",
    }),
    items: z.array(distributionItemSchema).min(1, "Adicione pelo menos um item"),
    recipientSignaturePath: z.string().optional(),
    observations: z.string().optional(),
});

// ============================================
// MODULE D: VOLUNTEER MANAGEMENT
// ============================================
export const volunteerSchema = z.object({
    fullName: z.string().min(3, "Nome completo é obrigatório"),
    dateOfBirth: z.date({
        message: "Data de nascimento é obrigatória",
    }),
    cpf: z
        .string()
        .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/, "CPF inválido"),
    rg: z.string().min(1, "RG é obrigatório"),
    email: z.string().email("E-mail inválido").optional().or(z.literal("")),
    phoneNumber: z.string().min(1, "Telefone é obrigatório"),
    addressId: z.string().optional(),
    joinDate: z.date({
        message: "Data de adesão é obrigatória",
    }),
});

export const volunteerTerminationSchema = z.object({
    volunteerId: z.string(),
    terminationDate: z.date({
        message: "Data de encerramento é obrigatória",
    }),
    terminationReason: z.string().optional(),
});

// ============================================
// TYPE EXPORTS
// ============================================
export type Address = z.infer<typeof addressSchema>;
export type Beneficiary = z.infer<typeof beneficiarySchema>;
export type FamilyMember = z.infer<typeof familyMemberSchema>;
export type SocialAssessment = z.infer<typeof socialAssessmentSchema>;
export type ImageAuthorization = z.infer<typeof imageAuthorizationSchema>;
export type NutritionistReferral = z.infer<typeof nutritionistReferralSchema>;
export type FamilyDistribution = z.infer<typeof familyDistributionSchema>;
export type Institution = z.infer<typeof institutionSchema>;
export type DistributionItem = z.infer<typeof distributionItemSchema>;
export type InstitutionalDistribution = z.infer<typeof institutionalDistributionSchema>;
export type Volunteer = z.infer<typeof volunteerSchema>;
export type VolunteerTermination = z.infer<typeof volunteerTerminationSchema>;
