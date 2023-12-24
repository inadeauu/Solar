import { PrismaClient } from "@prisma/client"
import { communities, posts, users, comments, inCommunities, votedPosts } from "./seedData"

const prisma = new PrismaClient()

async function main() {
  for (const user of users) {
    await prisma.user.create({ data: user })
  }

  for (const community of communities) {
    await prisma.community.create({ data: community })
  }

  for (const post of posts) {
    await prisma.post.create({ data: post })
  }

  for (const comment of comments) {
    await prisma.comment.create({ data: comment })
  }

  for (const union of inCommunities) {
    await prisma.user.update({
      where: {
        id: union.userId,
      },
      data: {
        inCommunities: {
          connect: {
            id: union.communityId,
          },
        },
      },
    })
  }

  for (const postVote of votedPosts) {
    await prisma.postVote.create({
      data: postVote,
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
