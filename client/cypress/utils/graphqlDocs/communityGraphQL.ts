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

export const createCommunityTestDoc = graphql(/* GraphQL */ `
  mutation CreateCommunityTest($input: CreateCommunityInput!) {
    createCommunity(input: $input) {
      ... on CreateCommunitySuccess {
        __typename
        successMsg
        code
        community {
          id
        }
      }
      ... on CreateCommunityInputError {
        __typename
        errorMsg
        code
        inputErrors {
          title
        }
      }
    }
  }
`)

export const joinCommunityTestDoc = graphql(/* GraphQL */ `
  mutation JoinCommunityTest($input: UserJoinCommunityInput!) {
    userJoinCommunity(input: $input) {
      ... on UserJoinCommunitySuccess {
        __typename
        successMsg
        code
        community {
          id
          inCommunity
        }
      }
    }
  }
`)

export const changeCommunityTitleTestDoc = graphql(/* GraphQL */ `
  mutation ChangeCommunityTitleTest($input: ChangeCommunityTitleInput!) {
    changeCommunityTitle(input: $input) {
      ... on ChangeCommunityTitleSuccess {
        __typename
        successMsg
        code
        community {
          id
        }
      }
      ... on ChangeCommunityTitleInputError {
        __typename
        errorMsg
        code
        inputErrors {
          newTitle
        }
      }
    }
  }
`)

export const deleteCommunityTestDoc = graphql(/* GraphQL */ `
  mutation DeleteCommunityTest($input: DeleteCommunityInput!) {
    deleteCommunity(input: $input) {
      ... on DeleteCommunitySuccess {
        __typename
        successMsg
        code
      }
      ... on DeleteCommunityInputError {
        __typename
        errorMsg
        code
        inputErrors {
          title
        }
      }
    }
  }
`)
