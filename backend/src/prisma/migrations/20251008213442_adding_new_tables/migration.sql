-- AlterTable
ALTER TABLE "InsurerProvider" ALTER COLUMN "logo" DROP NOT NULL;

-- CreateTable
CREATE TABLE "InsurerPlan" (
    "id" SERIAL NOT NULL,
    "additionalId" INTEGER NOT NULL DEFAULT 0,
    "ref" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "is" TEXT NOT NULL,
    "isShow" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "multitrip" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InsurerPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsurerPlanDestiny" (
    "id" SERIAL NOT NULL,
    "insurerPlanId" INTEGER NOT NULL,
    "destinyId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "destinyCode" TEXT NOT NULL,
    "crmBonusValue" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InsurerPlanDestiny_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsurerPlanAgeGroup" (
    "id" SERIAL NOT NULL,
    "insurerPlanDestinyId" INTEGER NOT NULL,
    "start" INTEGER NOT NULL,
    "end" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "priceIof" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InsurerPlanAgeGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Destiny" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "destinyCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Destiny_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanBenefit" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "longDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanBenefit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InsurerPlan_slug_key" ON "InsurerPlan"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Destiny_slug_key" ON "Destiny"("slug");

-- AddForeignKey
ALTER TABLE "InsurerPlanDestiny" ADD CONSTRAINT "InsurerPlanDestiny_insurerPlanId_fkey" FOREIGN KEY ("insurerPlanId") REFERENCES "InsurerPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsurerPlanAgeGroup" ADD CONSTRAINT "InsurerPlanAgeGroup_insurerPlanDestinyId_fkey" FOREIGN KEY ("insurerPlanDestinyId") REFERENCES "InsurerPlanDestiny"("id") ON DELETE CASCADE ON UPDATE CASCADE;
