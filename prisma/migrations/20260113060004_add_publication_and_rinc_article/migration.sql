-- CreateTable
CREATE TABLE "Publication" (
    "uuid" UUID NOT NULL,
    "rincId" INTEGER,
    "doi" TEXT,
    "edn" TEXT,
    "titles" JSONB NOT NULL,
    "authors" JSONB NOT NULL,
    "year" INTEGER NOT NULL,
    "journalTitle" TEXT NOT NULL,
    "issn" TEXT,
    "volume" TEXT,
    "issue" TEXT,
    "pages" TEXT,
    "abstracts" JSONB NOT NULL,
    "keywords" JSONB NOT NULL,
    "rubric" TEXT,
    "udk" TEXT,
    "cited" INTEGER NOT NULL DEFAULT 0,
    "coreCited" INTEGER NOT NULL DEFAULT 0,
    "risc" INTEGER NOT NULL DEFAULT 0,
    "coreRISC" INTEGER NOT NULL DEFAULT 0,
    "vak" BOOLEAN NOT NULL DEFAULT false,
    "vakCategory" INTEGER,
    "whiteList" BOOLEAN NOT NULL DEFAULT false,
    "whiteListLevel" INTEGER NOT NULL DEFAULT 0,
    "jcrQuartile" INTEGER NOT NULL DEFAULT 0,
    "sjrQuartile" INTEGER NOT NULL DEFAULT 0,
    "scopus" BOOLEAN NOT NULL DEFAULT false,
    "wos" BOOLEAN NOT NULL DEFAULT false,
    "rsci" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Publication_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "RincArticle" (
    "id" UUID NOT NULL,
    "publicationUuid" UUID NOT NULL,
    "rawData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RincArticle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Publication_rincId_key" ON "Publication"("rincId");

-- CreateIndex
CREATE UNIQUE INDEX "Publication_doi_key" ON "Publication"("doi");

-- CreateIndex
CREATE UNIQUE INDEX "Publication_edn_key" ON "Publication"("edn");

-- AddForeignKey
ALTER TABLE "RincArticle" ADD CONSTRAINT "RincArticle_publicationUuid_fkey" FOREIGN KEY ("publicationUuid") REFERENCES "Publication"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
