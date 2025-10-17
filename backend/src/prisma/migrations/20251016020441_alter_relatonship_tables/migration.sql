-- DropForeignKey
ALTER TABLE "public"."InsurerProvider" DROP CONSTRAINT "InsurerProvider_insurerId_fkey";

-- AlterTable
ALTER TABLE "SecurityIntegration" ADD COLUMN     "insurerProviderId" TEXT;

-- AddForeignKey
ALTER TABLE "SecurityIntegration" ADD CONSTRAINT "SecurityIntegration_insurerProviderId_fkey" FOREIGN KEY ("insurerProviderId") REFERENCES "InsurerProvider"("id") ON DELETE SET NULL ON UPDATE CASCADE;
