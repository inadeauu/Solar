/*
  Warnings:

  - You are about to drop the column `kind` on the `Community` table. All the data in the column will be lost.
  - You are about to drop the column `kind` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Community" DROP COLUMN "kind";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "kind";

-- DropEnum
DROP TYPE "Kind";
