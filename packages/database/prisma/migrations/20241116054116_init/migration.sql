-- CreateEnum
CREATE TYPE "VerificationType" AS ENUM ('WORLD_ID');

-- CreateTable
CREATE TABLE "UserVerification" (
    "did" TEXT NOT NULL,
    "type" "VerificationType" NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserVerification_pkey" PRIMARY KEY ("did")
);
