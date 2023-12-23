import { aliasMutation, aliasQuery } from "../../src/utils/graphql-test-utils"

beforeEach(function () {
  cy.exec("npm --prefix ../server run resetDb")
  cy.exec("npm --prefix ../server run seed")

  cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
    aliasQuery(req, "UsernameExists")

    aliasMutation(req, "RegisterUsername")
  })
})

describe.only("Sign up form", function () {
  it("Check sign up works", function () {
    cy.visit("/")

    cy.get('[data-testid="signup-button"]').click()

    cy.get('[data-testid="username-input"]').type("username")
    cy.get('[data-testid="password-input"]').type("password")
    cy.get('[data-testid="confirmPassword-input"]').type("password")

    cy.get('[data-testid="username-error"]').should("be.hidden")
    cy.get('[data-testid="password-error"]').should("be.hidden")
    cy.get('[data-testid="confirmPassword-error"]').should("be.hidden")

    cy.get('[data-testid="signup-form-submit"').click()

    cy.url().should("eq", "http://localhost:5173/login")

    cy.wait("@gqlRegisterUsernameMutation").then(({ response }) => {
      expect(response?.body.data.registerUsername).property("code").eq(200)
      expect(response?.body.data.registerUsername)
        .property("successMsg")
        .eq("Successfully registered")
    })
  })

  it("Check input errors display and go away", function () {
    cy.visit("/signup")

    cy.log("Username errors")

    cy.get('[data-testid="username-input"]').as("username-input").type("u")
    cy.get('[data-testid="username-error"]')
      .as("username-error")
      .should("contain", "Username must be 5-15 characters long")
    cy.get("@username-input").clear()

    cy.get("@username-input").type("thisIsASuperLongUsername")
    cy.get("@username-error").should(
      "contain",
      "Username must be 5-15 characters long"
    )
    cy.get("@username-input").clear()

    cy.get("@username-input").type("username1")
    cy.wait("@gqlUsernameExistsQuery").then(({ response }) => {
      expect(response?.body.data.usernameExists).eq(true)
    })
    cy.get("@username-error").should("contain", "Username in use")

    cy.get("@username-input").clear()
    cy.get("@username-error").should("contain", "Required")

    cy.get("@username-input").type("newUsername")
    cy.get("@username-error").should("be.hidden")

    cy.log("Password errors")

    cy.get('[data-testid="password-input"]')
      .as("password-input")
      .type("p")
      .blur()
    cy.get('[data-testid="password-error"]')
      .as("password-error")
      .should("contain", "Password must be at least 8 characters long")

    cy.get("@password-input").clear().type("password").blur()
    cy.get("@password-error").should("be.hidden")

    cy.log("Confirm password errors")

    cy.get('[data-testid="confirmPassword-input"')
      .as("confirmPassword-input")
      .type("notPassword")
      .blur()
    cy.get('[data-testid="confirmPassword-error"')
      .as("confirmPassword-error")
      .should("contain", "Passwords do not match")

    cy.get("@confirmPassword-input").clear().type("password").blur()
    cy.get("@confirmPassword-error").should("be.hidden")
  })
})
