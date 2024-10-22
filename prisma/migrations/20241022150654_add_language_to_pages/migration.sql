-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en';

-- CreateIndex
CREATE INDEX "Page_language_slug_idx" ON "Page"("language", "slug");
