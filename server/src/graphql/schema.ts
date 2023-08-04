import path from "path"
import { loadFilesSync } from "@graphql-tools/load-files"
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge"
import { makeExecutableSchema } from "@graphql-tools/schema"

import { typeDefs as scalarTypeDefs } from "graphql-scalars"
import { resolvers as scalarResolvers } from "graphql-scalars"

const typesArray = loadFilesSync(path.join(__dirname, "./schemas"))
const resolverFiles = loadFilesSync(path.join(__dirname, "./resolvers"))

const typeDefs = mergeTypeDefs([...typesArray, scalarTypeDefs])
const resolvers = mergeResolvers([...resolverFiles, scalarResolvers])

const schema = makeExecutableSchema({ typeDefs, resolvers })

export default schema
