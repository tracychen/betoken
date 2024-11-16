-- CreateEnum
CREATE TYPE "MarketStatus" AS ENUM ('OPEN', 'RESOLVED');

-- CreateTable
CREATE TABLE "Market" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "creatorDID" TEXT NOT NULL,
    "options" TEXT[],
    "closesAt" TIMESTAMP(3) NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "status" "MarketStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Market_pkey" PRIMARY KEY ("id")
);
