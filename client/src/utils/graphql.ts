import { GraphQLClient } from "graphql-request"

export const graphQLClient = new GraphQLClient(
  "http://localhost:4000/graphql",
  {
    credentials: "include",
    mode: "cors",
  }
)
