/*
  Warnings:

  - The `maritalStatus` column on the `Beneficiary` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `cpf` on the `ImageAuthorization` table. All the data in the column will be lost.
  - You are about to drop the column `rg` on the `ImageAuthorization` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `DistributionItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `FamilyMember` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `relationship` on the `FamilyMember` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'VOLUNTEER', 'COORDINATOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'UNIAO_ESTAVEL');

-- CreateEnum
CREATE TYPE "FamilyRelationship" AS ENUM ('FILHO', 'FILHA', 'CONJUGE', 'PAI', 'MAE', 'IRMAO', 'IRMA', 'AVO', 'AVA', 'NETO', 'NETA', 'OUTRO');

-- DropForeignKey
ALTER TABLE "FamilyDistribution" DROP CONSTRAINT "FamilyDistribution_beneficiaryId_fkey";

-- AlterTable
ALTER TABLE "Beneficiary" DROP COLUMN "maritalStatus",
ADD COLUMN     "maritalStatus" "MaritalStatus";

-- AlterTable
ALTER TABLE "DistributionItem" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "FamilyMember" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "relationship",
ADD COLUMN     "relationship" "FamilyRelationship" NOT NULL;

-- AlterTable
ALTER TABLE "ImageAuthorization" DROP COLUMN "cpf",
DROP COLUMN "rg";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'VOLUNTEER';

-- CreateIndex
CREATE INDEX "Address_city_state_idx" ON "Address"("city", "state");

-- CreateIndex
CREATE INDEX "DistributionItem_distributionId_idx" ON "DistributionItem"("distributionId");

-- CreateIndex
CREATE INDEX "NutritionistReferral_beneficiaryId_idx" ON "NutritionistReferral"("beneficiaryId");

-- CreateIndex
CREATE INDEX "NutritionistReferral_referralDate_idx" ON "NutritionistReferral"("referralDate");

-- AddForeignKey
ALTER TABLE "FamilyDistribution" ADD CONSTRAINT "FamilyDistribution_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "Beneficiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
