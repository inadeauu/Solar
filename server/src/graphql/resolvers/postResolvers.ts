import { Post } from "@prisma/client"
import {
  OrderByDir,
  PostOrderByType,
  Resolvers,
} from "../../__generated__/resolvers-types"
import prisma from "../../config/prisma"
import { paginate } from "../paginate"
import { GraphQLError } from "graphql"

export const resolvers: Resolvers = {
  Query: {
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
  },
}
