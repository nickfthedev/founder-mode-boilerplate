/*
  Warnings:

  - You are about to drop the column `userRole` on the `BlogPost` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BlogPost" DROP COLUMN "userRole",
ADD COLUMN     "asPageOwner" BOOLEAN NOT NULL DEFAULT false;
