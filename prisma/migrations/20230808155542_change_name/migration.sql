/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Queue` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Queue" DROP COLUMN "createdAt",
ADD COLUMN     "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
