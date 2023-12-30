import { ClientError } from "graphql-request"
import { graphQLClient } from "../../../src/utils/graphql"
import {
  changePasswordTestDoc,
  changeUsernameTestDoc,
  deleteUserTestDoc,
  getUserTestDoc,
  getUsersTestDoc,
  usernameExistsTestDoc,
} from "../../utils/graphql/userGraphQL"
import { loginUsernameTestDoc } from "../../utils/graphql/authGraphQL"

beforeEach(function () {
  cy.exec("npm --prefix ../server run resetDb")
  cy.exec("npm --prefix ../server run seed")
  cy.visit("/")
})

describe("User endpoint", function () {
  it("Check it returns the correct information about a registered user", function () {
    cy.wrap(graphQLClient.request(getUserTestDoc, { input: { username: "username1" } }))
      .its("user")
      .should((res) => expect(res.id).to.eq("8d2efb36-a726-425c-ad12-98f2683c5d86"))
      .should((res) => expect(res.username).to.eq("username1"))
      .should((res) => expect(res.provider).to.eq("USERNAME"))
      .should((res) => expect(res.created_at).to.eq("2023-02-27T23:47:05.637Z"))
      .should((res) => expect(res.updated_at).to.eq("2023-02-27T23:47:05.637Z"))
      .should((res) => expect(res.postsCount).to.eq(19))
      .should((res) => expect(res.commentsCount).to.eq(31))
  })

  it("Check it returns null for an unregistered user", function () {
    cy.wrap(graphQLClient.request(getUserTestDoc, { input: { username: "abc" } }))
      .its("user")
      .should("eq", null)
  })
})

describe("Users endpoint", function () {
  it("Check pagination", function () {
    cy.then(() => {
      cy.wrap(
        graphQLClient.request(getUsersTestDoc, {
          input: { paginate: { first: 2 }, filters: { usernameContains: "user" } },
        })
      )
        .its("users")
        .should((res) => expect(res.edges.length).to.eq(2))
        .should((res) => expect(res.edges[0].node.username).to.eq("username1"))
        .should((res) => expect(res.edges[1].node.username).to.eq("username2"))
        .should((res) => expect(res.pageInfo.hasNextPage).to.eq(true))
        .should((res) => expect(res.pageInfo.endCursor.id).to.eq("266c189f-5986-404a-9889-0a54c298acb2"))
        .should((res) => expect(res.pageInfo.endCursor.title).to.eq("username2"))
    })

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(getUsersTestDoc, {
          input: {
            paginate: { first: 2, after: { id: "266c189f-5986-404a-9889-0a54c298acb2", title: "username2" } },
            filters: { usernameContains: "user" },
          },
        })
      )
        .its("users")
        .should((res) => expect(res.edges.length).to.eq(1))
        .should((res) => expect(res.edges[0].node.username).to.eq("username3"))
        .should((res) => expect(res.pageInfo.hasNextPage).to.eq(false))
        .should((res) => expect(res.pageInfo.endCursor).to.eq(null))
    })
  })

  describe("Pagination input validation - Take", function () {
    beforeEach(function () {
      cy.on("fail", (error) => {
        if (error instanceof ClientError) {
          if (!error.response.errors || error.response.errors?.length == 0) throw new Error("No error returned")
          expect(error.response.errors[0].extensions.code).to.eq("PAGINATION_ERROR")
          expect(error.response.errors[0].message).to.eq("First must be between 0 and 100")
          return
        }

        throw new Error("Uncaught error (should not be reached)")
      })
    })

    it("Check error with negative amount", function () {
      cy.wrap(
        graphQLClient.request(getUsersTestDoc, {
          input: {
            paginate: { first: -2 },
            filters: { usernameContains: "user" },
          },
        })
      )
    })

    it("Check error with amount over 100", function () {
      cy.wrap(
        graphQLClient.request(getUsersTestDoc, {
          input: {
            paginate: { first: 105 },
            filters: { usernameContains: "user" },
          },
        })
      )
    })
  })

  describe("Pagination input validation - Cursor", function () {
    it("Check error if no title supplied when cursor given", function () {
      cy.on("fail", (error) => {
        if (error instanceof ClientError) {
          if (!error.response.errors || error.response.errors?.length == 0) throw new Error("No error returned")
          expect(error.response.errors[0].extensions.code).to.eq("PAGINATION_ERROR")
          expect(error.response.errors[0].message).to.eq("Title must be specified with cursor")
          return
        }

        throw new Error("Uncaught error (should not be reached)")
      })

      cy.wrap(
        graphQLClient.request(getUsersTestDoc, {
          input: {
            paginate: { first: 5, after: { id: "abc" } },
            filters: { usernameContains: "user" },
          },
        })
      )
    })
  })
})

describe("Username exists endpoint", function () {
  it("Check returns true for username in use", function () {
    cy.wrap(graphQLClient.request(usernameExistsTestDoc, { username: "username1" }))
      .its("usernameExists")
      .should("eq", true)
  })

  it("Check returns false for username not in use", function () {
    cy.wrap(graphQLClient.request(usernameExistsTestDoc, { username: "abc" }))
      .its("usernameExists")
      .should("eq", false)
  })
})

describe("Change username endpoint", function () {
  it("Check not signed in error response", function () {
    cy.on("fail", (error) => {
      if (error instanceof ClientError) {
        if (!error.response.errors || error.response.errors?.length == 0) throw new Error("No error returned")
        expect(error.response.errors[0].extensions.code).to.eq("UNAUTHENTICATED")
        expect(error.response.errors[0].message).to.eq("Not signed in")
        return
      }

      throw new Error("Uncaught error (should not be reached)")
    })

    cy.wrap(
      graphQLClient.request(changeUsernameTestDoc, { input: { newUsername: "newUsername", password: "password" } })
    )
  })

  it("Check user does not exist error response", function () {
    cy.on("fail", (error) => {
      if (error instanceof ClientError) {
        if (!error.response.errors || error.response.errors?.length == 0) throw new Error("No error returned")
        expect(error.response.errors[0].extensions.code).to.eq("INTERNAL_SERVER_ERROR")
        expect(error.response.errors[0].message).to.eq("User does not exist")
        return
      }

      throw new Error("Uncaught error (should not be reached)")
    })

    cy.setCookie("test-user", "abc")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(changeUsernameTestDoc, { input: { newUsername: "newUsername", password: "password" } })
      )
    })
  })

  it("Check invalid input responses", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(changeUsernameTestDoc, { input: { newUsername: "username1", password: "password" } })
      )
        .its("changeUsername")
        .should((res) => expect(res.code).to.eq(400))
        .should((res) => expect(res.errorMsg).to.eq("Invalid input"))
        .should((res) => expect(res.inputErrors.username).to.eq("Username already in use"))
    })

    cy.then(() => {
      cy.wrap(graphQLClient.request(changeUsernameTestDoc, { input: { newUsername: "abc", password: "random" } }))
        .its("changeUsername")
        .should((res) => expect(res.code).to.eq(400))
        .should((res) => expect(res.errorMsg).to.eq("Invalid input"))
        .should((res) => expect(res.inputErrors.username).to.eq("Username must be between 5 and 15 characters long"))
        .should((res) => expect(res.inputErrors.password).to.eq("Incorrect password"))
    })

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(changeUsernameTestDoc, {
          input: { newUsername: "thisIsALongUsername", password: "password" },
        })
      )
        .its("changeUsername")
        .should((res) => expect(res.code).to.eq(400))
        .should((res) => expect(res.errorMsg).to.eq("Invalid input"))
        .should((res) => expect(res.inputErrors.username).to.eq("Username must be between 5 and 15 characters long"))
        .should((res) => expect(res.inputErrors.password).to.eq(null))
    })
  })

  it("Check successfully changes username", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(changeUsernameTestDoc, {
          input: { newUsername: "newUsername", password: "password" },
        })
      )
        .its("changeUsername")
        .should((res) => expect(res.code).to.eq(200))
        .should((res) => expect(res.successMsg).to.eq("Successfully changed username"))
        .should((res) => expect(res.user.username).to.eq("newUsername"))
    })

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(getUserTestDoc, {
          input: { username: "newUsername" },
        })
      )
        .its("user")
        .should("not.eq", null)
    })
  })
})

describe("Change password endpoint", function () {
  it("Check not signed in error response", function () {
    cy.on("fail", (error) => {
      if (error instanceof ClientError) {
        if (!error.response.errors || error.response.errors?.length == 0) throw new Error("No error returned")
        expect(error.response.errors[0].extensions.code).to.eq("UNAUTHENTICATED")
        expect(error.response.errors[0].message).to.eq("Not signed in")
        return
      }

      throw new Error("Uncaught error (should not be reached)")
    })

    cy.wrap(
      graphQLClient.request(changePasswordTestDoc, {
        input: { currentPassword: "password", newPassword: "newPassword" },
      })
    )
  })

  it("Check user does not exist error response", function () {
    cy.on("fail", (error) => {
      if (error instanceof ClientError) {
        if (!error.response.errors || error.response.errors?.length == 0) throw new Error("No error returned")
        expect(error.response.errors[0].extensions.code).to.eq("INTERNAL_SERVER_ERROR")
        expect(error.response.errors[0].message).to.eq("User does not exist")
        return
      }

      throw new Error("Uncaught error (should not be reached)")
    })

    cy.setCookie("test-user", "abc")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(changePasswordTestDoc, {
          input: { currentPassword: "password", newPassword: "newPassword" },
        })
      )
    })
  })

  it("Check invalid input response", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(changePasswordTestDoc, {
          input: { currentPassword: "random", newPassword: "abc" },
        })
      )
        .its("changePassword")
        .should((res) => expect(res.code).to.eq(400))
        .should((res) => expect(res.errorMsg).to.eq("Invalid input"))
        .should((res) => expect(res.inputErrors.currentPassword).to.eq("Incorrect password"))
        .should((res) => expect(res.inputErrors.newPassword).to.eq("Password must be at least 8 characters long"))
    })
  })

  it("Check successfully changes password", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(changePasswordTestDoc, {
          input: { currentPassword: "password", newPassword: "newPassword" },
        })
      )
        .its("changePassword")
        .should((res) => expect(res.code).to.eq(200))
        .should((res) => expect(res.successMsg).to.eq("Successfully changed password"))
    })

    cy.clearCookie("test-user")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(loginUsernameTestDoc, {
          input: { username: "username1", password: "newPassword" },
        })
      )
        .its("loginUsername")
        .should((res) => expect(res.code).to.eq(200))
    })
  })
})

describe("Delete user endpoint", function () {
  it("Check not signed in error response", function () {
    cy.on("fail", (error) => {
      if (error instanceof ClientError) {
        if (!error.response.errors || error.response.errors?.length == 0) throw new Error("No error returned")
        expect(error.response.errors[0].extensions.code).to.eq("UNAUTHENTICATED")
        expect(error.response.errors[0].message).to.eq("Not signed in")
        return
      }

      throw new Error("Uncaught error (should not be reached)")
    })

    cy.wrap(
      graphQLClient.request(deleteUserTestDoc, {
        input: { username: "username1", password: "password" },
      })
    )
  })

  it("Check user does not exist error response", function () {
    cy.on("fail", (error) => {
      if (error instanceof ClientError) {
        if (!error.response.errors || error.response.errors?.length == 0) throw new Error("No error returned")
        expect(error.response.errors[0].extensions.code).to.eq("INTERNAL_SERVER_ERROR")
        expect(error.response.errors[0].message).to.eq("User does not exist")
        return
      }

      throw new Error("Uncaught error (should not be reached)")
    })

    cy.setCookie("test-user", "abc")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(deleteUserTestDoc, {
          input: { username: "username1", password: "password" },
        })
      )
    })
  })

  it("Check invalid input response", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(deleteUserTestDoc, {
          input: { username: "user", password: "random" },
        })
      )
        .its("deleteUser")
        .should((res) => expect(res.code).to.eq(400))
        .should((res) => expect(res.errorMsg).to.eq("Invalid input"))
        .should((res) => expect(res.inputErrors.username).to.eq("Please enter your username"))
        .should((res) => expect(res.inputErrors.password).to.eq("Incorrect password"))
    })
  })

  it("Check successfully deletes account", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(deleteUserTestDoc, {
          input: { username: "username1", password: "password" },
        })
      )
        .its("deleteUser")
        .should((res) => expect(res.code).to.eq(200))
        .should((res) => expect(res.successMsg).to.eq("Successfully deleted account"))
    })

    cy.then(() => {
      cy.wrap(graphQLClient.request(getUserTestDoc, { input: { username: "username1" } }))
        .its("user")
        .should("eq", null)
    })
  })
})
