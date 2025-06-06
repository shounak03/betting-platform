/*
  Warnings:

  - Changed the type of `endTime` on the `bet` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "bet" DROP COLUMN "endTime",
ADD COLUMN     "endTime" INTEGER NOT NULL;
