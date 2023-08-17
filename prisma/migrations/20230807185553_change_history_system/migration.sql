/*
  Warnings:

  - You are about to drop the `_History` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_History" DROP CONSTRAINT "_History_A_fkey";

-- DropForeignKey
ALTER TABLE "_History" DROP CONSTRAINT "_History_B_fkey";

-- DropTable
DROP TABLE "_History";

-- CreateTable
CREATE TABLE "History" (
    "userId" TEXT NOT NULL,
    "musicId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "History_pkey" PRIMARY KEY ("userId","musicId")
);

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_musicId_fkey" FOREIGN KEY ("musicId") REFERENCES "Music"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
