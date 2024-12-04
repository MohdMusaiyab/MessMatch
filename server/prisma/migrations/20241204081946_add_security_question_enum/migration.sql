/*
  Warnings:

  - Added the required column `securityAnswer` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `securityQuestion` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SecurityQuestion" AS ENUM ('MOTHERS_MAIDEN_NAME', 'FIRST_PET_NAME', 'FAVORITE_CHILDHOOD_MEMORY', 'FAVORITE_TEACHER_NAME', 'BIRTH_TOWN_NAME');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "securityAnswer" TEXT NOT NULL,
ADD COLUMN     "securityQuestion" "SecurityQuestion" NOT NULL;
