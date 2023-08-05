import prisma from "../../config/prisma"
import { Resolvers, UserOrderByType } from "../../__generated__/resolvers-types"
import {
  checkPaginationArgs,
  generateEdges,
  generatePageInfo,
  generatePaginationOptions,
} from "../paginate"

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
    ownedCommunities: async (user, args) => {
      checkPaginationArgs(args.input.paginate)
      const paginationOptions = generatePaginationOptions(args.input.paginate)
      const results = await prisma.user
        .findUnique({ where: { id: user.id } })
        .ownedCommunities({ ...paginationOptions })
      const edges = generateEdges(results)
      const pageInfo = generatePageInfo(results, args.input.paginate)

      return {
        edges,
        pageInfo,
      }
    },
    inCommunities: async (user, args) => {
      return prisma.user.findUnique({ where: { id: user.id } }).inCommunities()
    },
    posts: async (user, args) => {
      return prisma.user.findUnique({ where: { id: user.id } }).posts()
    },
  },
}
