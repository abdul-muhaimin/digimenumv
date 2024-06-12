-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "active" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "allergyCodes" INTEGER[],
ADD COLUMN     "discountFixed" DOUBLE PRECISION,
ADD COLUMN     "discountPercentage" DOUBLE PRECISION,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "notice" TEXT,
ADD COLUMN     "soldOut" INTEGER NOT NULL DEFAULT 0;
