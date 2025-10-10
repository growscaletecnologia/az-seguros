-- CreateEnum
CREATE TYPE "PlanTagEnum" AS ENUM ('vendido', 'popular', 'escolhido', 'preco', 'premium', 'economico', 'indicado');

-- AlterTable
ALTER TABLE "InsurerPlan" ADD COLUMN     "tag" "PlanTagEnum";
