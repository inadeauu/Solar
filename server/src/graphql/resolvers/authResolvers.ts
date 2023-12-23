import prisma from "../../config/prisma"
import { Resolvers } from "../../__generated__/resolvers-types"
import { Provider } from "@prisma/client"
import bcrypt from "bcrypt"
import { GraphQLError } from "graphql"

export const resolvers: Resolvers = {
  Query: {
    authUser: async (_0, _1, { req }) => {
      if (!req.session.userId) {
        return {
          __typename: "AuthUserSuccess",
          code: 200,
          user: null,
        }
      }

      const user = await prisma.user.findFirst({
        where: { id: req.session.userId },
      })

      return {
        __typename: "AuthUserSuccess",
        code: 200,
        user,
      }
    },
  },
  Mutation: {
    registerUsername: async (_0, args) => {
      const usernameError =
        args.input.username.trim().length < 5 ||
        args.input.username.trim().length > 15
      const passwordError = args.input.password.length < 8

      if (usernameError || passwordError) {
        return {
          __typename: "RegisterUsernameInputError",
          errorMsg: "Invalid input",
          inputErrors: {
            username: usernameError
              ? "Username must be between 5 and 15 characters long"
              : null,
            password: passwordError
              ? "Password must be at least 8 characters long"
              : null,
          },
          code: 400,
        }
      }

      const user = await prisma.user.findFirst({
        where: { username: args.input.username },
      })

      if (user) {
        return {
          __typename: "RegisterUsernameInputError",
          errorMsg: "Invalid input",
          inputErrors: {
            username: "Username already in use",
          },
          code: 400,
        }
      }

      const passwordHash = await bcrypt.hash(args.input.password, 10)

      await prisma.user.create({
        data: {
          username: args.input.username,
          password: passwordHash,
          provider: Provider.USERNAME,
        },
      })

      return {
        __typename: "RegisterUsernameSuccess",
        successMsg: "Successfully registered",
        code: 200,
      }
    },
    loginUsername: async (_0, args, { req }) => {
      const user = await prisma.user.findFirst({
        where: { username: args.input.username },
      })

      if (
        !user ||
        !(await bcrypt.compare(args.input.password, user.password))
      ) {
        return {
          __typename: "LoginUsernameInputError",
          errorMsg: "Invalid username and/or password",
          code: 400,
        }
      }

      req.session.userId = user.id

      return {
        __typename: "LoginUsernameSuccess",
        successMsg: "Successfully logged in",
        user: user,
        code: 200,
      }
    },
    logout: async (_0, _1, { req, res }) => {
      if (!req.session.userId) {
        throw new GraphQLError("Not signed in", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      return new Promise((resolve) =>
        req.session.destroy((err) => {
          if (err)
            throw new GraphQLError("Request failed", {
              extensions: { code: "INTERNAL_SERVER_ERROR" },
            })
          res.clearCookie("connect.sid")
          resolve({
            __typename: "LogoutSuccess",
            successMsg: "Successfully logged out",
            code: 200,
          })
        })
      )
    },
  },
}
