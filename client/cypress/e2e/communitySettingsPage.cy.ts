import { aliasMutation } from "../utils/graphqlTest"

beforeEach(function () {
  cy.exec("npm --prefix ../server run resetDb")
  cy.exec("npm --prefix ../server run seed")

  cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
    aliasMutation(req, "ChangeCommunityTitle")
    aliasMutation(req, "DeleteCommunity")
  })
})

describe("Navigation", function () {
  it("Redirect if community not found", function () {
    cy.visit("/communities/123")
    cy.location("pathname").should("eq", "/404-not-found")
  })

  it("Check if sent home if user is not owner", function () {
    cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn")
    cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")
    cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn/settings")
    cy.location("pathname").should("eq", "/")

    cy.clearCookie("test-user")
    cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn/settings")
    cy.location("pathname").should("eq", "/")
  })
})

describe("Change community title", function () {
  it("Check information", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
    cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn/settings")
    cy.get('[data-testid="current-community-title"]').should("have.text", "Current community title: Community1")
  })

  it("Check change button", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
    cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn/settings")
    cy.get('[data-testid="change-title-button"]').click()
    cy.get('[data-testid="change-community-title-modal"]').should("be.visible")
  })

  describe("Modal", function () {
    it("Check input validation", function () {
      cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
      cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn/settings")
      cy.get('[data-testid="change-title-button"]').click()

      cy.get('[data-testid="change-title-modal-submit"]').as("submit-button").click()
      cy.get('[data-testid="new-title-error"]').as("input-error").should("have.text", "Required")
      cy.get("@submit-button").click()
      cy.get('[data-testid="change-community-title-modal"]').as("modal").should("be.visible")

      cy.get('[data-testid="new-title-input"]').as("new-title-input").type("A".repeat(30))
      cy.get("@submit-button").click()
      cy.get("@modal").should("be.visible")

      cy.get("@input-error").should("have.text", "Title must be less than 25 characters long")
      cy.get("@submit-button").click()
      cy.get("@modal").should("be.visible")

      cy.get("@new-title-input").clear().type("Community1")
      cy.get("@input-error").should("have.text", "Title in use")
      cy.get("@submit-button").click()
      cy.get("@modal").should("be.visible")

      cy.get("@new-title-input").clear().type("a b c")
      cy.get("@new-title-input").invoke("attr", "value").should("eq", "abc")

      cy.get("@new-title-input").clear().type("newtitle")
      cy.get("@input-error").should("have.text", "")

      cy.get("@new-title-input").clear().blur()
      cy.get("@input-error").should("have.text", "Required")
    })

    it("Check close functionality", function () {
      cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
      cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn/settings")
      cy.get('[data-testid="change-title-button"]').as("change-title-button").click()

      cy.get('[data-testid="change-community-title-modal-close-button"]').click()
      cy.get('[data-testid="change-community-title-modal"]').as("modal").should("not.be.visible")

      cy.get("@change-title-button").click()
      cy.get('[data-testid="change-community-title-modal-outside"]').click("right")
      cy.get("@modal").should("not.be.visible")
    })

    it("Check correctly changes title", function () {
      cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
      cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn/settings")
      cy.get('[data-testid="change-title-button"]').click()

      cy.get('[data-testid="new-title-input"]').type("NewTitle")
      cy.get('[data-testid="change-title-modal-submit"]').click()
      cy.get('[data-testid="change-community-title-modal"]').should("not.be.visible")

      cy.wait("@gqlChangeCommunityTitleMutation").then(({ response }) => {
        cy.wrap(response?.body.data)
          .its("changeCommunityTitle")
          .should((res) => expect(res.code).to.eq(200))
          .should((res) => expect(res.community.id).to.eq("351146cd-1612-4a44-94da-e33d27bedf39"))
          .should((res) => expect(res.successMsg).to.eq("Successfully changed community title"))
      })

      cy.get('[data-testid="current-community-title"]').should("have.text", "Current community title: NewTitle")
    })

    it("Check error response", function () {
      cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
      cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn/settings")
      cy.get('[data-testid="change-title-button"]').as("change-title-button").click()

      cy.get('[data-testid="new-title-input"]').type("NewTitle")

      cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
        if (req.body.operationName == "ChangeCommunityTitle") {
          req.reply({ fixture: "/community/errors/changeTitleInput.json" })
        }
      })

      cy.get('[data-testid="change-title-modal-submit"]').click()
      cy.get('[data-testid="change-community-title-error"]').as("error").should("have.text", "Error: Invalid input")
      cy.get('[data-testid="change-community-title-modal"]').should("be.visible")

      cy.get('[data-testid="change-community-title-modal-close-button"]').click()
      cy.get("@change-title-button").click()

      cy.get("@error").should("not.exist")
    })
  })
})

describe("Delete community", function () {
  it("Check delete button", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
    cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn/settings")
    cy.get('[data-testid="delete-community-button"]').click()

    cy.get('[data-testid="delete-community-modal"]').should("be.visible")
  })

  describe("Modal", function () {
    it("Check input validation", function () {
      cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
      cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn/settings")
      cy.get('[data-testid="delete-community-button"]').as("delete-button").click()

      cy.get('[data-testid="delete-title-input"]').as("input").focus().blur()
      cy.get('[data-testid="delete-title-error"]').as("error").should("have.text", "Required")

      cy.get("@input").type("abc").blur()
      cy.get("@error").should("have.text", "Please enter your community's title")
      cy.get('[data-testid="submit-delete-community"]').as("submit-delete-button").click()
      cy.get('[data-testid="delete-community-modal"]').as("delete-community-modal").should("be.visible")

      cy.get('[data-testid="delete-community-modal-close-button"]').click()
      cy.get("@delete-button").click()

      cy.get("@submit-delete-button").click()
      cy.get("@error").should("have.text", "Required")
      cy.get("@delete-community-modal").should("be.visible")

      cy.get("@input").type("a b c")
      cy.get("@input").invoke("attr", "value").should("eq", "abc")
    })

    it("Check close functionality", function () {
      cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
      cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn/settings")
      cy.get('[data-testid="delete-community-button"]').as("delete-button").click()

      cy.get('[data-testid="delete-community-modal-close-button"]').click()
      cy.get('[data-testid="delete-community-modal"]').as("modal").should("not.be.visible")

      cy.get("@delete-button").click()
      cy.get('[data-testid="delete-community-modal-outside"]').click("right")
      cy.get("@modal").should("not.be.visible")
    })

    it("Check correctly deletes community", function () {
      cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
      cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn/settings")
      cy.get('[data-testid="delete-community-button"]').click()

      cy.get('[data-testid="delete-title-input"]').type("Community1")
      cy.get('[data-testid="submit-delete-community"]').click()

      cy.location("pathname").should("eq", "/")

      cy.wait("@gqlDeleteCommunityMutation").then(({ response }) => {
        cy.wrap(response?.body.data)
          .its("deleteCommunity")
          .should((res) => expect(res.code).to.eq(200))
          .should((res) => expect(res.successMsg).to.eq("Successfully deleted community"))
      })

      cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn")
      cy.location("pathname").should("eq", "/404-not-found")
    })

    it("Check error response", function () {
      cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
      cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn/settings")
      cy.get('[data-testid="delete-community-button"]').as("delete-button").click()

      cy.get('[data-testid="delete-title-input"]').type("Community1")

      cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
        if (req.body.operationName == "DeleteCommunity") {
          req.reply({ fixture: "/community/errors/deleteInput.json" })
        }
      })

      cy.get('[data-testid="submit-delete-community"]').click()
      cy.get('[data-testid="delete-community-error"]').as("error").should("have.text", "Error: Invalid input")
      cy.get('[data-testid="delete-community-modal"]').should("be.visible")

      cy.get('[data-testid="delete-community-modal-close-button"]').click()
      cy.get("@delete-button").click()

      cy.get("@error").should("not.exist")
    })
  })
})
