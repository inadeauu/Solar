import { Comment } from "@prisma/client"
import { Resolvers } from "../../__generated__/resolvers-types"
import { paginate } from "../paginate"
import prisma from "../../config/prisma"

export const resolvers: Resolvers = {
  Query: {
    comment: async (_0, args) => {
      const comment = await prisma.comment.findUnique({
        where: {
          id: args.input.id,
        },
      })

      return comment
    },
    comments: async (_0, args) => {
      const comments = paginate<Comment>(args.input.paginate, (options) =>
        prisma.comment.findMany({
          where: {
            AND: [
              {
                userId: args.input.filters?.userId ?? undefined,
                postId: args.input.filters?.postId ?? undefined,
              },
            ],
          },
        })
      )

      return comments
    },
  },
  Comment: {
    owner: async (comment) => {
      const owner = (await prisma.comment
        .findUnique({
          where: { id: comment.id },
        })
        .owner())!

      return owner
    },
    post: async (comment) => {
      const post = (await prisma.comment
        .findUnique({
          where: { id: comment.id },
        })
        .post())!

      return post
    },
    parent: async (comment) => {
      const parent = (await prisma.comment
        .findUnique({ where: { id: comment.id } })
        .parent())!

      return parent
    },
    children: async (comment, args) => {
      const children = await paginate<Comment>(args.input.paginate, (options) =>
        prisma.comment
          .findUnique({ where: { id: comment.id } })
          .children({ orderBy: { id: "asc" }, ...options })
      )

      return children
    },
  },
}
