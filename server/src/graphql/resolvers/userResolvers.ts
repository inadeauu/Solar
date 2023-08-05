import { Resolvers, UserOrderByType } from "../../__generated__/resolvers-types"
import prisma from "../../config/prisma"

export const resolvers: Resolvers = {
  Query: {
    users: async (_0, args) => {
      const filters = args.input?.filters
      const orderBy = filters?.orderBy

      const users = await prisma.user.findMany({
        where: {
          username: {
            contains: filters?.usernameContains ?? undefined,
          },
        },
        ...(orderBy && {
          orderBy: {
            ...(orderBy.type == UserOrderByType.PostCount && {
              posts: { _count: orderBy.dir },
            }),
          },
        }),
      })

      return users
    },
  },
  User: {
    ownedCommunities: async (user) => {
      return prisma.user
        .findUnique({ where: { id: user.id } })
        .ownedCommunities()
    },
    inCommunities: async (user) => {
      return prisma.user.findUnique({ where: { id: user.id } }).inCommunities()
    },
    posts: async (user) => {
      return prisma.user.findUnique({ where: { id: user.id } }).posts()
    },
  },
}
