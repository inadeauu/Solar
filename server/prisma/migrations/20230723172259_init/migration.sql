-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('EMAIL', 'GOOGLE', 'FACEBOOK', 'GITHUB');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "email_verified" BOOLEAN,
    "password" TEXT NOT NULL,
    "provider" "Provider" NOT NULL DEFAULT 'EMAIL',
    "provider_id" TEXT,
    "email_verify_token" TEXT,
    "password_reset_token" TEXT,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_provider_key" ON "User"("email", "provider");
