-- CreateEnum
CREATE TYPE "Kind" AS ENUM ('USER', 'COMMUNITY');

-- AlterTable
ALTER TABLE "Community" ADD COLUMN     "kind" "Kind" NOT NULL DEFAULT 'COMMUNITY';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "kind" "Kind" NOT NULL DEFAULT 'USER';
