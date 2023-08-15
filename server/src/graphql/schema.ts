import path from "path"
import { loadFilesSync } from "@graphql-tools/load-files"
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge"
import { makeExecutableSchema } from "@graphql-tools/schema"

import { typeDefs as scalarTypeDefs } from "graphql-scalars"
import { resolvers as scalarResolvers } from "graphql-scalars"

import { rateLimitDirective } from "graphql-rate-limit-directive"
import { GraphQLError } from "graphql"

const onLimit = (resource: any) => {
  const ms = resource.msBeforeNext
  const minutes = Math.floor(ms / 60000)
  const seconds = ((ms % 60000) / 1000).toFixed(0)

  throw new GraphQLError(
    `Too many requests, try again in ${
      minutes ? minutes + "m " : ""
    }${seconds}s`,
    {
      extensions: { code: "RATE_LIMITED" },
    }
  )
}

const { rateLimitDirectiveTypeDefs, rateLimitDirectiveTransformer } =
  rateLimitDirective({
    onLimit,
  })

const typesArray = loadFilesSync(path.join(__dirname, "./schemas"))
const resolverFiles = loadFilesSync(path.join(__dirname, "./resolvers"))

const typeDefs = mergeTypeDefs([
  ...typesArray,
  scalarTypeDefs,
  rateLimitDirectiveTypeDefs,
])
const resolvers = mergeResolvers([...resolverFiles, scalarResolvers])

const schema = rateLimitDirectiveTransformer(
  makeExecutableSchema({ typeDefs, resolvers })
)

export default schema
