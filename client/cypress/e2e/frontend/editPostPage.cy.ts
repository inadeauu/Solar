import { graphQLClient } from "../../../src/utils/graphql"
import { aliasMutation } from "../../utils/graphqlTest"
import { getPostTestDoc } from "../../utils/postGraphQL"

beforeEach(function () {
  cy.exec("npm --prefix ../server run resetDb")
  cy.exec("npm --prefix ../server run seed")

  cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
    aliasMutation(req, "DeletePost")
  })
})

describe("Navigation", function () {
  it("Redirect to 404 page if post not found", function () {
    cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")
    cy.visit("/posts/123/edit")
    cy.location("pathname").should("eq", "/404-not-found")
  })

  it("Redirect home if not logged in", function () {
    cy.visit("/posts/hABDkdGnfjLBXPVPquH1eZ/edit")
    cy.location("pathname").should("eq", "/")
  })

  it("Redirect home if user is not owner of post", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
    cy.visit("/posts/hABDkdGnfjLBXPVPquH1eZ/edit")
    cy.location("pathname").should("eq", "/")
  })
})

describe("Edit post", function () {
  beforeEach(function () {
    cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")
    cy.visit("/posts/hABDkdGnfjLBXPVPquH1eZ/edit")
  })

  describe("Input fields", function () {
    it("Title and body inputs contain original title and body values as initial state", function () {
      cy.get('[data-testid="post-title-input"]').should("have.value", "Post 3")
      cy.get('[data-testid="post-body-input"]').should("have.value", "Post body 3")
      cy.get('[data-testid="post-edit-button"]').should("be.disabled")
    })

    it("Check title input validation + indicator changes", function () {
      cy.get('[data-testid="post-title-input"]').as("post-title-input").clear()
      cy.get('[data-testid="title-input-indicator"]')
        .as("title-input-indicator")
        .should("have.css", "color", "rgb(239, 68, 68)")
      cy.get("@title-input-indicator").should("have.text", "0/200")
      cy.get('[data-testid="post-edit-button"]').as("post-edit-button").should("be.disabled")

      cy.get("@post-title-input").invoke("val", "A".repeat(205)).type("A")
      cy.get("@title-input-indicator").should("have.css", "color", "rgb(239, 68, 68)")
      cy.get("@title-input-indicator").should("have.text", "206/200")
      cy.get("@post-edit-button").should("be.disabled")

      cy.get("@post-title-input").clear().type("new title")
      cy.get("@title-input-indicator").should("have.css", "color", "rgb(34, 197, 94)")
      cy.get("@title-input-indicator").should("have.text", "9/200")
      cy.get("@post-edit-button").should("not.be.disabled")
    })

    it("Check body input validation + indicator changes", function () {
      cy.get('[data-testid="post-body-input"]').as("post-body-input").invoke("val", "A".repeat(21000)).type("A")
      cy.get('[data-testid="body-input-indicator"]')
        .as("body-input-indicator")
        .should("have.css", "color", "rgb(239, 68, 68)")
      cy.get("@body-input-indicator").should("have.text", "21001/20000")
      cy.get('[data-testid="post-edit-button"]').as("post-edit-button").should("be.disabled")

      cy.get("@post-body-input").clear().type("new body")
      cy.get("@body-input-indicator").should("have.css", "color", "rgb(0, 0, 0)")
      cy.get("@body-input-indicator").should("have.text", "8/20000")
      cy.get("@post-edit-button").should("not.be.disabled")
    })

    it("Check body input height grows to text amount", function () {
      cy.get('[data-testid="post-body-input"]').as("post-body-input").invoke("val", "A".repeat(1500)).type("A")
      cy.get("@post-body-input").then((element) => {
        expect(element.outerHeight()).to.eq(element.prop("scrollHeight"))
      })
    })
  })

  describe("Reset changes button", function () {
    it("Not disabled only when a change to title or body has been made", function () {
      cy.get('[data-testid="reset-changes-button"]').as("reset-changes-button").should("be.disabled")

      cy.get('[data-testid="post-title-input"]').as("title-input").type("some text")
      cy.get("@reset-changes-button").should("not.be.disabled")
      cy.reload()

      cy.get('[data-testid="post-body-input"]').as("body-input").type("some text")
      cy.get("@reset-changes-button").should("not.be.disabled")
    })

    it("Puts title and body back to original when clicked", function () {
      cy.get('[data-testid="post-title-input"]').as("post-title-input").type("some text")
      cy.get('[data-testid="post-body-input"]').as("post-body-input").type("some text")
      cy.get('[data-testid="reset-changes-button"]').click()
      cy.get("@post-title-input").should("have.value", "Post 3")
      cy.get("@post-body-input").should("have.value", "Post body 3")
    })
  })

  describe("Update button", function () {
    it("Successfully updates post", function () {
      cy.get('[data-testid="post-title-input"]').clear().type("new title")
      cy.get('[data-testid="post-body-input"]').clear().type("new body")
      cy.get('[data-testid="post-edit-button"]').click()

      cy.location("pathname").should("eq", "/posts/hABDkdGnfjLBXPVPquH1eZ")

      cy.wrap(null).then(() => {
        cy.wrap(graphQLClient.request(getPostTestDoc, { input: { id: "86677911-05d4-4e65-a6b6-3ebdaea58b93" } })).then(
          (res: any) => {
            expect(res.post.title).to.eq("new title")
            expect(res.post.body).to.eq("new body")
          }
        )
      })

      cy.get('[data-testid="post-title"]').should("have.text", "new title")
      cy.get('[data-testid="post-body"]').should("have.text", "new body")
    })

    it("Error response", function () {
      cy.get('[data-testid="post-title-input"]').clear().type("new title")
      cy.get('[data-testid="post-body-input"]').clear().type("new body")

      cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
        if (req.body.operationName == "EditPost") {
          req.reply({ fixture: "/post/errors/updatePostInput.json" })
        }
      })

      cy.get('[data-testid="post-edit-button"]').click()

      cy.get('[data-testid="post-edit-error"]').should("have.text", "Error: Invalid input")
    })
  })

  describe("Delete button", function () {
    it("Successfully deletes post", function () {
      cy.get('[data-testid="post-delete-button"]').click()
      cy.get('[data-testid="delete-modal-yes"]').click()

      cy.wait("@gqlDeletePostMutation").then(({ response }) => {
        cy.wrap(response?.body.data)
          .its("deletePost")
          .should((res) => expect(res.code).to.eq(200))
          .should((res) => expect(res.successMsg).to.eq("Successfully deleted post"))
      })

      cy.location("pathname").should("eq", "/")

      cy.wrap(null).then(() =>
        cy
          .wrap(graphQLClient.request(getPostTestDoc, { input: { id: "86677911-05d4-4e65-a6b6-3ebdaea58b93" } }))
          .then((res: any) => expect(res.post).to.eq(null))
      )
    })

    describe("Confirmation Modal", function () {
      it("Closes with no post deletion", function () {
        cy.get('[data-testid="post-delete-button"]').click()
        cy.get('[data-testid="delete-modal-no"]').click()

        cy.wrap(null).then(() => {
          cy.wrap(
            graphQLClient.request(getPostTestDoc, { input: { id: "86677911-05d4-4e65-a6b6-3ebdaea58b93" } })
          ).then((res: any) => expect(res.post).not.to.eq(null))
        })
      })
    })
  })
})
