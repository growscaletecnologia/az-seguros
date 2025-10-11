/*
  Warnings:

  - Changed the type of `clientId` on the `SecurityIntegration` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "SecurityIntegration" DROP COLUMN "clientId",
ADD COLUMN     "clientId" INTEGER NOT NULL;
