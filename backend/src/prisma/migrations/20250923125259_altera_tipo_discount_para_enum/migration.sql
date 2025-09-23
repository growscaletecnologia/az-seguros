/*
  Warnings:

  - The `discountType` column on the `Coupom` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."DiscountType" AS ENUM ('PERCENTAGE', 'FIXED');

-- AlterTable
ALTER TABLE "public"."Coupom" DROP COLUMN "discountType",
ADD COLUMN     "discountType" "public"."DiscountType" NOT NULL DEFAULT 'PERCENTAGE';
