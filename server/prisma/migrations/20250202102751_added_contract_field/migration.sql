-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "terms" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "auctionId" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "contractorAccepted" BOOLEAN NOT NULL DEFAULT false,
    "institutionAccepted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contract_auctionId_key" ON "Contract"("auctionId");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_auctionId_contractorId_institutionId_key" ON "Contract"("auctionId", "contractorId", "institutionId");

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "MessContractor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
