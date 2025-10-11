-- AlterTable
ALTER TABLE "InsurerPlan" ADD COLUMN     "is_highlight" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_specialist_indication" BOOLEAN NOT NULL DEFAULT false;
