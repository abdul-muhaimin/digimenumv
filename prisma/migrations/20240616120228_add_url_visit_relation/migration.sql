-- AddForeignKey
ALTER TABLE "URLVisit" ADD CONSTRAINT "URLVisit_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
