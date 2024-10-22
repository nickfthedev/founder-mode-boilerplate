-- CreateTable
CREATE TABLE "Story" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "keywords" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contentParts" TEXT[],
    "images" TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT true,
    "thumbsUp" INTEGER NOT NULL DEFAULT 0,
    "thumbsDown" INTEGER NOT NULL DEFAULT 0,
    "generatedById" TEXT NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_generatedById_fkey" FOREIGN KEY ("generatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
