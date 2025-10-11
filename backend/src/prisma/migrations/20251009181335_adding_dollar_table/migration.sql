-- CreateTable
CREATE TABLE "DollarCotation" (
    "id" INTEGER NOT NULL,
    "price" TEXT NOT NULL,
    "priceRaw" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DollarCotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EuroCotation" (
    "id" INTEGER NOT NULL,
    "price" TEXT NOT NULL,
    "priceRaw" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EuroCotation_pkey" PRIMARY KEY ("id")
);
