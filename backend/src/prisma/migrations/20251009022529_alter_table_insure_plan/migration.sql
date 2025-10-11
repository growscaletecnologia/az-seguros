/*
  Warnings:

  - Added the required column `categories` to the `InsurerPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cocationEur` to the `InsurerPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cocationEurRaw` to the `InsurerPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cocationUsd` to the `InsurerPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cocationUsdRaw` to the `InsurerPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `InsurerPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currencyBill` to the `InsurerPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `days` to the `InsurerPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `group` to the `InsurerPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locateCurrency` to the `InsurerPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planId` to the `InsurerPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `InsurerPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceRaw` to the `InsurerPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceToCalc` to the `InsurerPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceToCalcCurrencyBill` to the `InsurerPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceToCalcRaw` to the `InsurerPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InsurerPlan" ADD COLUMN     "canShowLocalCurrency" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "categories" JSONB NOT NULL,
ADD COLUMN     "cocationEur" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "cocationEurRaw" INTEGER NOT NULL,
ADD COLUMN     "cocationUsd" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "cocationUsdRaw" INTEGER NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL,
ADD COLUMN     "currencyBill" TEXT NOT NULL,
ADD COLUMN     "days" INTEGER NOT NULL,
ADD COLUMN     "group" TEXT NOT NULL,
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isReceptive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isTravelExtension" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "locateCurrency" TEXT NOT NULL,
ADD COLUMN     "minDaysQtd" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "minPassengersQtd" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "planId" INTEGER NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "priceRaw" INTEGER NOT NULL,
ADD COLUMN     "priceToCalc" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "priceToCalcCurrencyBill" TEXT NOT NULL,
ADD COLUMN     "priceToCalcRaw" INTEGER NOT NULL;
