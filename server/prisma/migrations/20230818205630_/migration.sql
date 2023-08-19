/*
  Warnings:

  - A unique constraint covering the columns `[userId,postId]` on the table `PostVote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PostVote_userId_postId_key" ON "PostVote"("userId", "postId");
