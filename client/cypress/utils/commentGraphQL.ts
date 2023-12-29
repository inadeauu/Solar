import { graphql } from "../../src/graphql_codegen/gql"

export const getCommentTestDoc = graphql(/* GraphQL */ `
  query GetCommentTest($input: CommentInput!) {
    comment(input: $input) {
      id
      body
    }
  }
`)
