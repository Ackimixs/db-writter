/*
  Warnings:

  - You are about to drop the column `authorId` on the `Music` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[spotifyId]` on the table `Album` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[spotifyId]` on the table `Artist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[spotifyId]` on the table `Playlist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `spotifyId` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spotifyId` to the `Artist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `artistId` to the `Music` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spotifyId` to the `Playlist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Music" DROP CONSTRAINT "Music_authorId_fkey";

-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "spotifyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "spotifyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Music" DROP COLUMN "authorId",
ADD COLUMN     "artistId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Playlist" ADD COLUMN     "spotifyId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Album_spotifyId_key" ON "Album"("spotifyId");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_spotifyId_key" ON "Artist"("spotifyId");

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_spotifyId_key" ON "Playlist"("spotifyId");

-- AddForeignKey
ALTER TABLE "Music" ADD CONSTRAINT "Music_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
