import { Resolvers } from "../../__generated__/resolvers-types"
import prisma from "../../config/prisma"

export const resolvers: Resolvers = {
  Community: {
    owner: async (community) => {
      const owner = (await prisma.community
        .findUnique({ where: { id: community.id } })
        .owner())!

      return owner
    },
    members: async (community) => {
      const members =
        (await prisma.community
          .findUnique({
            where: { id: community.id },
          })
          .members()) ?? []

      return members
    },
    posts: async (community) => {
      const posts =
        (await prisma.community
          .findUnique({ where: { id: community.id } })
          .posts()) ?? []

      return posts
    },
  },
}
