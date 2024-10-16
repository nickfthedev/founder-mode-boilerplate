/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "discord" TEXT,
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "github" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "public" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tiktok" TEXT,
ADD COLUMN     "twitch" TEXT,
ADD COLUMN     "twitter" TEXT,
ADD COLUMN     "username" TEXT,
ADD COLUMN     "website" TEXT,
ADD COLUMN     "youtube" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
