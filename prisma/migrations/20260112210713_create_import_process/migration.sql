-- CreateEnum
CREATE TYPE "ImportStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "ImportProcess" (
    "uuid" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "status" "ImportStatus" NOT NULL DEFAULT 'PENDING',
    "filesPath" TEXT NOT NULL,
    "totalArticles" INTEGER NOT NULL DEFAULT 0,
    "processedArticles" INTEGER NOT NULL DEFAULT 0,
    "failedArticles" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ImportProcess_pkey" PRIMARY KEY ("uuid")
);
