/*
  Warnings:

  - Made the column `email_verified` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email_verified" SET NOT NULL;
