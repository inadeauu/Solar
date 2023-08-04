import prisma from "../../config/prisma"
import { Resolvers } from "../../__generated__/resolvers-types"
import { validate } from "email-validator"
import { Provider } from "@prisma/client"
import bcrypt from "bcrypt"

export const resolvers: Resolvers = {
  Query: {
    getAuthUser: async (_0, _1, { req }) => {
      if (!req.session.userId) {
        return {
          __typename: "AuthenticationError",
          errorMsg: "No authenticated user",
          code: 401,
          user: null,
        }
      }

      const user = await prisma.user.findFirst({
        where: { id: req.session.userId },
      })

      return {
        __typename: "GetAuthUserSuccess",
        user,
      }
    },
  },
  Mutation: {
    emailRegister: async (_0, args) => {
      const usernameError =
        args.input.username.length < 5 || args.input.username.length > 15
      const emailError = !validate(args.input.email)
      const passwordError = args.input.password.length < 8

      if (usernameError || emailError || passwordError) {
        return {
          __typename: "EmailRegisterInputError",
          errorMsg: "Invalid input",
          inputErrors: {
            username: usernameError
              ? "Username must be between 5 and 15 characters long"
              : null,
            email: emailError ? "Invalid email" : null,
            password: passwordError
              ? "Password must be at least 8 characters long"
              : null,
          },
          code: 400,
        }
      }

      const user = await prisma.user.findFirst({
        where: { email: args.input.email, provider: Provider.EMAIL },
      })

      if (user) {
        return {
          __typename: "DuplicateEmailError",
          errorMsg: "Email already in use",
          code: 400,
        }
      }

      const passwordHash = await bcrypt.hash(args.input.password, 10)

      await prisma.user.create({
        data: {
          username: args.input.username,
          email: args.input.email,
          email_verified: false,
          password: passwordHash,
          provider: Provider.EMAIL,
        },
      })

      return {
        __typename: "EmailRegisterSuccess",
        successMsg: "Successfully registered",
      }
    },
    emailLogin: async (_0, args, { req }) => {
      const user = await prisma.user.findFirst({
        where: { email: args.input.email, provider: Provider.EMAIL },
      })

      if (
        !user ||
        !(await bcrypt.compare(args.input.password, user.password))
      ) {
        return {
          __typename: "EmailLoginInputError",
          errorMsg: "Invalid email and/or password",
          code: 400,
        }
      }

      req.session.userId = user.id

      return {
        __typename: "EmailLoginSuccess",
        successMsg: "Successfully logged in",
      }
    },
  },
}
