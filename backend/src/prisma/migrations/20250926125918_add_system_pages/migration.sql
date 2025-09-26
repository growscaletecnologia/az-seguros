-- CreateEnum
CREATE TYPE "public"."SystemPageType" AS ENUM ('FAQ', 'TERMS', 'POLICIES', 'HELP', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."SystemPageStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "public"."SystemPage" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "public"."SystemPageType" NOT NULL,
    "status" "public"."SystemPageStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "SystemPage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SystemPage_slug_key" ON "public"."SystemPage"("slug");

-- CreateIndex
CREATE INDEX "SystemPage_slug_idx" ON "public"."SystemPage"("slug");

-- CreateIndex
CREATE INDEX "SystemPage_type_idx" ON "public"."SystemPage"("type");

-- CreateIndex
CREATE INDEX "SystemPage_status_idx" ON "public"."SystemPage"("status");
