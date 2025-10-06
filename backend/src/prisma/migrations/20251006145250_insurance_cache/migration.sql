-- CreateTable
CREATE TABLE "public"."InsuranceCache" (
    "id" TEXT NOT NULL,
    "insurerId" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "paxCount" INTEGER NOT NULL,
    "ageGroup" TEXT NOT NULL,
    "days" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InsuranceCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InsuranceCache_insurerId_idx" ON "public"."InsuranceCache"("insurerId");

-- CreateIndex
CREATE INDEX "InsuranceCache_destination_idx" ON "public"."InsuranceCache"("destination");

-- AddForeignKey
ALTER TABLE "public"."InsuranceCache" ADD CONSTRAINT "InsuranceCache_insurerId_fkey" FOREIGN KEY ("insurerId") REFERENCES "public"."SecurityIntegration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
