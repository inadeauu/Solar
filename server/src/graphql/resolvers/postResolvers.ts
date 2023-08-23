import { Post } from "@prisma/client"
import {
  PostOrderByType,
  VoteStatus,
  Resolvers,
} from "../../__generated__/resolvers-types"
import prisma from "../../config/prisma"
import { paginate } from "../paginate"
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
      const filters = args.input?.filters
      const orderBy = filters?.orderBy

      const posts = await paginate<Post>(args.input.paginate, (options) =>
        prisma.post.findMany({
          where: {
            AND: [
              {
                userId: args.input.filters?.userId ?? undefined,
              },
              {
                communityId: args.input.filters?.communityId ?? undefined,
              },
            ],
          },
          orderBy: {
            id: "asc",
            ...(orderBy &&
              orderBy.type == PostOrderByType.Recent && {
                created_at: orderBy.dir,
              }),
          },
          ...options,
        })
      )

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

      const titleError =
        args.input.title.trim().length == 0 || args.input.title.length > 200
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
            title: titleError
              ? "Title must be between 1 and 200 characters long"
              : null,
            body: bodyError
              ? "Body must be less than 20,000 characters long"
              : null,
            communityId: !community ? "Invalid community ID" : null,
          },
        }
      }

      await prisma.post.create({
        data: {
          userId: req.session.userId,
          communityId: args.input.communityId,
          title: args.input.title,
          body: args.input.body,
        },
      })

      return {
        __typename: "CreatePostSuccess",
        successMsg: "Succesfully created post",
        code: 200,
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
        throw new GraphQLError("Request failed", {
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
                like: args.input.like,
              },
            },
          },
        })
        successMsg = "Successfully " + doMsg + " post"
      } else if (
        (postVote.like && args.input.like) ||
        (!postVote.like && !args.input.like)
      ) {
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
                  like: args.input.like,
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
  },
  Post: {
    owner: async (post) => {
      const owner = (await prisma.post
        .findUnique({ where: { id: post.id } })
        .owner())!

      return owner
    },
    community: async (post) => {
      const community = (await prisma.post
        .findUnique({ where: { id: post.id } })
        .community())!

      return community
    },
    voteSum: async (post) => {
      const likeSum = (await prisma.post.findUnique({
        where: { id: post.id },
        include: {
          _count: { select: { postVotes: { where: { like: true } } } },
        },
      }))!._count.postVotes

      const dislikeSum = (await prisma.post.findUnique({
        where: { id: post.id },
        include: {
          _count: { select: { postVotes: { where: { like: false } } } },
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
      } else if (postVote.like) {
        return VoteStatus.Like
      } else {
        return VoteStatus.Dislike
      }
    },
  },
}
