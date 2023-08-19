-- CreateTable
CREATE TABLE "PostVote" (
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "like" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostVote_pkey" PRIMARY KEY ("userId","postId")
);

-- AddForeignKey
ALTER TABLE "PostVote" ADD CONSTRAINT "PostVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostVote" ADD CONSTRAINT "PostVote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
