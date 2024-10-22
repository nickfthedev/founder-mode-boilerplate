-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en';

-- CreateIndex
CREATE INDEX "BlogPost_language_slug_idx" ON "BlogPost"("language", "slug");
