import { graphQLClient } from "../../../src/utils/graphql"
import { getCommentTestDoc } from "../../utils/commentGraphQL"
import { aliasMutation } from "../../utils/graphqlTest"

beforeEach(function () {
  cy.exec("npm --prefix ../server run resetDb")
  cy.exec("npm --prefix ../server run seed")

  cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
    aliasMutation(req, "DeleteComment")
  })
})

describe("Navigation", function () {
  it("Redirect to 404 page if comment not found", function () {
    cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")
    cy.visit("/comments/123/edit")
    cy.location("pathname").should("eq", "/404-not-found")
  })

  it("Redirect home if not logged in", function () {
    cy.visit("/comments/8n13mmChTkVXCq5FUaq65r/edit")
    cy.location("pathname").should("eq", "/")
  })

  it("Redirect home if user is not owner of comment", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
    cy.visit("/comments/8n13mmChTkVXCq5FUaq65r/edit")
    cy.location("pathname").should("eq", "/")
  })
})

describe("Edit comment", function () {
  beforeEach(function () {
    cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")
    cy.visit("/comments/8n13mmChTkVXCq5FUaq65r/edit")
  })

  describe("Body input field", function () {
    it("Contains original body value as initial state", function () {
      cy.get('[data-testid="comment-body-input"]').should("have.value", "Comment 4")
      cy.get('[data-testid="comment-edit-button"]').should("be.disabled")
    })

    it("Check validation + indicator changes", function () {
      cy.get('[data-testid="comment-body-input"]').as("comment-body-input").clear()
      cy.get('[data-testid="body-input-indicator"]')
        .as("body-input-indicator")
        .should("have.css", "color", "rgb(239, 68, 68)")
      cy.get("@body-input-indicator").should("have.text", "0/2000")
      cy.get('[data-testid="comment-edit-button"]').as("comment-edit-button").should("be.disabled")

      cy.get("@comment-body-input").invoke("val", "A".repeat(2100)).type("A")
      cy.get("@body-input-indicator").should("have.css", "color", "rgb(239, 68, 68)")
      cy.get("@body-input-indicator").should("have.text", "2101/2000")
      cy.get("@comment-edit-button").should("be.disabled")

      cy.get("@comment-body-input").clear().type("new body")
      cy.get("@body-input-indicator").should("have.css", "color", "rgb(34, 197, 94)")
      cy.get("@body-input-indicator").should("have.text", "8/2000")
      cy.get("@comment-edit-button").should("not.be.disabled")
    })

    it("Check height grows to text amount", function () {
      cy.get('[data-testid="comment-body-input"]').as("comment-body-input").invoke("val", "A".repeat(1500)).type("A")
      cy.get("@comment-body-input").then((element) => {
        expect(element.outerHeight()).to.eq(element.prop("scrollHeight"))
      })
    })
  })

  describe("Reset changes button", function () {
    it("Not disabled only when a change to body has been made", function () {
      cy.get('[data-testid="reset-changes-button"]').as("reset-changes-button").should("be.disabled")
      cy.get('[data-testid="comment-body-input"]').as("body-input").type("some text")
      cy.get("@reset-changes-button").should("not.be.disabled")
    })

    it("Puts body back to original when clicked", function () {
      cy.get('[data-testid="comment-body-input"]').as("comment-body-input").type("some text")
      cy.get('[data-testid="reset-changes-button"]').click()
      cy.get("@comment-body-input").should("have.value", "Comment 4")
    })
  })

  describe("Update button", function () {
    it("Successfully updates comment", function () {
      cy.get('[data-testid="comment-body-input"]').clear().type("new body")
      cy.get('[data-testid="comment-edit-button"]').click()

      cy.location("pathname").should("eq", "/posts/sS7SLVJRBL7dTBazMKGg1S")

      cy.wrap(null).then(() => {
        cy.wrap(
          graphQLClient.request(getCommentTestDoc, { input: { id: "3b9e9d61-8cd3-431c-994d-d433c7d20245" } })
        ).then((res: any) => {
          expect(res.comment.body).to.eq("new body")
        })
      })

      cy.get('[data-testid="post-comment-1-body"]').should("have.text", "new body")
    })

    it("Error response", function () {
      cy.get('[data-testid="comment-body-input"]').clear().type("new body")

      cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
        if (req.body.operationName == "EditComment") {
          req.reply({ fixture: "/post/errors/updateCommentInput.json" })
        }
      })

      cy.get('[data-testid="comment-edit-button"]').click()

      cy.get('[data-testid="edit-comment-error"]').should("have.text", "Error: Invalid input")
    })
  })

  describe("Delete button", function () {
    it("Successfully deletes comment", function () {
      cy.get('[data-testid="comment-delete-button"]').click()
      cy.get('[data-testid="delete-modal-yes"]').click()

      cy.wait("@gqlDeleteCommentMutation").then(({ response }) => {
        cy.wrap(response?.body.data)
          .its("deleteComment")
          .should((res) => expect(res.code).to.eq(200))
          .should((res) => expect(res.successMsg).to.eq("Successfully deleted comment"))
      })

      cy.location("pathname").should("eq", "/")

      cy.wrap(null).then(() =>
        cy
          .wrap(graphQLClient.request(getCommentTestDoc, { input: { id: "3b9e9d61-8cd3-431c-994d-d433c7d20245" } }))
          .then((res: any) => {
            expect(res.comment).to.eq(null)
          })
      )
    })
  })

  describe("Confirmation Modal", function () {
    it("Closes with no comment deletion", function () {
      cy.get('[data-testid="comment-delete-button"]').click()
      cy.get('[data-testid="delete-modal-no"]').click()

      cy.wrap(null).then(() => {
        cy.wrap(
          graphQLClient.request(getCommentTestDoc, { input: { id: "3b9e9d61-8cd3-431c-994d-d433c7d20245" } })
        ).then((res: any) => expect(res.comment).not.to.eq(null))
      })
    })
  })
})
