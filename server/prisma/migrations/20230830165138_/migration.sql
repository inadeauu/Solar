/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Community` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Community_title_key" ON "Community"("title");
