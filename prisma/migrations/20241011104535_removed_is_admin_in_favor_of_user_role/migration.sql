/*
  Warnings:

  - You are about to drop the column `isAdmin` on the `BlogPost` table. All the data in the column will be lost.
  - You are about to drop the column `isAdmin` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "BlogPost" DROP COLUMN "isAdmin",
ADD COLUMN     "userRole" "UserRole" NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isAdmin",
ADD COLUMN     "userRole" "UserRole" NOT NULL DEFAULT 'USER';
