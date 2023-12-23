import { PrismaClient } from "@prisma/client"
import { communities, posts, users, comments } from "./seedData"

const prisma = new PrismaClient()

const userIds: string[] = []
const communityIds: string[] = []
const postIds: string[] = []

async function main() {
  for (const user of users) {
    userIds.push((await prisma.user.create({ data: user })).id)
  }

  await Promise.all(
    communities.map(async (name, i) => {
      communityIds.push(
        (
          await prisma.community.create({
            data: { title: name, userId: userIds[i % userIds.length] },
          })
        ).id
      )
    })
  )

  await Promise.all(
    posts.map(async (post, i) => {
      postIds.push(
        (
          await prisma.post.create({
            data: {
              userId: userIds[i % userIds.length],
              communityId: communityIds[i % communityIds.length],
              title: post.title,
              body: post.body,
            },
          })
        ).id
      )
    })
  )

  await Promise.all(
    comments.map(async (comment, i) => {
      await prisma.comment.create({
        data: {
          userId: userIds[i % userIds.length],
          postId: postIds[i % postIds.length],
          body: comment.body,
          parentId: comment.parentId,
        },
      })
    })
  )
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
