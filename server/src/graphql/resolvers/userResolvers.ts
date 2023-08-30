import prisma from "../../config/prisma"
import { User } from "@prisma/client"
import { Resolvers } from "../../__generated__/resolvers-types"
import { paginate } from "../paginate"
import { GraphQLError } from "graphql"
import bcrypt from "bcrypt"

export const resolvers: Resolvers = {
  Query: {
    user: async (_0, args) => {
      const user = await prisma.user.findUnique({
        where: { username: args.input.username },
      })

      return user
    },
    users: async (_0, args) => {
      const filters = args.input?.filters
      const orderBy = filters?.orderBy

      const users = await paginate<User>(args.input.paginate, (options) =>
        prisma.user.findMany({
          where: {
            username: {
              contains: filters?.usernameContains ?? undefined,
            },
          },
          orderBy: {
            id: "asc",
          },
          ...options,
        })
      )

      return users
    },
    usernameExists: async (_0, args) => {
      const user = await prisma.user.findFirst({
        where: { username: args.username },
      })

      return user ? true : false
    },
  },
  Mutation: {
    changeUsername: async (_0, args, { req }) => {
      if (!req.session.userId) {
        throw new GraphQLError("Not signed in", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      const user = await prisma.user.findFirst({
        where: { id: req.session.userId },
      })

      if (!user) {
        throw new GraphQLError("User does not exist", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        })
      }

      const checkUserUsername = await prisma.user.findFirst({
        where: { username: args.input.newUsername },
      })

      if (checkUserUsername) {
        return {
          __typename: "ChangeUsernameInputError",
          errorMsg: "Invalid input",
          inputErrors: {
            username: "Username already in use",
          },
          code: 400,
        }
      }

      const usernameError =
        args.input.newUsername.trim().length < 5 ||
        args.input.newUsername.trim().length > 15
      const passwordError = !(await bcrypt.compare(
        args.input.password,
        user.password
      ))

      if (usernameError || passwordError) {
        return {
          __typename: "ChangeUsernameInputError",
          errorMsg: "Invalid input",
          code: 400,
          inputErrors: {
            username: usernameError
              ? "Username must be between 5 and 15 characters long"
              : null,
            password: passwordError ? "Incorrect password" : null,
          },
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id: req.session.userId },
        data: {
          username: args.input.newUsername,
        },
      })

      return {
        __typename: "ChangeUsernameSuccess",
        successMsg: "Successfully changed username",
        code: 200,
        user: updatedUser,
      }
    },
    changePassword: async (_0, args, { req }) => {
      if (!req.session.userId) {
        throw new GraphQLError("Not signed in", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      const user = await prisma.user.findFirst({
        where: { id: req.session.userId },
      })

      if (!user) {
        throw new GraphQLError("User does not exist", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        })
      }

      const currentPasswordError = !(await bcrypt.compare(
        args.input.currentPassword,
        user.password
      ))
      const newPasswordError = args.input.newPassword.length < 8

      if (currentPasswordError || newPasswordError) {
        return {
          __typename: "ChangePasswordInputError",
          errorMsg: "Invalid input",
          inputErrors: {
            currentPassword: currentPasswordError ? "Incorrect password" : null,
            newPassword: newPasswordError
              ? "Password must be at least 8 characters long"
              : null,
          },
          code: 400,
        }
      }

      const passwordHash = await bcrypt.hash(args.input.newPassword, 10)

      await prisma.user.update({
        where: { id: req.session.userId },
        data: {
          password: passwordHash,
        },
      })

      return {
        __typename: "ChangePasswordSuccess",
        successMsg: "Successfully changed password",
        code: 200,
      }
    },
    deleteUser: async (_0, args, { req }) => {
      if (!req.session.userId) {
        throw new GraphQLError("Not signed in", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      const user = await prisma.user.findUnique({
        where: { id: req.session.userId },
      })

      if (!user) {
        throw new GraphQLError("User does not exist", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        })
      }

      const usernameError = args.input.username !== user.username
      const passwordError = !(await bcrypt.compare(
        args.input.password,
        user.password
      ))

      if (usernameError || passwordError) {
        return {
          __typename: "DeleteUserInputError",
          errorMsg: "Invalid input",
          inputErrors: {
            username: usernameError ? "Please enter your username" : null,
            password: passwordError ? "Incorrect password" : null,
          },
          code: 400,
        }
      }

      await prisma.user.delete({ where: { id: req.session.userId } })

      return {
        __typename: "DeleteUserSuccess",
        successMsg: "Successfully deleted account",
        code: 200,
      }
    },
  },
  User: {
    postsCount: async (user) => {
      const postsCount = (await prisma.user.findUnique({
        where: { id: user.id },
        include: { _count: { select: { posts: true } } },
      }))!._count.posts

      return postsCount
    },
    commentsCount: async (user) => {
      const commentsCount = (await prisma.user.findUnique({
        where: { id: user.id },
        include: { _count: { select: { comments: true } } },
      }))!._count.comments

      return commentsCount
    },
  },
}
