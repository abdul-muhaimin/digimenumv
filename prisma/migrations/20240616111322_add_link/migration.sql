-- CreateTable
CREATE TABLE "URLVisit" (
    "id" SERIAL NOT NULL,
    "storeId" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "URLVisit_pkey" PRIMARY KEY ("id")
);
