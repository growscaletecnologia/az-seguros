-- CreateTable
CREATE TABLE "public"."SecurityIntegration" (
    "id" TEXT NOT NULL,
    "securityName" TEXT NOT NULL,
    "grantType" TEXT NOT NULL,
    "clientId" INTEGER NOT NULL,
    "clientSecret" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "scope" TEXT,
    "ativa" BOOLEAN DEFAULT true,
    "markUp" INTEGER,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "expiresIn" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SecurityIntegration_pkey" PRIMARY KEY ("id")
);
