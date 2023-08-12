/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email_verified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email_verify_token` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password_reset_token` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_email_provider_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "email_verified",
DROP COLUMN "email_verify_token",
DROP COLUMN "image",
DROP COLUMN "password_reset_token";

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
