-- AlterTable
ALTER TABLE "Album" ALTER COLUMN "thumbnail" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Artist" ALTER COLUMN "thumbnail" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Music" ALTER COLUMN "thumbnail" DROP NOT NULL;
