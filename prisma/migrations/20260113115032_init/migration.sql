-- CreateEnum
CREATE TYPE "ImportStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "PublicationType" AS ENUM ('SCIENTIFIC_ARTICLE', 'LITERATURE_REVIEW', 'BOOK_REVIEW', 'BIOGRAPHICAL_MATERIAL', 'TRANSLATION', 'EDITORIAL_MATERIAL', 'RETRACTION_NOTICE', 'NOTE', 'NOTICE', 'REQUIRES_MANUAL_CLASSIFICATION');

-- CreateTable
CREATE TABLE "ImportProcess" (
    "uuid" UUID NOT NULL,
    "filename" TEXT NOT NULL,
    "status" "ImportStatus" NOT NULL DEFAULT 'PENDING',
    "files_path" TEXT NOT NULL,
    "total_articles" INTEGER NOT NULL DEFAULT 0,
    "processed_articles" INTEGER NOT NULL DEFAULT 0,
    "failed_articles" INTEGER NOT NULL DEFAULT 0,
    "error_message" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "ImportProcess_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "ImportProcessJournal" (
    "uuid" UUID NOT NULL,
    "import_process_id" UUID NOT NULL,
    "document_body" TEXT,
    "error_body" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImportProcessJournal_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "RincArticle" (
    "id" UUID NOT NULL,
    "publication_uuid" UUID NOT NULL,
    "process_import_uuid" UUID NOT NULL,
    "raw_data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RincArticle_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ImportProcessJournal" ADD CONSTRAINT "ImportProcessJournal_import_process_id_fkey" FOREIGN KEY ("import_process_id") REFERENCES "ImportProcess"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RincArticle" ADD CONSTRAINT "RincArticle_publication_uuid_fkey" FOREIGN KEY ("publication_uuid") REFERENCES "publications"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
