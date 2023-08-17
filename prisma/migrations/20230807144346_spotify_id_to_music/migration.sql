/*
  Warnings:

  - A unique constraint covering the columns `[spotifyId]` on the table `Music` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `spotifyId` to the `Music` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Music" ADD COLUMN     "spotifyId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Music_spotifyId_key" ON "Music"("spotifyId");
