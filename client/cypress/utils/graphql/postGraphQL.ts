import { graphql } from "../../../src/graphql_codegen"

export const getPostTestDoc = graphql(/* GraphQL */ `
  query GetPostTest($input: PostInput!) {
    post(input: $input) {
      id
      body
      created_at
      updated_at
      title
      commentCount
      voteSum
      voteStatus
      community {
        id
      }
      owner {
        id
      }
    }
  }
`)

export const getPostsTestDoc = graphql(/* GraphQL */ `
  query GetPostsTestDoc($input: PostsInput!) {
    posts(input: $input) {
      edges {
        node {
          id
          created_at
          voteSum
          community {
            id
          }
          owner {
            id
          }
        }
      }
      pageInfo {
        endCursor {
          id
          voteSum
          created_at
        }
        hasNextPage
      }
      orderBy
    }
  }
`)
