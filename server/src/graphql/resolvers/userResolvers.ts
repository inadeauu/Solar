import prisma from "../../config/prisma"
import { Comment, Community, Post, User } from "@prisma/client"
import { Resolvers, UserOrderByType } from "../../__generated__/resolvers-types"
import { paginate } from "../paginate"

export const resolvers: Resolvers = {
  Query: {
    user: async (_0, args) => {
      const user = await prisma.user.findUnique({
        where: { id: args.input.id },
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
            ...(orderBy &&
              orderBy.type == UserOrderByType.PostCount && {
                posts: { _count: orderBy.dir },
              }),
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
    ownedCommunities: async (user, args) => {
      const ownedCommunities = await paginate<Community>(
        args.input.paginate,
        (options) =>
          prisma.user
            .findUnique({ where: { id: user.id } })
            .ownedCommunities({ orderBy: { id: "asc" }, ...options })
      )

      return ownedCommunities
    },
    inCommunities: async (user, args) => {
      const inCommunities = await paginate<Community>(
        args.input.paginate,
        (options) =>
          prisma.user
            .findUnique({ where: { id: user.id } })
            .inCommunities({ orderBy: { id: "asc" }, ...options })
      )

      return inCommunities
    },
    posts: async (user, args) => {
      const posts = await paginate<Post>(args.input.paginate, (options) =>
        prisma.user
          .findUnique({ where: { id: user.id } })
          .posts({ orderBy: { id: "asc" }, ...options })
      )

      return posts
    },
    comments: async (user, args) => {
      const comments = await paginate<Comment>(args.input.paginate, (options) =>
        prisma.user
          .findUnique({ where: { id: user.id } })
          .comments({ orderBy: { id: "asc" }, ...options })
      )

      return comments
    },
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
