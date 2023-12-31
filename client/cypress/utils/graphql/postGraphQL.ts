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

export const createPostTestDoc = graphql(/* GraphQL */ `
  mutation CreatePostTest($input: CreatePostInput!) {
    createPost(input: $input) {
      ... on CreatePostSuccess {
        __typename
        successMsg
        code
        post {
          id
        }
      }
      ... on CreatePostInputError {
        __typename
        errorMsg
        code
        inputErrors {
          title
          body
          communityId
        }
      }
    }
  }
`)

export const votePostTestDoc = graphql(/* GraphQL */ `
  mutation VotePostTest($input: VotePostInput!) {
    votePost(input: $input) {
      ... on VotePostSuccess {
        successMsg
        code
        post {
          id
        }
      }
    }
  }
`)

export const editPostTestDoc = graphql(/* GraphQL */ `
  mutation EditPostTest($input: EditPostInput!) {
    editPost(input: $input) {
      ... on EditPostSuccess {
        __typename
        successMsg
        code
        post {
          id
        }
      }
      ... on EditPostInputError {
        __typename
        errorMsg
        code
        inputErrors {
          title
          body
        }
      }
    }
  }
`)

export const deletePostTestDoc = graphql(/* GraphQL */ `
  mutation DeletePostTest($input: DeletePostInput!) {
    deletePost(input: $input) {
      ... on DeletePostSuccess {
        __typename
        successMsg
        code
      }
    }
  }
`)
