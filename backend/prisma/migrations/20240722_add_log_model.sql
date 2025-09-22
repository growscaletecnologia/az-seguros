-- CreateEnum
CREATE TYPE "HttpMethod" AS ENUM ('GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD');

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "path" TEXT NOT NULL,
    "method" "HttpMethod" NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "userAgent" TEXT,
    "ip" TEXT,
    "requestBody" JSONB,
    "responseTime" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "Log_userId_idx" ON "Log"("userId");
CREATE INDEX "Log_path_idx" ON "Log"("path");
CREATE INDEX "Log_method_idx" ON "Log"("method");
CREATE INDEX "Log_createdAt_idx" ON "Log"("createdAt");