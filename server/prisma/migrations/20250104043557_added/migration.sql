-- AlterTable
ALTER TABLE "Auction" ADD COLUMN     "winnerId" TEXT;

-- AddForeignKey
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "MessContractor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
