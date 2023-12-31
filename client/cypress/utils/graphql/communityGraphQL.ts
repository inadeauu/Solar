import { graphql } from "../../../src/graphql_codegen/gql"

export const getCommunityTestDoc = graphql(/* GraphQL */ `
  query GetCommunityTest($input: CommunityInput!) {
    community(input: $input) {
      id
      memberCount
      postCount
      inCommunity
      owner {
        id
      }
      title
      created_at
      updated_at
    }
  }
`)

export const getCommunitiesTestDoc = graphql(/* GraphQL */ `
  query GetCommunitiesTest($input: CommunitiesInput!) {
    communities(input: $input) {
      edges {
        node {
          id
          inCommunity
          owner {
            id
          }
          title
        }
      }
      pageInfo {
        endCursor {
          id
          created_at
          title
        }
        hasNextPage
      }
      memberOf
    }
  }
`)

export const communityTitleExistsTestDoc = graphql(/* GraphQL */ `
  query CommunityTitleExistsTest($title: String!) {
    titleExists(title: $title)
  }
`)
