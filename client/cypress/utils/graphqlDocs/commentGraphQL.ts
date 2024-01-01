import { graphql } from "../../../src/graphql_codegen/gql"

export const getCommentTestDoc = graphql(/* GraphQL */ `
  query GetCommentTest($input: CommentInput!) {
    comment(input: $input) {
      id
      body
      created_at
      updated_at
      voteSum
      voteStatus
      replyCount
      owner {
        id
      }
      post {
        id
      }
      parent {
        id
      }
    }
  }
`)

export const getCommentsTestDoc = graphql(/* GraphQL */ `
  query GetCommentsTest($input: CommentsInput!) {
    comments(input: $input) {
      edges {
        node {
          id
          created_at
          voteSum
          post {
            id
          }
          owner {
            id
          }
          parent {
            id
          }
        }
      }
      pageInfo {
        endCursor {
          id
          created_at
          voteSum
        }
        hasNextPage
      }
      orderBy
    }
  }
`)

export const createCommentTestDoc = graphql(/* GraphQL */ `
  mutation CreateCommentTest($input: CreateCommentInput!) {
    createComment(input: $input) {
      ... on CreateCommentSuccess {
        __typename
        successMsg
        code
        comment {
          id
        }
      }
      ... on CreateCommentInputError {
        __typename
        errorMsg
        code
        inputErrors {
          body
        }
      }
    }
  }
`)

export const createCommentReplyTestDoc = graphql(/* GraphQL */ `
  mutation CreateCommentReplyTest($input: CreateCommentReplyInput!) {
    createCommentReply(input: $input) {
      ... on CreateCommentReplySuccess {
        __typename
        successMsg
        code
        comment {
          id
        }
      }
      ... on CreateCommentReplyInputError {
        __typename
        errorMsg
        code
        inputErrors {
          body
          commentId
        }
      }
    }
  }
`)

export const voteCommentTestDoc = graphql(/* GraphQL */ `
  mutation VoteCommentTest($input: VoteCommentInput!) {
    voteComment(input: $input) {
      ... on VoteCommentSuccess {
        successMsg
        code
        comment {
          id
        }
      }
    }
  }
`)

export const editCommentTestDoc = graphql(/* GraphQL */ `
  mutation EditCommentTest($input: EditCommentInput!) {
    editComment(input: $input) {
      ... on EditCommentSuccess {
        __typename
        successMsg
        code
        comment {
          id
          body
        }
      }
      ... on EditCommentInputError {
        __typename
        errorMsg
        code
        inputErrors {
          body
        }
      }
    }
  }
`)

export const deleteCommentTestDoc = graphql(/* GraphQL */ `
  mutation DeleteCommentTest($input: DeleteCommentInput!) {
    deleteComment(input: $input) {
      ... on DeleteCommentSuccess {
        __typename
        successMsg
        code
      }
    }
  }
`)
