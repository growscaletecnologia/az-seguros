-- AlterTable
ALTER TABLE "public"."Coupom" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "description" TEXT,
ADD COLUMN     "discountType" TEXT NOT NULL DEFAULT 'percentage',
ADD COLUMN     "front_publishable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "public"."CoupomStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "usageLimit" INTEGER;

-- CreateTable
CREATE TABLE "public"."CoupomUsage" (
    "id" TEXT NOT NULL,
    "coupomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderId" TEXT,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoupomUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CoupomUsage_coupomId_userId_orderId_key" ON "public"."CoupomUsage"("coupomId", "userId", "orderId");

-- AddForeignKey
ALTER TABLE "public"."Coupom" ADD CONSTRAINT "Coupom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CoupomUsage" ADD CONSTRAINT "CoupomUsage_coupomId_fkey" FOREIGN KEY ("coupomId") REFERENCES "public"."Coupom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CoupomUsage" ADD CONSTRAINT "CoupomUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
