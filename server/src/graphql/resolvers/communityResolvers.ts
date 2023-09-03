import { Community, Post, User } from "@prisma/client"
import { Resolvers } from "../../__generated__/resolvers-types"
import prisma from "../../config/prisma"
import { paginateCommunities } from "../paginate"
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

      const communities = await paginateCommunities(
        args.input.paginate,
        filters
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
          errorMsg: "Invalid input",
          code: 400,
          inputErrors: {
            title: "Title already in use",
          },
        }
      }

      if (args.input.title.trim().length > 25) {
        return {
          __typename: "CreateCommunityInputError",
          errorMsg: "Invalid input",
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
        throw new GraphQLError("Community does not exist", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        })
      }

      let updatedCommunity: Community
      let successMsg: string

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
    changeCommunityTitle: async (_0, args, { req }) => {
      if (!req.session.userId) {
        throw new GraphQLError("Not signed in", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      const community = await prisma.community.findFirst({
        where: { id: args.input.id },
        include: {
          owner: {
            select: {
              id: true,
            },
          },
        },
      })

      if (!community) {
        throw new GraphQLError("Community does not exist", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        })
      }

      if (community.owner.id !== req.session.userId) {
        throw new GraphQLError("Unauthorized", {
          extensions: { code: "UNAUTHORIZED" },
        })
      }

      const checkTitle = await prisma.community.findFirst({
        where: { title: args.input.newTitle },
      })

      if (checkTitle) {
        return {
          __typename: "ChangeCommunityTitleInputError",
          errorMsg: "Invalid input",
          inputErrors: {
            newTitle: "Community title already in use",
          },
          code: 400,
        }
      }

      if (args.input.newTitle.trim().length > 25) {
        return {
          __typename: "ChangeCommunityTitleInputError",
          errorMsg: "Invalid input",
          code: 400,
          inputErrors: {
            newTitle: "Title must be less than 25 characters long",
          },
        }
      }

      const updatedCommunity = await prisma.community.update({
        where: { id: args.input.id },
        data: {
          title: args.input.newTitle,
        },
      })

      return {
        __typename: "ChangeCommunityTitleSuccess",
        successMsg: "Successfully changed community title",
        code: 200,
        community: updatedCommunity,
      }
    },
    deleteCommunity: async (_0, args, { req }) => {
      if (!req.session.userId) {
        throw new GraphQLError("Not signed in", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      const community = await prisma.community.findFirst({
        where: { id: args.input.id },
        include: {
          owner: {
            select: {
              id: true,
            },
          },
        },
      })

      if (!community) {
        throw new GraphQLError("Community does not exist", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        })
      }

      if (community.owner.id !== req.session.userId) {
        throw new GraphQLError("Unauthorized", {
          extensions: { code: "UNAUTHORIZED" },
        })
      }

      const titleError = args.input.title !== community.title

      if (titleError) {
        return {
          __typename: "DeleteCommunityInputError",
          errorMsg: "Invalid title",
          inputErrors: {
            title: "Please enter your community's title",
          },
          code: 400,
        }
      }

      await prisma.community.delete({ where: { id: args.input.id } })

      return {
        __typename: "DeleteCommunitySuccess",
        successMsg: "Successfully deleted community",
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
