-- CreateTable
CREATE TABLE "public"."Avaliation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "location" TEXT,
    "avatar" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Avaliation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Avaliation_rating_idx" ON "public"."Avaliation"("rating");

-- CreateIndex
CREATE INDEX "Avaliation_active_idx" ON "public"."Avaliation"("active");
