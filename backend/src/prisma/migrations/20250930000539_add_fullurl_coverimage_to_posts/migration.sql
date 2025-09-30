-- AlterTable
ALTER TABLE "public"."Log" ADD COLUMN     "acceptLanguage" TEXT,
ADD COLUMN     "host" TEXT,
ADD COLUMN     "origin" TEXT,
ADD COLUMN     "referer" TEXT,
ADD COLUMN     "xForwardedFor" TEXT,
ADD COLUMN     "xRealIp" TEXT;

-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "fullUrl" TEXT;

-- CreateIndex
CREATE INDEX "Log_ip_idx" ON "public"."Log"("ip");
