/*
  Warnings:

  - You are about to drop the `PostVote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CommunityToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CommunityToUser" DROP CONSTRAINT "_CommunityToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_CommunityToUser" DROP CONSTRAINT "_CommunityToUser_B_fkey";

-- DropTable
DROP TABLE "PostVote";

-- DropTable
DROP TABLE "_CommunityToUser";

-- CreateTable
CREATE TABLE "_UserInCommunities" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserInCommunities_AB_unique" ON "_UserInCommunities"("A", "B");

-- CreateIndex
CREATE INDEX "_UserInCommunities_B_index" ON "_UserInCommunities"("B");

-- AddForeignKey
ALTER TABLE "Community" ADD CONSTRAINT "Community_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserInCommunities" ADD CONSTRAINT "_UserInCommunities_A_fkey" FOREIGN KEY ("A") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserInCommunities" ADD CONSTRAINT "_UserInCommunities_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
