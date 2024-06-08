-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarImageUrl" TEXT,
ADD COLUMN     "bannerImageUrl" TEXT,
ADD COLUMN     "links" JSONB,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "storeDescription" TEXT;
