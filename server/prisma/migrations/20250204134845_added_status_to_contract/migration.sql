-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'TERMINATED');

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "status" "ContractStatus" NOT NULL DEFAULT 'PENDING';
