import { Resolvers } from "../../__generated__/resolvers-types"
import prisma from "../../config/prisma"

const checkCommunityTitleExists = async (title: string) => {
  const community = await prisma.community.findFirst({
    where: { title },
  })

  return community ? true : false
}

export const resolvers: Resolvers = {
  Query: {
    titleExists: async (_0, args) => {
      return checkCommunityTitleExists(args.title)
    },
  },
  Mutation: {
    createCommunity: async (_0, args, { req }) => {
      if (!req.session.userId) {
        return {
          __typename: "AuthenticationError",
          errorMsg: "No authenticated user",
          code: 401,
        }
      }

      if (await checkCommunityTitleExists(args.input.title)) {
        return {
          __typename: "CreateCommunityInputError",
          errorMsg: "Input error",
          code: 400,
          inputErrors: {
            title: "Title already in use",
          },
        }
      }

      await prisma.community.create({
        data: {
          title: args.input.title,
          userId: req.session.userId,
        },
      })

      return {
        __typename: "CreateCommunitySuccess",
        successMsg: "Community successfully created",
        code: 200,
      }
    },
  },
  Community: {
    owner: async (community) => {
      const owner = (await prisma.community
        .findUnique({ where: { id: community.id } })
        .owner())!

      return owner
    },
    members: async (community) => {
      const members =
        (await prisma.community
          .findUnique({
            where: { id: community.id },
          })
          .members()) ?? []

      return members
    },
    posts: async (community) => {
      const posts =
        (await prisma.community
          .findUnique({ where: { id: community.id } })
          .posts()) ?? []

      return posts
    },
  },
}
