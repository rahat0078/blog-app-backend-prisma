/*
  Warnings:

  - You are about to drop the column `createdAd` on the `comments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "comments" DROP COLUMN "createdAd",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "phone" TEXT,
ADD COLUMN     "role" TEXT DEFAULT 'USER',
ADD COLUMN     "status" TEXT DEFAULT 'active';
