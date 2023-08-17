-- DropForeignKey
ALTER TABLE "Music" DROP CONSTRAINT "Music_artistId_fkey";

-- CreateTable
CREATE TABLE "_MusicArtists" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MusicArtists_AB_unique" ON "_MusicArtists"("A", "B");

-- CreateIndex
CREATE INDEX "_MusicArtists_B_index" ON "_MusicArtists"("B");

-- AddForeignKey
ALTER TABLE "_MusicArtists" ADD CONSTRAINT "_MusicArtists_A_fkey" FOREIGN KEY ("A") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MusicArtists" ADD CONSTRAINT "_MusicArtists_B_fkey" FOREIGN KEY ("B") REFERENCES "Music"("id") ON DELETE CASCADE ON UPDATE CASCADE;
