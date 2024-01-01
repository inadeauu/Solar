import { graphQLClient } from "../../../src/utils/graphql"
import { loginUsernameTestDoc } from "../../utils/graphqlDocs/authGraphQL"
import { getUserTestDoc } from "../../utils/graphqlDocs/userGraphQL"
import { aliasMutation } from "../../utils/graphqlTest"

beforeEach(function () {
  cy.exec("npm --prefix ../server run resetDb")
  cy.exec("npm --prefix ../server run seed")

  cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
    aliasMutation(req, "ChangeUsername")
    aliasMutation(req, "ChangePassword")
    aliasMutation(req, "DeleteUser")
  })
})

describe("Navigation", function () {
  it("Redirect home if not logged in", function () {
    cy.visit("/settings")
    cy.location("pathname").should("eq", "/")
  })
})

describe("Account settings menu", function () {
  beforeEach(function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
    cy.visit("/settings")
  })

  it("Check correct information displayed", function () {
    cy.get('[data-testid="settings-current-username"]').should("have.text", "Current username: username1")
  })

  it("Check opening and closing change username modal", function () {
    cy.get('[data-testid="change-username-button"]').click()

    cy.get('[data-testid="username-change-modal"]').should("be.visible")
    cy.get('[data-testid="username-change-modal-close-button"]').click()
    cy.get('[data-testid="username-change-modal"]').should("not.be.visible")
  })

  it("Check opening and closing change password modal", function () {
    cy.get('[data-testid="change-password-button"]').click()

    cy.get('[data-testid="password-change-modal"]').should("be.visible")
    cy.get('[data-testid="password-change-modal-close-button"]').click()
    cy.get('[data-testid="password-change-modal"]').should("not.be.visible")
  })

  it("Check opening and closing delete account modal", function () {
    cy.get('[data-testid="delete-account-button"]').click()

    cy.get('[data-testid="delete-account-modal"]').should("be.visible")
    cy.get('[data-testid="delete-account-modal-close-button"]').click()
    cy.get('[data-testid="delete-account-modal"]').should("not.be.visible")
  })
})

describe("Change username modal", function () {
  beforeEach(function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
    cy.visit("/settings")
  })

  it("Check input validation", function () {
    cy.get('[data-testid="change-username-button"]').as("change-username-button").click()

    cy.get('[data-testid="username-change-password-input"]').as("password-input").focus().blur()
    cy.get('[data-testid="username-change-password-error"]').as("password-error").should("have.text", "Required")
    cy.get("@password-input").type("text").blur()
    cy.get("@password-error").should("have.text", "")

    cy.get('[data-testid="username-change-newUsername-input"]').as("new-username-input").focus().blur()
    cy.get('[data-testid="username-change-newUsername-error"]').as("new-username-error").should("have.text", "Required")
    cy.get("@new-username-input").type("abc")
    cy.get("@new-username-error").should("have.text", "Username must be 5-15 characters long")

    cy.get("@new-username-input").clear().type("username1")
    cy.get("@new-username-error").should("have.text", "Username already in use")

    cy.get("@new-username-input").clear().type("thisIsALongUsername")
    cy.get("@new-username-error").should("have.text", "Username must be 5-15 characters long")

    cy.get('[data-testid="username-change-modal-close-button"]').click()
    cy.get("@change-username-button").click()

    cy.get('[data-testid="username-change-submit-button"]').as("submit-button").click()
    cy.get("@password-error").should("have.text", "Required")
    cy.get("@new-username-error").should("have.text", "Required")
    cy.get('[data-testid="username-change-modal"]').as("username-change-modal").should("be.visible")

    cy.get("@password-input").type("random")
    cy.get("@new-username-input").type("newUsername")
    cy.get("@submit-button").click()
    cy.get("@username-change-modal").should("be.visible")
    cy.get("@password-error").should("have.text", "Incorrect password")
  })

  it("Check username is successfully changed", function () {
    cy.get('[data-testid="change-username-button"]').as("change-username-button").click()

    cy.get('[data-testid="username-change-password-input"]').type("password")
    cy.get('[data-testid="username-change-newUsername-input"]').type("newUsername")
    cy.get('[data-testid="username-change-submit-button"]').click()

    cy.wait("@gqlChangeUsernameMutation").then(({ response }) => {
      cy.wrap(response?.body.data)
        .its("changeUsername")
        .should((res) => expect(res.code).to.eq(200))
        .should((res) => expect(res.successMsg).to.eq("Successfully changed username"))
        .should((res) => expect(res.user.id).to.eq("8d2efb36-a726-425c-ad12-98f2683c5d86"))
        .should((res) => expect(res.user.username).to.eq("newUsername"))
    })

    cy.get('[data-testid="username-change-modal"]').should("not.be.visible")
    cy.get('[data-testid="settings-current-username"]').should("have.text", "Current username: newUsername")
  })

  it("Check error response", function () {
    cy.get('[data-testid="change-username-button"]').as("change-username-button").click()

    cy.get('[data-testid="username-change-password-input"]').type("password")
    cy.get('[data-testid="username-change-newUsername-input"]').type("newUsername")

    cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
      if (req.body.operationName == "ChangeUsername") {
        req.reply({ fixture: "/profile/errors/changeUsernameInput.json" })
      }
    })

    cy.get('[data-testid="username-change-submit-button"]').click()
    cy.get('[data-testid="username-change-modal"]').should("be.visible")
    cy.get('[data-testid="username-change-newUsername-error"]').should("have.text", "Invalid username")
    cy.get('[data-testid="username-change-password-error"]').should("have.text", "Invalid password")
  })
})

describe("Change password modal", function () {
  beforeEach(function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
    cy.visit("/settings")
  })

  it("Check input validation", function () {
    cy.get('[data-testid="change-password-button"]').click()

    cy.get('[data-testid="password-change-current-password-input"]').as("current-password-input").focus().blur()
    cy.get('[data-testid="password-change-current-password-error"]')
      .as("current-password-error")
      .should("have.text", "Required")

    cy.get('[data-testid="password-change-new-password-input"]').as("new-password-input").focus().blur()
    cy.get('[data-testid="password-change-new-password-error"]')
      .as("new-password-error")
      .should("have.text", "Required")

    cy.get('[data-testid="password-change-confirm-password-input"]').as("confirm-password-input").focus().blur()
    cy.get('[data-testid="password-change-confirm-password-error"]')
      .as("confirm-password-error")
      .should("have.text", "Required")

    cy.get('[data-testid="password-change-modal-close-button"]').click()
    cy.get('[data-testid="change-password-button"]').click()
    cy.get('[data-testid="password-change-submit-button"]').click()
    cy.get("@current-password-error").should("have.text", "Required")
    cy.get("@new-password-error").should("have.text", "Required")
    cy.get("@confirm-password-error").should("have.text", "Required")
    cy.get('[data-testid="password-change-modal"]').as("password-change-modal").should("be.visible")

    cy.get("@new-password-input").type("abc").blur()
    cy.get("@new-password-error").should("have.text", "Password must be at least 8 characters long")

    cy.get("@new-password-input").clear().type("newPassword").blur()
    cy.get("@new-password-error").should("have.text", "")

    cy.get("@confirm-password-input").type("abc").blur()
    cy.get("@confirm-password-error").should("have.text", "Passwords do not match")

    cy.get("@confirm-password-input").clear().type("newPassword").blur()
    cy.get("@confirm-password-error").should("have.text", "")

    cy.get("@current-password-input").type("abc").blur()
    cy.get("@current-password-error").should("have.text", "")

    cy.get('[data-testid="password-change-submit-button"]').click()
    cy.get("@password-change-modal").should("be.visible")

    cy.get("@current-password-error").should("have.text", "Incorrect password")
  })

  it("Check password successfully changed", function () {
    cy.get('[data-testid="change-password-button"]').click()

    cy.get('[data-testid="password-change-current-password-input"]').type("password")
    cy.get('[data-testid="password-change-new-password-input"]').type("newPassword")
    cy.get('[data-testid="password-change-confirm-password-input"]').type("newPassword")
    cy.get('[data-testid="password-change-submit-button"]').click()

    cy.wait("@gqlChangePasswordMutation").then(({ response }) => {
      cy.wrap(response?.body.data)
        .its("changePassword")
        .should((res) => expect(res.code).to.eq(200))
        .should((res) => expect(res.successMsg).to.eq("Successfully changed password"))
    })

    cy.get('[data-testid="password-change-modal"]').should("not.be.visible")

    cy.clearCookie("test-user")

    cy.wrap(null).then(() => {
      cy.wrap(
        graphQLClient.request(loginUsernameTestDoc, { input: { username: "username1", password: "newPassword" } })
      )
        .its("loginUsername")
        .should((res) => expect(res.code).to.eq(200))
        .should((res) => expect(res.successMsg).to.eq("Successfully logged in"))
        .should((res) => expect(res.user.id).to.eq("8d2efb36-a726-425c-ad12-98f2683c5d86"))
    })
  })

  it("Check error response", function () {
    cy.get('[data-testid="change-password-button"]').click()

    cy.get('[data-testid="password-change-current-password-input"]').type("password")
    cy.get('[data-testid="password-change-new-password-input"]').type("newPassword")
    cy.get('[data-testid="password-change-confirm-password-input"]').type("newPassword")

    cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
      if (req.body.operationName == "ChangePassword") {
        req.reply({ fixture: "/profile/errors/changePasswordInput.json" })
      }
    })

    cy.get('[data-testid="password-change-submit-button"]').click()
    cy.get('[data-testid="password-change-modal"]').should("be.visible")
    cy.get('[data-testid="password-change-current-password-error"]').should("have.text", "Invalid current password")
    cy.get('[data-testid="password-change-new-password-error"]').should("have.text", "Invalid new password")
  })
})

describe("Delete account modal", function () {
  beforeEach(function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
    cy.visit("/settings")
  })

  it("Check input validation", function () {
    cy.get('[data-testid="delete-account-button"]').click()

    cy.get('[data-testid="delete-account-username-input"]').as("username-input").focus().blur()
    cy.get('[data-testid="delete-account-username-error"]').as("username-error").should("have.text", "Required")

    cy.get('[data-testid="delete-account-password-input"]').as("password-input").focus().blur()
    cy.get('[data-testid="delete-account-password-error"]').as("password-error").should("have.text", "Required")

    cy.get('[data-testid="delete-account-modal-close-button"]').click()
    cy.get('[data-testid="delete-account-button"]').click()
    cy.get('[data-testid="delete-account-submit-button"]').click()
    cy.get("@username-error").should("have.text", "Required")
    cy.get("@password-error").should("have.text", "Required")
    cy.get('[data-testid="delete-account-modal"]').as("delete-account-modal").should("be.visible")

    cy.get("@username-input").type("abc").blur()
    cy.get("@username-error").should("have.text", "Please enter your username")

    cy.get("@username-input").clear().type("username1").blur()
    cy.get("@username-error").should("have.text", "")

    cy.get("@password-input").type("random")
    cy.get('[data-testid="delete-account-submit-button"]').click()
    cy.get("@delete-account-modal").should("be.visible")
    cy.get("@password-error").should("have.text", "Incorrect password")

    cy.get("@password-input").clear().type("password").blur()
    cy.get("@password-error").should("have.text", "")
  })

  it("Check account successfully deleted", function () {
    cy.get('[data-testid="delete-account-button"]').click()

    cy.get('[data-testid="delete-account-username-input"]').type("username1")
    cy.get('[data-testid="delete-account-password-input"]').type("password")
    cy.get('[data-testid="delete-account-submit-button"]').click()

    cy.wait("@gqlDeleteUserMutation").then(({ response }) => {
      cy.wrap(response?.body.data)
        .its("deleteUser")
        .should((res) => expect(res.code).to.eq(200))
    })

    cy.location("pathname").should("eq", "/")

    cy.wrap(null).then(() => {
      cy.wrap(graphQLClient.request(getUserTestDoc, { input: { username: "username1" } }))
        .its("user")
        .should("eq", null)
    })
  })

  it("Check error response", function () {
    cy.get('[data-testid="delete-account-button"]').click()

    cy.get('[data-testid="delete-account-username-input"]').type("username1")
    cy.get('[data-testid="delete-account-password-input"]').type("password")

    cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
      if (req.body.operationName == "DeleteUser") {
        req.reply({ fixture: "/profile/errors/deleteUserInput.json" })
      }
    })

    cy.get('[data-testid="delete-account-submit-button"]').click()

    cy.get('[data-testid="delete-account-modal"]').should("be.visible")
    cy.get('[data-testid="delete-account-username-error"]').should("have.text", "Invalid username")
    cy.get('[data-testid="delete-account-password-error"]').should("have.text", "Invalid password")
  })
})
