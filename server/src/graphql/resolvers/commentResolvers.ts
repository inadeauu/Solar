import { Comment } from "@prisma/client"
import { Resolvers, VoteStatus } from "../../__generated__/resolvers-types"
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

      if (
        bodyError ||
        !post ||
        (args.input.commentId && !parentComment) ||
        parentComment?.parentId
      ) {
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
    voteComment: async (_0, args, { req }) => {
      if (!req.session.userId) {
        throw new GraphQLError("Not signed in", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      const comment = await prisma.comment.findUnique({
        where: { id: args.input.commentId },
      })

      if (!comment) {
        throw new GraphQLError("Request failed", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        })
      }

      const commentVote = await prisma.commentVote.findUnique({
        where: {
          userId_commentId: {
            userId: req.session.userId,
            commentId: args.input.commentId,
          },
        },
      })

      let updatedComment: Comment
      let successMsg: string
      let doMsg: string = args.input.like ? "liked" : "disliked"
      let undoMsg: string = args.input.like ? "unliked" : "undisliked"

      if (!commentVote) {
        updatedComment = await prisma.comment.update({
          where: { id: args.input.commentId },
          data: {
            commentVotes: {
              create: {
                userId: req.session.userId,
                like: args.input.like,
              },
            },
          },
        })
        successMsg = "Successfully " + doMsg + " post"
      } else if (
        (commentVote.like && args.input.like) ||
        (!commentVote.like && !args.input.like)
      ) {
        updatedComment = await prisma.comment.update({
          where: { id: args.input.commentId },
          data: {
            commentVotes: {
              delete: {
                userId_commentId: {
                  userId: req.session.userId,
                  commentId: args.input.commentId,
                },
              },
            },
          },
        })
        successMsg = "Successfully " + undoMsg + " post"
      } else {
        updatedComment = await prisma.comment.update({
          where: { id: args.input.commentId },
          data: {
            commentVotes: {
              update: {
                where: {
                  userId_commentId: {
                    userId: req.session.userId,
                    commentId: args.input.commentId,
                  },
                },
                data: {
                  like: args.input.like,
                },
              },
            },
          },
        })
        successMsg = "Successfully " + doMsg + " post"
      }

      return {
        __typename: "VoteCommentSuccess",
        successMsg: successMsg,
        code: 200,
        comment: updatedComment,
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
    voteStatus: async (comment, _0, { req }) => {
      if (!req.session.userId) return VoteStatus.None

      const commentVote = await prisma.commentVote.findUnique({
        where: {
          userId_commentId: {
            userId: req.session.userId,
            commentId: comment.id,
          },
        },
      })

      if (!commentVote) {
        return VoteStatus.None
      } else if (commentVote.like) {
        return VoteStatus.Like
      } else {
        return VoteStatus.Dislike
      }
    },
    voteSum: async (comment, args) => {
      const likeSum = (await prisma.comment.findUnique({
        where: { id: comment.id },
        include: {
          _count: { select: { commentVotes: { where: { like: true } } } },
        },
      }))!._count.commentVotes

      const dislikeSum = (await prisma.comment.findUnique({
        where: { id: comment.id },
        include: {
          _count: { select: { commentVotes: { where: { like: false } } } },
        },
      }))!._count.commentVotes

      const voteSum = likeSum - dislikeSum

      return voteSum
    },
  },
}
