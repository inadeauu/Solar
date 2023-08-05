import { Resolvers } from "../../__generated__/resolvers-types"
import prisma from "../../config/prisma"

export const resolvers: Resolvers = {
  Post: {
    owner: async (post) => {
      return prisma.post.findUnique({ where: { id: post.id } }).owner()
    },
    community: async (post) => {
      return prisma.post.findUnique({ where: { id: post.id } }).community()
    },
  },
}
