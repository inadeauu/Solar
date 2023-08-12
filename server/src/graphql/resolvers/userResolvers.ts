import prisma from "../../config/prisma"
import { Community, Post, User } from "@prisma/client"
import { Resolvers, UserOrderByType } from "../../__generated__/resolvers-types"
import { paginate } from "../paginate"

export const resolvers: Resolvers = {
  Query: {
    users: async (_0, args) => {
      const filters = args.input?.filters
      const orderBy = filters?.orderBy

      const results = await paginate<User>(args.input.paginate, (options) =>
        prisma.user.findMany({
          where: {
            username: {
              contains: filters?.usernameContains ?? undefined,
            },
          },
          orderBy: {
            id: "asc",
            ...(orderBy &&
              orderBy.type == UserOrderByType.PostCount && {
                posts: { _count: orderBy.dir },
              }),
          },
          ...options,
        })
      )

      return {
        edges: results.edges,
        pageInfo: results.pageInfo,
      }
    },
    usernameExists: async (_0, args) => {
      const user = await prisma.user.findFirst({
        where: { username: args.username },
      })

      return user ? true : false
    },
  },
  User: {
    ownedCommunities: async (user, args) => {
      const results = await paginate<Community>(
        args.input.paginate,
        (options) =>
          prisma.user
            .findUnique({ where: { id: user.id } })
            .ownedCommunities({ ...options })
      )

      return {
        edges: results.edges,
        pageInfo: results.pageInfo,
      }
    },
    inCommunities: async (user, args) => {
      const results = await paginate<Community>(
        args.input.paginate,
        (options) =>
          prisma.user
            .findUnique({ where: { id: user.id } })
            .inCommunities({ ...options })
      )

      return {
        edges: results.edges,
        pageInfo: results.pageInfo,
      }
    },
    posts: async (user, args) => {
      const results = await paginate<Post>(args.input.paginate, (options) =>
        prisma.user.findUnique({ where: { id: user.id } }).posts({ ...options })
      )

      return {
        edges: results.edges,
        pageInfo: results.pageInfo,
      }
    },
    postsCount: async (user) => {
      const postsCount =
        (await prisma.user.findUnique({
          where: { id: user.id },
          include: { _count: { select: { posts: true } } },
        }))!._count.posts + 1

      return postsCount
    },
  },
}
