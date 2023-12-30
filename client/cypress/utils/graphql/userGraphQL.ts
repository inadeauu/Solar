import { graphql } from "../../../src/graphql_codegen/gql"

export const getUserTestDoc = graphql(/* GraphQL */ `
  query GetUserTest($input: UserInput!) {
    user(input: $input) {
      id
      username
      provider
      created_at
      updated_at
      postsCount
      commentsCount
    }
  }
`)
