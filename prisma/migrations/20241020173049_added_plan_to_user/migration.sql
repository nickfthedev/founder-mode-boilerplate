-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PREMIUM');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "plan" "Plan" NOT NULL DEFAULT 'FREE';
