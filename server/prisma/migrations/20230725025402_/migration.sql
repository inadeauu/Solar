/*
  Warnings:

  - The values [FACEBOOK] on the enum `Provider` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Provider_new" AS ENUM ('EMAIL', 'GOOGLE', 'GITHUB');
ALTER TABLE "User" ALTER COLUMN "provider" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "provider" TYPE "Provider_new" USING ("provider"::text::"Provider_new");
ALTER TYPE "Provider" RENAME TO "Provider_old";
ALTER TYPE "Provider_new" RENAME TO "Provider";
DROP TYPE "Provider_old";
ALTER TABLE "User" ALTER COLUMN "provider" SET DEFAULT 'EMAIL';
COMMIT;

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" SET NOT NULL;
