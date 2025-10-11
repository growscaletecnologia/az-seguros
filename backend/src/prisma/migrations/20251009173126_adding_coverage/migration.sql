-- CreateTable
CREATE TABLE "Coverage" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "highlight" TEXT,
    "content" TEXT,
    "displayOrder" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coverage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanCoverage" (
    "id" SERIAL NOT NULL,
    "insurerPlanId" INTEGER NOT NULL,
    "coverageId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "coverageType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanCoverage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coverage_slug_key" ON "Coverage"("slug");

-- CreateIndex
CREATE INDEX "PlanCoverage_insurerPlanId_idx" ON "PlanCoverage"("insurerPlanId");

-- CreateIndex
CREATE INDEX "PlanCoverage_coverageId_idx" ON "PlanCoverage"("coverageId");

-- AddForeignKey
ALTER TABLE "PlanCoverage" ADD CONSTRAINT "PlanCoverage_insurerPlanId_fkey" FOREIGN KEY ("insurerPlanId") REFERENCES "InsurerPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanCoverage" ADD CONSTRAINT "PlanCoverage_coverageId_fkey" FOREIGN KEY ("coverageId") REFERENCES "Coverage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
