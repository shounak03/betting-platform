/*
  Warnings:

  - You are about to drop the `betting` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "betting";

-- CreateTable
CREATE TABLE "bet" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "resolverId" TEXT NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "winner" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bet_pkey" PRIMARY KEY ("id")
);
