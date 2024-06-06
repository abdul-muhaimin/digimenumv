/*
  Warnings:

  - You are about to drop the `Business` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Business" DROP CONSTRAINT "Business_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "businessAddress" TEXT,
ADD COLUMN     "businessAtoll" TEXT,
ADD COLUMN     "businessIsland" TEXT,
ADD COLUMN     "businessName" TEXT,
ADD COLUMN     "businessTelephone" TEXT,
ADD COLUMN     "businessType" TEXT,
ADD COLUMN     "name" TEXT;

-- DropTable
DROP TABLE "Business";
