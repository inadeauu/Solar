import { aliasMutation, aliasQuery } from "../../utils/graphqlTest"

beforeEach(function () {
  cy.exec("npm --prefix ../server run resetDb")
  cy.exec("npm --prefix ../server run seed")

  cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
    aliasQuery(req, "UsernameExists")
    aliasQuery(req, "AuthUser")

    aliasMutation(req, "RegisterUsername")
    aliasMutation(req, "LoginUsername")
    aliasMutation(req, "Logout")
  })
})

describe("Sign up form", function () {
  it("Check sign up works", function () {
    cy.visit("/")

    cy.get('[data-testid="signup-button"]').click()
    cy.url().should("eq", "http://localhost:5173/signup")

    cy.get('[data-testid="username-input"]').as("username-input").type("username")
    cy.get('[data-testid="password-input"]').as("password-input").type("password")
    cy.get('[data-testid="confirmPassword-input"]').as("confirmPassword-input").type("password")

    cy.get('[data-testid="username-error"]').should("be.hidden")
    cy.get('[data-testid="password-error"]').should("be.hidden")
    cy.get('[data-testid="confirmPassword-error"]').should("be.hidden")

    cy.get('[data-testid="hide-password-icon"]').as("hide-password-icon").click()
    cy.get("@password-input").invoke("attr", "type").should("eq", "text")
    cy.get("@confirmPassword-input").invoke("attr", "type").should("eq", "text")

    cy.get('[data-testid="show-password-icon"]').click()
    cy.get("@password-input").invoke("attr", "type").should("eq", "password")
    cy.get("@confirmPassword-input").invoke("attr", "type").should("eq", "password")

    cy.get("@hide-password-icon")

    cy.get('[data-testid="signup-form-submit"').click()

    cy.url().should("eq", "http://localhost:5173/login")

    cy.wait("@gqlRegisterUsernameMutation").then(({ response }) => {
      expect(response?.body.data.registerUsername).property("code").eq(200)
      expect(response?.body.data.registerUsername).property("successMsg").eq("Successfully registered")
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
    cy.get("@username-error").should("contain", "Username must be 5-15 characters long")
    cy.get("@username-input").clear().blur()
    cy.get("@username-error").should("contain", "Required")

    cy.get("@username-input").type("username1")
    cy.wait("@gqlUsernameExistsQuery").then(({ response }) => {
      expect(response?.body.data.usernameExists).eq(true)
    })
    cy.get("@username-error").should("contain", "Username in use")

    cy.get("@username-input").clear()
    cy.get("@username-error").should("contain", "Required")

    cy.get("@username-input").type("newUsername")
    cy.wait("@gqlUsernameExistsQuery").then(({ response }) => {
      expect(response?.body.data.usernameExists).eq(false)
    })
    cy.get("@username-error").should("be.hidden")

    cy.log("Password errors")

    cy.get('[data-testid="password-input"]').as("password-input").type("p").blur()
    cy.get('[data-testid="password-error"]')
      .as("password-error")
      .should("contain", "Password must be at least 8 characters long")

    cy.get("@password-input").clear().type("password").blur()
    cy.get("@password-error").should("be.hidden")

    cy.log("Confirm password errors")

    cy.get('[data-testid="confirmPassword-input"').as("confirmPassword-input").type("notPassword").blur()
    cy.get('[data-testid="confirmPassword-error"')
      .as("confirmPassword-error")
      .should("contain", "Passwords do not match")

    cy.get("@confirmPassword-input").clear().type("password").blur()
    cy.get("@confirmPassword-error").should("be.hidden")

    cy.get("@password-input").clear().blur()
    cy.get("@password-error").should("contain", "Required")

    cy.get("@confirmPassword-input").clear().blur()
    cy.get("@confirmPassword-error").should("contain", "Required")
  })

  it("Check error response", function () {
    cy.visit("/")

    cy.get('[data-testid="signup-button"]').click()
    cy.url().should("eq", "http://localhost:5173/signup")

    cy.get('[data-testid="username-input"]').as("username-input").type("username")
    cy.get('[data-testid="password-input"]').as("password-input").type("password")
    cy.get('[data-testid="confirmPassword-input"]').as("confirmPassword-input").type("password")

    cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
      if (req.body.operationName == "RegisterUsername") {
        req.reply({ fixture: "/auth/errors/signupInput.json" })
      }
    })

    cy.get('[data-testid="signup-form-submit"').click()

    cy.get('[data-testid="signup-error"]').should("be.visible").and("have.text", "Error: Invalid input")
    cy.location("pathname").should("eq", "/signup")
  })
})

describe("Log in form", function () {
  it("Check log in works", function () {
    cy.visit("/")

    cy.get('[data-testid="login-button"]').click()

    cy.url().should("eq", "http://localhost:5173/login")

    cy.get('[data-testid="username-input"').type("username1")
    cy.get('[data-testid="password-input"]').type("password")

    cy.get('[data-testid="login-submit-button"').click()

    cy.wait("@gqlLoginUsernameMutation").then(({ response }) => {
      expect(response?.body.data.loginUsername).property("code").eq(200)
      expect(response?.body.data.loginUsername).property("successMsg").eq("Successfully logged in")
      cy.setCookie("test-user", response?.body.data.loginUsername.user.id)
    })

    cy.url().should("eq", "http://localhost:5173/")
    cy.reload()

    cy.get('[data-testid="nav-profile-menu-container"')
  })

  it("Check input errors display", function () {
    cy.visit("/login")

    cy.get('[data-testid="login-error"]').as("login-error").should("be.hidden")

    cy.get('[data-testid="username-input"]').as("username-input").type("1")
    cy.get('[data-testid="password-input"]').as("password-input").type("2")

    cy.get('[data-testid="login-submit-button"').as("login-submit-button").click()

    cy.wait("@gqlLoginUsernameMutation").then(({ response }) => {
      expect(response?.body.data.loginUsername).property("code").eq(400)
      expect(response?.body.data.loginUsername).property("errorMsg").eq("Invalid username and/or password")
    })

    cy.get("@login-error").contains("Error: Invalid username and/or password").should("not.be.hidden")

    cy.get("@username-input").clear()
    cy.get("@password-input").clear()
    cy.get("@login-submit-button").click()

    cy.get('[data-testid="username-error"]').contains("Required")
    cy.get('[data-testid="password-error"]').contains("Required")
  })
})
