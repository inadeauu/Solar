import { graphql } from "../../src/graphql_codegen"

export const getPostTestDoc = graphql(/* GraphQL */ `
  query GetPostTest($input: PostInput!) {
    post(input: $input) {
      id
      body
      title
    }
  }
`)
