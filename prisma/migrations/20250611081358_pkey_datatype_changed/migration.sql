/*
  Warnings:

  - The primary key for the `bet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `bet` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "bet" DROP CONSTRAINT "bet_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "bet_pkey" PRIMARY KEY ("id");
