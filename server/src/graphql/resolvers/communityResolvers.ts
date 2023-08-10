import { Community } from "@prisma/client"
import {
  CommunityOrderByType,
  Resolvers,
} from "../../__generated__/resolvers-types"
import prisma from "../../config/prisma"
import { paginate } from "../paginate"

const checkCommunityTitleExists = async (title: string) => {
  const community = await prisma.community.findFirst({
    where: { title },
  })

  return community ? true : false
}

export const resolvers: Resolvers = {
  Query: {
    communities: async (_0, args) => {
      const filters = args.input?.filters
      const orderBy = filters?.orderBy

      const results = await paginate<Community>(
        args.input.paginate,
        (options) =>
          prisma.community.findMany({
            where: {
              title: {
                contains: filters?.titleContains ?? undefined,
              },
            },
            orderBy: {
              id: "asc",
              ...(orderBy &&
                orderBy.type == CommunityOrderByType.MemberCount && {
                  members: { _count: orderBy.dir },
                }),
            },
            ...options,
          })
      )

      return {
        edges: results.edges,
        pageInfo: results.pageInfo,
      }
    },
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
    memberCount: async (community) => {
      const memberCount =
        (await prisma.community.findUnique({
          where: { id: community.id },
          include: { _count: { select: { members: true } } },
        }))!._count.members + 1

      return memberCount
    },
  },
}
