/*
  Warnings:

  - You are about to drop the column `canShowLocalCurrency` on the `InsurerPlan` table. All the data in the column will be lost.
  - You are about to drop the column `categories` on the `InsurerPlan` table. All the data in the column will be lost.
  - You are about to drop the column `cocationEur` on the `InsurerPlan` table. All the data in the column will be lost.
  - You are about to drop the column `cocationEurRaw` on the `InsurerPlan` table. All the data in the column will be lost.
  - You are about to drop the column `cocationUsd` on the `InsurerPlan` table. All the data in the column will be lost.
  - You are about to drop the column `cocationUsdRaw` on the `InsurerPlan` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `InsurerPlan` table. All the data in the column will be lost.
  - You are about to drop the column `currencyBill` on the `InsurerPlan` table. All the data in the column will be lost.
  - You are about to drop the column `days` on the `InsurerPlan` table. All the data in the column will be lost.
  - You are about to drop the column `group` on the `InsurerPlan` table. All the data in the column will be lost.
  - You are about to drop the column `isDefault` on the `InsurerPlan` table. All the data in the column will be lost.
  - You are about to drop the column `isReceptive` on the `InsurerPlan` table. All the data in the column will be lost.
  - You are about to drop the column `isTravelExtension` on the `InsurerPlan` table. All the data in the column will be lost.
  - You are about to drop the column `locateCurrency` on the `InsurerPlan` table. All the data in the column will be lost.
  - You are about to drop the column `minDaysQtd` on the `InsurerPlan` table. All the data in the column will be lost.
  - You are about to drop the column `minPassengersQtd` on the `InsurerPlan` table. All the data in the column will be lost.
  - You are about to drop the column `planId` on the `InsurerPlan` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `InsurerPlan` table. All the data in the column will be lost.
  - You are about to drop the column `priceRaw` on the `InsurerPlan` table. All the data in the column will be lost.
  - You are about to drop the column `priceToCalc` on the `InsurerPlan` table. All the data in the column will be lost.
  - You are about to drop the column `priceToCalcCurrencyBill` on the `InsurerPlan` table. All the data in the column will be lost.
  - You are about to drop the column `priceToCalcRaw` on the `InsurerPlan` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `InsurerPlanAgeGroup` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `priceIof` on the `InsurerPlanAgeGroup` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,6)`.

*/
-- AlterTable
ALTER TABLE "Destiny" ADD COLUMN     "crmBonusValue" DOUBLE PRECISION,
ADD COLUMN     "externalId" INTEGER;

-- AlterTable
ALTER TABLE "InsurerPlan" DROP COLUMN "canShowLocalCurrency",
DROP COLUMN "categories",
DROP COLUMN "cocationEur",
DROP COLUMN "cocationEurRaw",
DROP COLUMN "cocationUsd",
DROP COLUMN "cocationUsdRaw",
DROP COLUMN "currency",
DROP COLUMN "currencyBill",
DROP COLUMN "days",
DROP COLUMN "group",
DROP COLUMN "isDefault",
DROP COLUMN "isReceptive",
DROP COLUMN "isTravelExtension",
DROP COLUMN "locateCurrency",
DROP COLUMN "minDaysQtd",
DROP COLUMN "minPassengersQtd",
DROP COLUMN "planId",
DROP COLUMN "price",
DROP COLUMN "priceRaw",
DROP COLUMN "priceToCalc",
DROP COLUMN "priceToCalcCurrencyBill",
DROP COLUMN "priceToCalcRaw",
ADD COLUMN     "externalId" INTEGER,
ADD COLUMN     "securityIntegrationId" TEXT,
ALTER COLUMN "additionalId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "InsurerPlanAgeGroup" ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "priceIof" DROP NOT NULL,
ALTER COLUMN "priceIof" SET DATA TYPE DECIMAL(10,6);

-- AlterTable
ALTER TABLE "InsurerPlanDestiny" ALTER COLUMN "destinyId" DROP NOT NULL,
ALTER COLUMN "crmBonusValue" SET DATA TYPE DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "InsurerPlan_securityIntegrationId_idx" ON "InsurerPlan"("securityIntegrationId");

-- AddForeignKey
ALTER TABLE "InsurerPlan" ADD CONSTRAINT "InsurerPlan_securityIntegrationId_fkey" FOREIGN KEY ("securityIntegrationId") REFERENCES "SecurityIntegration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsurerPlanDestiny" ADD CONSTRAINT "InsurerPlanDestiny_destinyId_fkey" FOREIGN KEY ("destinyId") REFERENCES "Destiny"("id") ON DELETE SET NULL ON UPDATE CASCADE;
