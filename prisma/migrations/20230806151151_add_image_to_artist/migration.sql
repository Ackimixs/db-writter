/*
  Warnings:

  - Added the required column `thumbnail` to the `Artist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "thumbnail" TEXT NOT NULL;
