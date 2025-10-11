-- CreateEnum
CREATE TYPE "InsurerCodeEnum" AS ENUM ('hero', 'mta');

-- AlterTable
ALTER TABLE "SecurityIntegration" ADD COLUMN     "insurerCode" "InsurerCodeEnum";

-- CreateTable
CREATE TABLE "InsurerProvider" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL DEFAULT '',
    "name" TEXT NOT NULL DEFAULT '',
    "logo" TEXT NOT NULL DEFAULT '',
    "terms_url" TEXT DEFAULT '',
    "insurerId" TEXT NOT NULL,

    CONSTRAINT "InsurerProvider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InsurerProvider_insurerId_key" ON "InsurerProvider"("insurerId");

-- CreateIndex
CREATE INDEX "InsurerProvider_insurerId_idx" ON "InsurerProvider"("insurerId");

-- AddForeignKey
ALTER TABLE "InsurerProvider" ADD CONSTRAINT "InsurerProvider_insurerId_fkey" FOREIGN KEY ("insurerId") REFERENCES "SecurityIntegration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
