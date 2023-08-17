import express, { Request, Response } from "express"
import * as dotenv from "dotenv"
dotenv.config()
import "express-async-errors"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import cors from "cors"
import http from "http"
import helmet from "helmet"
import session from "express-session"
import routes from "./rest/routes"
import { corsOptions } from "./config/corsOptions"
import { env } from "./config/env"
import { expressMiddleware } from "@apollo/server/express4"
import schema from "./graphql/schema"
import { ApolloServer } from "@apollo/server"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import { unwrapResolverError } from "@apollo/server/errors"
import { Prisma } from "@prisma/client"
import { ApolloArmor } from "@escape.tech/graphql-armor"

export interface Context {
  req: Request
  res: Response
}

const main = async () => {
  const app = express()

  const isProduction: boolean = process.env.NODE_ENV === "production"

  app.use(cors(corsOptions))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cookieParser(env.COOKIE_SECRET))

  app.use(
    session({
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        sameSite: "none",
        httpOnly: true,
        secure: isProduction,
      },
    })
  )

  app.use(
    helmet({
      crossOriginEmbedderPolicy: isProduction,
      contentSecurityPolicy: isProduction,
    })
  )

  routes(app)

  const httpServer = http.createServer(app)
  const armor = new ApolloArmor()

  const server = new ApolloServer<Context>({
    schema,
    ...armor.protect(),
    csrfPrevention: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: (formattedError, error) => {
      if (
        unwrapResolverError(error) instanceof
        Prisma.PrismaClientKnownRequestError
      ) {
        return {
          ...formattedError,
          message: "Request failed",
          extensions: {
            ...formattedError?.extensions,
            code: "INTERNAL_SERVER_ERROR",
          },
          status: 500,
        }
      }

      return formattedError
    },
  })

  await server.start()

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }) => ({
        req,
        res,
      }),
    })
  )

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  )

  console.log("Server running on: http://localhost:4000")
}

main()
