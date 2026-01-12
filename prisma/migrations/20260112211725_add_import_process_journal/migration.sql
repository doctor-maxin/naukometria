-- CreateEnum
CREATE TYPE "ImportStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "ImportProcess" (
    "uuid" UUID NOT NULL,
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

-- CreateTable
CREATE TABLE "ImportProcessJournal" (
    "id" UUID NOT NULL,
    "importProcessId" UUID NOT NULL,
    "documentBody" TEXT,
    "errorBody" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImportProcessJournal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ImportProcessJournal" ADD CONSTRAINT "ImportProcessJournal_importProcessId_fkey" FOREIGN KEY ("importProcessId") REFERENCES "ImportProcess"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
