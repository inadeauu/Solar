import { graphql } from "../../../src/graphql_codegen"

export const authUserTestDoc = graphql(/* GraphQL */ `
  query AuthUserTest {
    authUser {
      ... on AuthUserSuccess {
        __typename
        successMsg
        code
        user {
          id
        }
      }
    }
  }
`)

export const registerUsernameTestDoc = graphql(/* GraphQL */ `
  mutation RegisterUsernameTest($input: RegisterUsernameInput!) {
    registerUsername(input: $input) {
      ... on RegisterUsernameSuccess {
        __typename
        successMsg
        code
      }
      ... on RegisterUsernameInputError {
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

export const loginUsernameTestDoc = graphql(/* GraphQL */ `
  mutation LoginUsernameTest($input: LoginUsernameInput!) {
    loginUsername(input: $input) {
      ... on LoginUsernameSuccess {
        __typename
        successMsg
        user {
          id
        }
        code
      }
      ... on Error {
        __typename
        errorMsg
        code
      }
    }
  }
`)

export const logoutTestDoc = graphql(/* GraphQL */ `
  mutation LogoutTest {
    logout {
      ... on LogoutSuccess {
        __typename
        successMsg
        code
      }
    }
  }
`)
