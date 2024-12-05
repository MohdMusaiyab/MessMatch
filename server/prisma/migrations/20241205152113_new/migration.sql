-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('HOSTELS', 'CORPORATE_EVENTS', 'CORPORATE_OFFICES', 'WEDDINGS', 'PARTIES', 'OTHER');

-- CreateEnum
CREATE TYPE "MenuType" AS ENUM ('VEG', 'NON_VEG', 'BOTH');

-- CreateTable
CREATE TABLE "MessContractor" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "numberOfPeople" INTEGER,
    "services" "ServiceType"[],
    "ratings" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessContractor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "items" TEXT[],
    "pricePerHead" DOUBLE PRECISION NOT NULL,
    "type" "MenuType" NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MessContractor_userId_key" ON "MessContractor"("userId");

-- AddForeignKey
ALTER TABLE "MessContractor" ADD CONSTRAINT "MessContractor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "MessContractor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "MessContractor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
