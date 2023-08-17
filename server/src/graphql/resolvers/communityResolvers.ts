import { Community, Post, User } from "@prisma/client"
import {
  CommunityOrderByType,
  Resolvers,
} from "../../__generated__/resolvers-types"
import prisma from "../../config/prisma"
import { paginate } from "../paginate"
import { GraphQLError } from "graphql"

const checkCommunityTitleExists = async (title: string) => {
  const community = await prisma.community.findFirst({
    where: { title },
  })

  return community ? true : false
}

export const resolvers: Resolvers = {
  Query: {
    community: async (_0, args) => {
      const community = await prisma.community.findUnique({
        where: { id: args.input.id },
      })

      return community
    },
    communities: async (_0, args) => {
      const filters = args.input?.filters
      const orderBy = filters?.orderBy

      const communities = await paginate<Community>(
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

      return communities
    },
    titleExists: async (_0, args) => {
      return checkCommunityTitleExists(args.title)
    },
  },
  Mutation: {
    createCommunity: async (_0, args, { req }) => {
      if (!req.session.userId) {
        throw new GraphQLError("Not signed in", {
          extensions: { code: "UNAUTHENTICATED" },
        })
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

      if (args.input.title.length > 25) {
        return {
          __typename: "CreateCommunityInputError",
          errorMsg: "Input error",
          code: 400,
          inputErrors: {
            title: "Title must be less than 25 characters long",
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
    userJoinCommunity: async (_0, args, { req }) => {
      if (!req.session.userId) {
        throw new GraphQLError("Not signed in", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000))

      if (Math.random() < 0.9) {
        throw new GraphQLError("whoops")
      }

      const community = await prisma.community.findUnique({
        where: { id: args.input.communityId },
        include: {
          members: {
            where: {
              id: req.session.userId,
            },
          },
        },
      })

      if (!community) {
        throw new GraphQLError("Request failed", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        })
      }

      let successMsg: string
      let updatedCommunity: Community

      if (!community.members.length) {
        updatedCommunity = await prisma.community.update({
          where: { id: community.id },
          data: {
            members: {
              connect: {
                id: req.session.userId,
              },
            },
          },
        })

        successMsg = "Successfully joined community"
      } else {
        updatedCommunity = await prisma.community.update({
          where: { id: community.id },
          data: {
            members: {
              disconnect: {
                id: req.session.userId,
              },
            },
          },
        })

        successMsg = "Successfully left community"
      }

      return {
        __typename: "UserJoinCommunitySuccess",
        successMsg,
        code: 200,
        community: updatedCommunity,
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
    members: async (community, args) => {
      const members = await paginate<User>(args.input.paginate, (options) =>
        prisma.community
          .findUnique({ where: { id: community.id } })
          .members({ orderBy: { id: "asc" }, ...options })
      )

      return members
    },
    posts: async (community, args) => {
      const posts = await paginate<Post>(args.input.paginate, (options) =>
        prisma.community
          .findUnique({ where: { id: community.id } })
          .posts({ orderBy: { id: "asc" }, ...options })
      )

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
    postCount: async (community) => {
      const postCount = (await prisma.community.findUnique({
        where: { id: community.id },
        include: { _count: { select: { posts: true } } },
      }))!._count.posts

      return postCount
    },
    inCommunity: async (community, _0, { req }) => {
      if (!req.session.userId) return false

      const inCommunity = await prisma.community
        .findUnique({
          where: {
            id: community.id,
          },
        })
        .members({ where: { id: req.session.userId } })

      return inCommunity?.length ? true : false
    },
  },
}
