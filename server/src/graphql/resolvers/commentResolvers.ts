import { Comment } from "@prisma/client"
import { Resolvers, VoteStatus } from "../../__generated__/resolvers-types"
import { paginateComments } from "../paginate"
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
      const comments = await paginateComments(
        args.input.paginate,
        args.input.filters
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

      if (!post) {
        throw new GraphQLError("Post does not exist", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        })
      }

      if (bodyError) {
        return {
          __typename: "CreateCommentInputError",
          errorMsg: "Invalid input",
          code: 400,
          inputErrors: {
            body: bodyError
              ? "Body must be less than 2000 characters long"
              : null,
          },
        }
      }

      await prisma.comment.create({
        data: {
          userId: req.session.userId,
          postId: args.input.postId,
          body: args.input.body,
          parentId: null,
        },
      })

      return {
        __typename: "CreateCommentSuccess",
        successMsg: "Successfully created comment",
        code: 200,
      }
    },
    createCommentReply: async (_0, args, { req }) => {
      if (!req.session.userId) {
        throw new GraphQLError("Not signed in", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      const bodyError =
        args.input.body.trim().length <= 0 || args.input.body.length > 2000

      const parentComment = await prisma.comment.findUnique({
        where: { id: args.input.commentId },
      })

      if (!parentComment) {
        throw new GraphQLError("Parent comment does not exist", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        })
      }

      if (bodyError || parentComment.parentId) {
        return {
          __typename: "CreateCommentReplyInputError",
          errorMsg: "Invalid input",
          code: 400,
          inputErrors: {
            body: bodyError
              ? "Body must be less than 2000 characters long"
              : null,
            commentId: parentComment.parentId ? "Invalid comment ID" : null,
          },
        }
      }

      await prisma.comment.create({
        data: {
          userId: req.session.userId,
          postId: parentComment.postId,
          body: args.input.body,
          parentId: args.input.commentId,
        },
      })

      return {
        __typename: "CreateCommentReplySuccess",
        successMsg: "Successfully replied",
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
        throw new GraphQLError("Comment does not exist", {
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
                like: args.input.like ? 1 : -1,
              },
            },
          },
        })
        successMsg = "Successfully " + doMsg + " post"
      } else if (
        (commentVote.like == 1 && args.input.like) ||
        (commentVote.like == -1 && !args.input.like)
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
                  like: args.input.like ? 1 : -1,
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
    editComment: async (_0, args, { req }) => {
      if (!req.session.userId) {
        throw new GraphQLError("Not signed in", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      const comment = await prisma.comment.findUnique({
        where: { id: args.input.commentId },
        include: {
          owner: {
            select: {
              id: true,
            },
          },
        },
      })

      if (!comment) {
        throw new GraphQLError("Comment does not exist", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        })
      }

      if (comment.owner.id !== req.session.userId) {
        throw new GraphQLError("Unauthorized", {
          extensions: { code: "UNAUTHORIZED" },
        })
      }

      const bodyError =
        args.input.body.trim().length <= 0 || args.input.body.length > 2000

      if (bodyError) {
        return {
          __typename: "EditCommentInputError",
          errorMsg: "Invalid input",
          code: 400,
          inputErrors: {
            body: "Body must be less than 2000 characters long",
          },
        }
      }

      const updatedComment = await prisma.comment.update({
        where: {
          id: args.input.commentId,
        },
        data: {
          body: args.input.body,
        },
      })

      return {
        __typename: "EditCommentSuccess",
        successMsg: "Successfully edited comment",
        code: 200,
        comment: updatedComment,
      }
    },
    deleteComment: async (_0, args, { req }) => {
      if (!req.session.userId) {
        throw new GraphQLError("Not signed in", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      const comment = await prisma.comment.findUnique({
        where: { id: args.input.commentId },
        include: {
          owner: {
            select: {
              id: true,
            },
          },
        },
      })

      if (!comment) {
        throw new GraphQLError("Post does not exist", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        })
      }

      if (comment.owner.id !== req.session.userId) {
        throw new GraphQLError("Unauthorized", {
          extensions: { code: "UNAUTHORIZED" },
        })
      }

      await prisma.comment.delete({ where: { id: args.input.commentId } })

      return {
        __typename: "DeleteCommentSuccess",
        successMsg: "Successfully deleted comment",
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
      } else if (commentVote.like == 1) {
        return VoteStatus.Like
      } else {
        return VoteStatus.Dislike
      }
    },
    voteSum: async (comment) => {
      const likeSum = (await prisma.comment.findUnique({
        where: { id: comment.id },
        include: {
          _count: { select: { commentVotes: { where: { like: 1 } } } },
        },
      }))!._count.commentVotes

      const dislikeSum = (await prisma.comment.findUnique({
        where: { id: comment.id },
        include: {
          _count: { select: { commentVotes: { where: { like: -1 } } } },
        },
      }))!._count.commentVotes

      const voteSum = likeSum - dislikeSum

      return voteSum
    },
    replyCount: async (comment) => {
      const replyCount = (await prisma.comment.findUnique({
        where: { id: comment.id },
        include: {
          _count: { select: { children: true } },
        },
      }))!._count.children

      return replyCount
    },
  },
}
