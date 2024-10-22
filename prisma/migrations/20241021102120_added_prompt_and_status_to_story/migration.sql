/*
  Warnings:

  - Added the required column `prompt` to the `Story` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StoryStatus" AS ENUM ('GENERATING', 'DONE', 'FAILED');

-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "prompt" TEXT NOT NULL,
ADD COLUMN     "status" "StoryStatus" NOT NULL DEFAULT 'GENERATING',
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;
