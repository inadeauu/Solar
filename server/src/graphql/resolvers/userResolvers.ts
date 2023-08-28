import prisma from "../../config/prisma"
import { Comment, Community, Post, User } from "@prisma/client"
import { Resolvers, UserOrderByType } from "../../__generated__/resolvers-types"
import { paginate } from "../paginate"

export const resolvers: Resolvers = {
  Query: {
    user: async (_0, args) => {
      const user = await prisma.user.findUnique({
        where: { username: args.input.username },
      })

      return user
    },
    users: async (_0, args) => {
      const filters = args.input?.filters
      const orderBy = filters?.orderBy

      const users = await paginate<User>(args.input.paginate, (options) =>
        prisma.user.findMany({
          where: {
            username: {
              contains: filters?.usernameContains ?? undefined,
            },
          },
          orderBy: {
            id: "asc",
          },
          ...options,
        })
      )

      return users
    },
    usernameExists: async (_0, args) => {
      const user = await prisma.user.findFirst({
        where: { username: args.username },
      })

      return user ? true : false
    },
  },
  User: {
    postsCount: async (user) => {
      const postsCount = (await prisma.user.findUnique({
        where: { id: user.id },
        include: { _count: { select: { posts: true } } },
      }))!._count.posts

      return postsCount
    },
    commentsCount: async (user) => {
      const commentsCount = (await prisma.user.findUnique({
        where: { id: user.id },
        include: { _count: { select: { comments: true } } },
      }))!._count.comments

      return commentsCount
    },
  },
}
