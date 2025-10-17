-- CreateTable
CREATE TABLE "InsurerPlanBenefit" (
    "insurerPlanId" INTEGER NOT NULL,
    "planBenefitId" INTEGER NOT NULL,

    CONSTRAINT "InsurerPlanBenefit_pkey" PRIMARY KEY ("insurerPlanId","planBenefitId")
);

-- AddForeignKey
ALTER TABLE "InsurerPlanBenefit" ADD CONSTRAINT "InsurerPlanBenefit_insurerPlanId_fkey" FOREIGN KEY ("insurerPlanId") REFERENCES "InsurerPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsurerPlanBenefit" ADD CONSTRAINT "InsurerPlanBenefit_planBenefitId_fkey" FOREIGN KEY ("planBenefitId") REFERENCES "PlanBenefit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
