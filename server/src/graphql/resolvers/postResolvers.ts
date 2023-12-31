import { Post } from "@prisma/client"
import { VoteStatus, Resolvers } from "../../__generated__/resolvers-types"
import prisma from "../../config/prisma"
import { paginatePosts } from "../paginate"
import { GraphQLError } from "graphql"

export const resolvers: Resolvers = {
  Query: {
    post: async (_0, args) => {
      const post = await prisma.post.findUnique({
        where: { id: args.input.id },
      })

      return post
    },
    posts: async (_0, args) => {
      const posts = await paginatePosts(args.input.paginate, args.input.filters)

      return posts
    },
  },
  Mutation: {
    createPost: async (_0, args, { req }) => {
      if (!req.session.userId) {
        throw new GraphQLError("Not signed in", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      const titleError = args.input.title.trim().length == 0 || args.input.title.length > 200
      const bodyError = args.input.body && args.input.body.length > 20000
      const community = await prisma.community.findUnique({
        where: { id: args.input.communityId },
      })

      if (titleError || bodyError || !community) {
        return {
          __typename: "CreatePostInputError",
          errorMsg: "Invalid input",
          code: 400,
          inputErrors: {
            title: titleError ? "Title must be between 1 and 200 characters long" : null,
            body: bodyError ? "Body must be less than 20,000 characters long" : null,
            communityId: !community ? "Invalid community ID" : null,
          },
        }
      }

      const newPost = await prisma.post.create({
        data: {
          userId: req.session.userId,
          communityId: args.input.communityId,
          title: args.input.title,
          body: args.input.body ?? "",
        },
      })

      return {
        __typename: "CreatePostSuccess",
        successMsg: "Successfully created post",
        code: 200,
        post: newPost,
      }
    },
    votePost: async (_0, args, { req }) => {
      if (!req.session.userId) {
        throw new GraphQLError("Not signed in", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      const post = await prisma.post.findUnique({
        where: { id: args.input.postId },
      })

      if (!post) {
        throw new GraphQLError("Post does not exist", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        })
      }

      const postVote = await prisma.postVote.findUnique({
        where: {
          userId_postId: {
            userId: req.session.userId,
            postId: args.input.postId,
          },
        },
      })

      let updatedPost: Post
      let successMsg: string
      let doMsg: string = args.input.like ? "liked" : "disliked"
      let undoMsg: string = args.input.like ? "unliked" : "undisliked"

      if (!postVote) {
        updatedPost = await prisma.post.update({
          where: { id: args.input.postId },
          data: {
            postVotes: {
              create: {
                userId: req.session.userId,
                like: args.input.like ? 1 : -1,
              },
            },
          },
        })
        successMsg = "Successfully " + doMsg + " post"
      } else if ((postVote.like == 1 && args.input.like) || (postVote.like == -1 && !args.input.like)) {
        updatedPost = await prisma.post.update({
          where: { id: args.input.postId },
          data: {
            postVotes: {
              delete: {
                userId_postId: {
                  userId: req.session.userId,
                  postId: args.input.postId,
                },
              },
            },
          },
        })
        successMsg = "Successfully " + undoMsg + " post"
      } else {
        updatedPost = await prisma.post.update({
          where: { id: args.input.postId },
          data: {
            postVotes: {
              update: {
                where: {
                  userId_postId: {
                    userId: req.session.userId,
                    postId: args.input.postId,
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
        __typename: "VotePostSuccess",
        successMsg: successMsg,
        code: 200,
        post: updatedPost,
      }
    },
    editPost: async (_0, args, { req }) => {
      if (!req.session.userId) {
        throw new GraphQLError("Not signed in", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      const post = await prisma.post.findUnique({
        where: { id: args.input.postId },
        include: {
          owner: {
            select: {
              id: true,
            },
          },
        },
      })

      if (!post) {
        throw new GraphQLError("Post does not exist", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        })
      }

      if (post.owner.id !== req.session.userId) {
        throw new GraphQLError("Unauthorized", {
          extensions: { code: "UNAUTHORIZED" },
        })
      }

      const titleError = args.input.title.trim().length == 0 || args.input.title.length > 200
      const bodyError = args.input.body && args.input.body.length > 20000

      if (titleError || bodyError) {
        return {
          __typename: "EditPostInputError",
          errorMsg: "Invalid input",
          code: 400,
          inputErrors: {
            title: titleError ? "Title must be between 1 and 200 characters long" : null,
            body: bodyError ? "Body must be less than 20,000 characters long" : null,
          },
        }
      }

      const updatedPost = await prisma.post.update({
        where: {
          id: args.input.postId,
        },
        data: {
          title: args.input.title,
          body: args.input.body,
        },
      })

      return {
        __typename: "EditPostSuccess",
        successMsg: "Successfully edited post",
        code: 200,
        post: updatedPost,
      }
    },
    deletePost: async (_0, args, { req }) => {
      if (!req.session.userId) {
        throw new GraphQLError("Not signed in", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      const post = await prisma.post.findUnique({
        where: { id: args.input.postId },
        include: {
          owner: {
            select: {
              id: true,
            },
          },
        },
      })

      if (!post) {
        throw new GraphQLError("Post does not exist", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        })
      }

      if (post.owner.id !== req.session.userId) {
        throw new GraphQLError("Unauthorized", {
          extensions: { code: "UNAUTHORIZED" },
        })
      }

      await prisma.post.delete({ where: { id: args.input.postId } })

      return {
        __typename: "DeletePostSuccess",
        successMsg: "Successfully deleted post",
        code: 200,
      }
    },
  },
  Post: {
    owner: async (post) => {
      const owner = (await prisma.post.findUnique({ where: { id: post.id } }).owner())!

      return owner
    },
    community: async (post) => {
      const community = (await prisma.post.findUnique({ where: { id: post.id } }).community())!

      return community
    },
    voteSum: async (post) => {
      const likeSum = (await prisma.post.findUnique({
        where: { id: post.id },
        include: {
          _count: { select: { postVotes: { where: { like: 1 } } } },
        },
      }))!._count.postVotes

      const dislikeSum = (await prisma.post.findUnique({
        where: { id: post.id },
        include: {
          _count: { select: { postVotes: { where: { like: -1 } } } },
        },
      }))!._count.postVotes

      const voteSum = likeSum - dislikeSum

      return voteSum
    },
    commentCount: async (post) => {
      const commentCount = (await prisma.post.findUnique({
        where: { id: post.id },
        include: { _count: { select: { comments: true } } },
      }))!._count.comments

      return commentCount
    },
    voteStatus: async (post, _0, { req }) => {
      if (!req.session.userId) return VoteStatus.None

      const postVote = await prisma.postVote.findUnique({
        where: {
          userId_postId: { userId: req.session.userId, postId: post.id },
        },
      })

      if (!postVote) {
        return VoteStatus.None
      } else if (postVote.like == 1) {
        return VoteStatus.Like
      } else {
        return VoteStatus.Dislike
      }
    },
  },
}
