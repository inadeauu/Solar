import express, { Request, Response } from "express"
import * as dotenv from "dotenv"
dotenv.config()
import "express-async-errors"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import cors from "cors"
import { corsOptions } from "./config/corsOptions"
import { env } from "./rest/utils/env"
import http from "http"
import helmet from "helmet"
import session from "express-session"
import { expressMiddleware } from "@apollo/server/express4"
import schema from "./graphql/schema"
import { ApolloServer } from "@apollo/server"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import { unwrapResolverError } from "@apollo/server/errors"
import { Prisma } from "@prisma/client"
import routes from "./rest/routes"

export interface Context {
  req: Request
  res: Response
}

const main = async () => {
  const app = express()

  app.use(
    session({
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        sameSite: "none",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      },
    })
  )

  const isDevelopment = process.env.NODE_ENV === "development"

  app.use(
    helmet({
      crossOriginEmbedderPolicy: !isDevelopment,
      contentSecurityPolicy: !isDevelopment,
    })
  )

  const httpServer = http.createServer(app)

  const server = new ApolloServer<Context>({
    schema,
    csrfPrevention: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: (formattedError, error) => {
      if (
        unwrapResolverError(error) instanceof
        Prisma.PrismaClientKnownRequestError
      ) {
        return {
          ...formattedError,
          message: "Database error",
          extensions: { ...formattedError?.extensions, code: "DATABASE_ERROR" },
        }
      }

      return formattedError
    },
  })

  await server.start()

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(corsOptions),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    cookieParser(env.COOKIE_SECRET),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({
        req,
        res,
      }),
    })
  )

  routes(app)

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  )

  console.log("Server running on: http://localhost:4000")
}

main()
