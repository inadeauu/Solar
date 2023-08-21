import { graphql } from "../graphql_codegen/gql"

export const votePostDocument = graphql(/* GraphQL */ `
  mutation VotePost($input: VotePostInput!) {
    votePost(input: $input) {
      ... on VotePostSuccess {
        successMsg
        code
        post {
          id
          body
          created_at
          title
          commentCount
          voteSum
          voteStatus
          community {
            id
            title
          }
          owner {
            id
            username
          }
        }
      }
    }
  }
`)
