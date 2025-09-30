/*
  Warnings:

  - The values [OTHER] on the enum `SystemPageType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."FrontSectionStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."SystemPageType_new" AS ENUM ('FAQ', 'TERMS', 'POLICIES', 'HELP', 'CONTACT');
ALTER TABLE "public"."SystemPage" ALTER COLUMN "type" TYPE "public"."SystemPageType_new" USING ("type"::text::"public"."SystemPageType_new");
ALTER TYPE "public"."SystemPageType" RENAME TO "SystemPageType_old";
ALTER TYPE "public"."SystemPageType_new" RENAME TO "SystemPageType";
DROP TYPE "public"."SystemPageType_old";
COMMIT;

-- CreateTable
CREATE TABLE "public"."FrontSection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "bgColor" TEXT NOT NULL DEFAULT 'blue',
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" "public"."FrontSectionStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FrontSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FrontSection_status_idx" ON "public"."FrontSection"("status");

-- CreateIndex
CREATE INDEX "FrontSection_order_idx" ON "public"."FrontSection"("order");
