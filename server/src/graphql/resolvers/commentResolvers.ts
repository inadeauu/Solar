import { Comment } from "@prisma/client"
import { Resolvers } from "../../__generated__/resolvers-types"
import { paginate } from "../paginate"
import prisma from "../../config/prisma"
import { GraphQLError } from "graphql"

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
      const filters = args.input.filters

      const comments = paginate<Comment>(args.input.paginate, (options) =>
        prisma.comment.findMany({
          where: {
            AND: [
              {
                ...(filters?.userId && {
                  userId: filters.userId,
                }),
              },
              {
                ...(filters?.postId && {
                  postId: filters.postId,
                }),
              },
              {
                ...(filters?.parentId !== undefined && {
                  parentId: filters.parentId,
                }),
              },
            ],
          },
          orderBy: {
            id: "asc",
          },
          ...options,
        })
      )

      return comments
    },
  },
  Mutation: {
    createComment: async (_0, args, { req }) => {
      if (!req.session.userId) {
        throw new GraphQLError("Not signed in", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      const bodyError =
        args.input.body.trim().length <= 0 || args.input.body.length > 2000
      const post = await prisma.post.findUnique({
        where: { id: args.input.postId },
      })

      let parentComment: Comment | null = null

      if (args.input.commentId) {
        parentComment = await prisma.comment.findUnique({
          where: { id: args.input.commentId },
        })
      }

      console.log(bodyError)
      console.log(post)
      console.log(parentComment)

      if (
        bodyError ||
        !post ||
        (args.input.commentId && !parentComment) ||
        parentComment?.parentId
      ) {
        console.log("whhat")
        return {
          __typename: "CreateCommentInputError",
          errorMsg: "Invalid input",
          code: 400,
          inputErrors: {
            body: bodyError
              ? "Body must be less than 2000 characters long"
              : null,
            postId: !post ? "Invalid post ID" : null,
            commentId:
              !parentComment || parentComment.parentId
                ? "Invalid comment ID"
                : null,
          },
        }
      }

      await prisma.comment.create({
        data: {
          userId: req.session.userId,
          postId: args.input.postId,
          body: args.input.body,
          parentId: args.input.commentId,
        },
      })

      return {
        __typename: "CreateCommentSuccess",
        successMsg: "Successfully created comment",
        code: 200,
      }
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
