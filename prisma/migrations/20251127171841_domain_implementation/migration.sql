-- CreateEnum
CREATE TYPE "Race" AS ENUM ('PRETO', 'BRANCO', 'AMARELO', 'PARDO', 'INDIGENA');

-- CreateEnum
CREATE TYPE "HousingType" AS ENUM ('ALUGADA', 'PROPRIA', 'CEDIDA', 'OUTRA');

-- CreateEnum
CREATE TYPE "HousingCondition" AS ENUM ('BOA', 'REGULAR', 'FRAGIL');

-- CreateEnum
CREATE TYPE "HealthAccess" AS ENUM ('UBS_SUS', 'PLANO_SAUDE', 'OUTRO');

-- CreateEnum
CREATE TYPE "SocialProgram" AS ENUM ('BPC', 'CAD_UNICO', 'INSS', 'PAIF', 'PAEFI', 'CESTA_BASICA', 'OUTRO');

-- CreateEnum
CREATE TYPE "Specialty" AS ENUM ('PSICOLOGO', 'ASSISTENTE_SOCIAL', 'NUTRICIONISTA');

-- CreateEnum
CREATE TYPE "FamilyDistributionType" AS ENUM ('KIT_ALIMENTO_GENERICO', 'KIT_ALIMENTO_FAMILIA', 'KIT_ALIMENTO_ACOLHIMENTO', 'LEITE_CONAB');

-- CreateEnum
CREATE TYPE "InstitutionalDistributionType" AS ENUM ('ALIMENTOS_EVENTOS', 'ALIMENTOS_REGULARES', 'ALIMENTOS_CONAB', 'FRUTAS_VERDURAS_CONAB');

-- CreateEnum
CREATE TYPE "DistributionProgram" AS ENUM ('CONAB', 'ACOLHIMENTO', 'REGULAR', 'EVENTO');

-- CreateEnum
CREATE TYPE "VolunteerStatus" AS ENUM ('ACTIVE', 'TERMINATED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'VOLUNTEER',
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Beneficiary" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT,
    "race" "Race",
    "cpf" TEXT NOT NULL,
    "rg" TEXT,
    "maritalStatus" TEXT,
    "phoneNumber" TEXT,
    "email" TEXT,
    "addressId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Beneficiary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialAssessment" (
    "id" TEXT NOT NULL,
    "beneficiaryId" TEXT NOT NULL,
    "householdSize" INTEGER NOT NULL,
    "housingType" "HousingType" NOT NULL,
    "housingCondition" "HousingCondition" NOT NULL,
    "familyIncome" TEXT NOT NULL,
    "healthAccess" "HealthAccess"[],
    "hasSanitation" BOOLEAN NOT NULL DEFAULT false,
    "hasWater" BOOLEAN NOT NULL DEFAULT false,
    "hasSewage" BOOLEAN NOT NULL DEFAULT false,
    "hasGarbageCollection" BOOLEAN NOT NULL DEFAULT false,
    "hasSchoolNearby" BOOLEAN NOT NULL DEFAULT false,
    "schoolName" TEXT,
    "hasPublicTransport" BOOLEAN NOT NULL DEFAULT false,
    "socialPrograms" "SocialProgram"[],
    "consentGiven" BOOLEAN NOT NULL DEFAULT false,
    "consentDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyMember" (
    "id" TEXT NOT NULL,
    "socialAssessmentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "relationship" TEXT NOT NULL,
    "educationLevel" TEXT,
    "isStudying" BOOLEAN NOT NULL DEFAULT false,
    "occupation" TEXT,
    "isPCD" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageAuthorization" (
    "id" TEXT NOT NULL,
    "beneficiaryId" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "commercialUse" BOOLEAN NOT NULL DEFAULT false,
    "signaturePath" TEXT,
    "witnessName" TEXT,
    "witnessSignaturePath" TEXT,
    "signedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImageAuthorization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NutritionistReferral" (
    "id" TEXT NOT NULL,
    "beneficiaryId" TEXT NOT NULL,
    "specialty" "Specialty" NOT NULL,
    "indication" TEXT,
    "weight" DECIMAL(65,30),
    "height" DECIMAL(65,30),
    "observations" TEXT,
    "referredBy" TEXT NOT NULL,
    "referrerRole" TEXT NOT NULL,
    "referralDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NutritionistReferral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyDistribution" (
    "id" TEXT NOT NULL,
    "beneficiaryId" TEXT NOT NULL,
    "distributionType" "FamilyDistributionType" NOT NULL,
    "program" "DistributionProgram",
    "quantity" INTEGER NOT NULL,
    "deliveryDate" TIMESTAMP(3) NOT NULL,
    "signaturePath" TEXT,
    "observations" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FamilyDistribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Institution" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "addressId" TEXT,
    "contactPersonName" TEXT NOT NULL,
    "contactPersonCPF" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstitutionalDistribution" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "distributionType" "InstitutionalDistributionType" NOT NULL,
    "program" "DistributionProgram",
    "deliveryDate" TIMESTAMP(3) NOT NULL,
    "recipientSignaturePath" TEXT,
    "observations" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstitutionalDistribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DistributionItem" (
    "id" TEXT NOT NULL,
    "distributionId" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DistributionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Volunteer" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "addressId" TEXT,
    "status" "VolunteerStatus" NOT NULL DEFAULT 'ACTIVE',
    "joinDate" TIMESTAMP(3) NOT NULL,
    "terminationDate" TIMESTAMP(3),
    "terminationReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Volunteer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT,
    "complement" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "donorName" TEXT,
    "donorEmail" TEXT,
    "donorPhone" TEXT,
    "anonymous" BOOLEAN NOT NULL DEFAULT false,
    "amount" DECIMAL(65,30),
    "method" TEXT,
    "itemName" TEXT,
    "quantity" DOUBLE PRECISION,
    "unit" TEXT,
    "registeredById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL,
    "minThreshold" DOUBLE PRECISION NOT NULL DEFAULT 5,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "donationId" TEXT,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialLedger" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "balanceAfter" DECIMAL(65,30) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "donationId" TEXT,

    CONSTRAINT "FinancialLedger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Beneficiary_cpf_key" ON "Beneficiary"("cpf");

-- CreateIndex
CREATE INDEX "Beneficiary_cpf_idx" ON "Beneficiary"("cpf");

-- CreateIndex
CREATE INDEX "Beneficiary_fullName_idx" ON "Beneficiary"("fullName");

-- CreateIndex
CREATE UNIQUE INDEX "SocialAssessment_beneficiaryId_key" ON "SocialAssessment"("beneficiaryId");

-- CreateIndex
CREATE UNIQUE INDEX "ImageAuthorization_beneficiaryId_key" ON "ImageAuthorization"("beneficiaryId");

-- CreateIndex
CREATE INDEX "FamilyDistribution_beneficiaryId_idx" ON "FamilyDistribution"("beneficiaryId");

-- CreateIndex
CREATE INDEX "FamilyDistribution_deliveryDate_idx" ON "FamilyDistribution"("deliveryDate");

-- CreateIndex
CREATE INDEX "FamilyDistribution_program_idx" ON "FamilyDistribution"("program");

-- CreateIndex
CREATE UNIQUE INDEX "Institution_cnpj_key" ON "Institution"("cnpj");

-- CreateIndex
CREATE INDEX "Institution_cnpj_idx" ON "Institution"("cnpj");

-- CreateIndex
CREATE INDEX "Institution_name_idx" ON "Institution"("name");

-- CreateIndex
CREATE INDEX "InstitutionalDistribution_institutionId_idx" ON "InstitutionalDistribution"("institutionId");

-- CreateIndex
CREATE INDEX "InstitutionalDistribution_deliveryDate_idx" ON "InstitutionalDistribution"("deliveryDate");

-- CreateIndex
CREATE INDEX "InstitutionalDistribution_program_idx" ON "InstitutionalDistribution"("program");

-- CreateIndex
CREATE UNIQUE INDEX "Volunteer_cpf_key" ON "Volunteer"("cpf");

-- CreateIndex
CREATE INDEX "Volunteer_cpf_idx" ON "Volunteer"("cpf");

-- CreateIndex
CREATE INDEX "Volunteer_status_idx" ON "Volunteer"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_itemName_key" ON "Inventory"("itemName");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_donationId_key" ON "Inventory"("donationId");

-- CreateIndex
CREATE UNIQUE INDEX "FinancialLedger_donationId_key" ON "FinancialLedger"("donationId");

-- AddForeignKey
ALTER TABLE "Beneficiary" ADD CONSTRAINT "Beneficiary_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialAssessment" ADD CONSTRAINT "SocialAssessment_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "Beneficiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_socialAssessmentId_fkey" FOREIGN KEY ("socialAssessmentId") REFERENCES "SocialAssessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageAuthorization" ADD CONSTRAINT "ImageAuthorization_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "Beneficiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionistReferral" ADD CONSTRAINT "NutritionistReferral_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "Beneficiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyDistribution" ADD CONSTRAINT "FamilyDistribution_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "Beneficiary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyDistribution" ADD CONSTRAINT "FamilyDistribution_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Institution" ADD CONSTRAINT "Institution_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutionalDistribution" ADD CONSTRAINT "InstitutionalDistribution_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutionalDistribution" ADD CONSTRAINT "InstitutionalDistribution_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DistributionItem" ADD CONSTRAINT "DistributionItem_distributionId_fkey" FOREIGN KEY ("distributionId") REFERENCES "InstitutionalDistribution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Volunteer" ADD CONSTRAINT "Volunteer_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_registeredById_fkey" FOREIGN KEY ("registeredById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialLedger" ADD CONSTRAINT "FinancialLedger_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
