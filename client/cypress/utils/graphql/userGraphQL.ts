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

export const getUsersTestDoc = graphql(/* GraphQL */ `
  query GetUsersTest($input: UsersInput!) {
    users(input: $input) {
      edges {
        node {
          username
        }
      }
      pageInfo {
        endCursor {
          id
          title
        }
        hasNextPage
      }
    }
  }
`)

export const usernameExistsTestDoc = graphql(/* GraphQL */ `
  query UsernameExistsTest($username: String!) {
    usernameExists(username: $username)
  }
`)

export const changeUsernameTestDoc = graphql(/* GraphQL */ `
  mutation ChangeUsernameTest($input: ChangeUsernameInput!) {
    changeUsername(input: $input) {
      ... on ChangeUsernameSuccess {
        __typename
        successMsg
        code
        user {
          username
        }
      }
      ... on ChangeUsernameInputError {
        __typename
        errorMsg
        code
        inputErrors {
          username
          password
        }
      }
    }
  }
`)

export const changePasswordTestDoc = graphql(/* GraphQL */ `
  mutation ChangePasswordTest($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      ... on ChangePasswordSuccess {
        __typename
        successMsg
        code
      }
      ... on ChangePasswordInputError {
        __typename
        errorMsg
        code
        inputErrors {
          currentPassword
          newPassword
        }
      }
    }
  }
`)

export const deleteUserTestDoc = graphql(/* GraphQL */ `
  mutation DeleteUsertest($input: DeleteUserInput!) {
    deleteUser(input: $input) {
      ... on DeleteUserSuccess {
        __typename
        successMsg
        code
      }
      ... on DeleteUserInputError {
        __typename
        errorMsg
        code
        inputErrors {
          password
          username
        }
      }
    }
  }
`)
