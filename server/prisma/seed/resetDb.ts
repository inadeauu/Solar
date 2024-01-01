import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const tables = [
  "Comment",
  "CommentVote",
  "Community",
  "Post",
  "PostVote",
  "User",
]

async function main() {
  for (const name of tables) {
    await prisma.$queryRawUnsafe(`DELETE FROM \"${name}\"`)
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
