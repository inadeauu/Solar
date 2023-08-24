/*
  Warnings:

  - Changed the type of `like` on the `CommentVote` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `like` on the `PostVote` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CommentVote" DROP COLUMN "like",
ADD COLUMN     "like" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PostVote" DROP COLUMN "like",
ADD COLUMN     "like" INTEGER NOT NULL;
