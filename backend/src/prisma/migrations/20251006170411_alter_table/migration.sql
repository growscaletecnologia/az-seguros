/*
  Warnings:

  - You are about to drop the column `securityName` on the `SecurityIntegration` table. All the data in the column will be lost.
  - Made the column `ativa` on table `SecurityIntegration` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."SecurityIntegration" DROP COLUMN "securityName",
ADD COLUMN     "authUrl" TEXT,
ADD COLUMN     "baseUrl" TEXT DEFAULT '',
ADD COLUMN     "insurerName" TEXT DEFAULT '',
ADD COLUMN     "tokenExpiresAt" TIMESTAMP(3),
ALTER COLUMN "clientId" SET DATA TYPE TEXT,
ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "ativa" SET NOT NULL;
