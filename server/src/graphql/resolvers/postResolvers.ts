import { Resolvers } from "../../__generated__/resolvers-types"
import prisma from "../../config/prisma"

export const resolvers: Resolvers = {
  Post: {
    owner: async (post) => {
      const owner = (await prisma.post
        .findUnique({ where: { id: post.id } })
        .owner())!

      return owner
    },
    community: async (post) => {
      const community = (await prisma.post
        .findUnique({ where: { id: post.id } })
        .community())!

      return community
    },
  },
}
