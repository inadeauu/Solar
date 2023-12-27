import { aliasMutation } from "../utils/graphqlTest"

beforeEach(function () {
  cy.exec("npm --prefix ../server run resetDb")
  cy.exec("npm --prefix ../server run seed")

  cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
    aliasMutation(req, "CreateCommunity")
  })
})

describe("Navigation", function () {
  it("Check if not logged in user sent home", function () {
    cy.visit("/create-community")
    cy.url().should("eq", "http://localhost:5173/")
  })
})

describe("Create a community", function () {
  it("Check input validation", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
    cy.visit("/create-community")

    cy.get('[data-testid="title-input"]').as("title-input").focus().blur()
    cy.get('[data-testid="title-error"]').as("title-error").should("have.text", "Required")

    cy.get("@title-input").type("test")
    cy.get("@title-input").clear()
    cy.get("@title-error").should("have.text", "Required")
    cy.get('[data-testid="create-community-button"]').as("submit-button").click()
    cy.location("pathname").should("eq", "/create-community")

    cy.get("@title-input").type("A".repeat(30))
    cy.get("@title-error").should("have.text", "Title must be less than 25 characters long")
    cy.get("@submit-button").click()
    cy.location("pathname").should("eq", "/create-community")
    cy.get("@title-input").clear()

    cy.get("@title-input").type("Community1")
    cy.get("@title-error").should("have.text", "Title in use")
    cy.get("@submit-button").click()
    cy.location("pathname").should("eq", "/create-community")

    cy.get("@title-input").type("NewTitle")
    cy.get("@title-error").should("not.be.visible")
  })

  it("Check community successfully created", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
    cy.visit("/create-community")

    cy.get('[data-testid="title-input"]').as("title-input").type("NewCommunity")
    cy.get('[data-testid="create-community-button"]').as("submit-button").click()

    cy.wait("@gqlCreateCommunityMutation").then(({ response }) => {
      cy.wrap(response?.body.data)
        .its("createCommunity")
        .should((res) => expect(res.code).to.eq(200))
        .should((res) => expect(res.successMsg).to.eq("Community successfully created"))
    })

    cy.location("pathname").should("eq", "/")

    cy.get('[data-testid="searchbar-input"]').type("NewCommunity")
    cy.get('[data-testid="communities-results"]').children().should("have.length", 1)
  })

  it("Check error response", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
    cy.visit("/create-community")

    cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
      if (req.body.operationName == "CreateCommunity") {
        req.reply({ fixture: "/community/errors/createInput.json" })
      }
    })

    cy.get('[data-testid="title-input"]').as("title-input").type("NewCommunity")
    cy.get('[data-testid="create-community-button"]').as("submit-button").click()

    cy.get('[data-testid="create-community-error"]').should("be.visible").and("have.text", "Error: Invalid input")
    cy.location("pathname").should("eq", "/create-community")
  })
})
