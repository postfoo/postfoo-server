-- CreateTable
CREATE TABLE "Fund" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "plan" TEXT,
    "type" TEXT,
    "category" TEXT,
    "symbol1" TEXT,
    "symbol2" TEXT,
    "lastNav" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Fund_pkey" PRIMARY KEY ("id")
);
