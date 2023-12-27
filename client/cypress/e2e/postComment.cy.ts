import { aliasMutation } from "../utils/graphqlTest"

beforeEach(function () {
  cy.exec("npm --prefix ../server run resetDb")
  cy.exec("npm --prefix ../server run seed")

  cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
    aliasMutation(req, "VoteComment")
  })
})

describe("Comment", function () {
  it("Check information is correct", function () {
    cy.visit("/posts/hABDkdGnfjLBXPVPquH1eZ")

    cy.get('[data-testid="post-comment-0-owner"]').as("post-owner").should("have.text", "username2")
    cy.get("@post-owner").click()
    cy.location("pathname").should("eq", "/profile/username2")
    cy.go(-1)

    cy.get('[data-testid="post-comment-0-body"]').should("have.text", "Comment 3")
    cy.get('[data-testid="post-comment-0-open-replies-button"]').should("have.text", "15 Replies")
    cy.get('[data-testid="post-comment-0-vote-sum"]').should("have.text", "-1")
  })

  it("Check edit comment button on owned comment", function () {
    cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")
    cy.visit("/posts/hABDkdGnfjLBXPVPquH1eZ")

    cy.get('[data-testid="post-comment-0-edit-button"]').click()
    cy.location("pathname").should("eq", "/comments/7J3cxCaryMQVszbkWRUAVF/edit")
    cy.go(-1)

    cy.clearCookie("test-user")
    cy.reload()
    cy.get('[data-testid="post-comment-0-edit-button"]').should("not.exist")

    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
    cy.reload()
    cy.get('[data-testid="post-comment-0-edit-button"]').should("not.exist")
  })

  describe("Footer", function () {
    describe("Vote buttons", function () {
      it("Check send to login when not logged in", function () {
        cy.visit("/posts/hABDkdGnfjLBXPVPquH1eZ")

        cy.get('[data-testid="post-comment-0-comment-upvote"]').click()
        cy.location("pathname").should("eq", "/login")
        cy.go(-1)

        cy.get('[data-testid="post-comment-0-comment-downvote"]').click()
        cy.location("pathname").should("eq", "/login")
      })

      it("Check upvoting and downvoting works", function () {
        cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
        cy.visit("/posts/hABDkdGnfjLBXPVPquH1eZ")

        cy.get('[data-testid="post-comment-0-upvote-icon"]').should("not.exist")
        cy.get('[data-testid="post-comment-0-downvote-icon"]').should("not.exist")

        cy.get('[data-testid="post-comment-0-comment-upvote"]').as("upvote-button").click()
        cy.get('[data-testid="post-comment-0-vote-sum"]').as("vote-sum").should("have.text", "0")
        cy.get('[data-testid="post-comment-0-upvote-icon"]')
          .as("upvote-icon")
          .should("have.css", "color", "rgb(7, 219, 53)")
        cy.wait("@gqlVoteCommentMutation")

        cy.reload()
        cy.get("@upvote-icon").should("exist")

        cy.get("@upvote-button").click()
        cy.get("@vote-sum").should("have.text", "-1")
        cy.wait("@gqlVoteCommentMutation")

        cy.get("@upvote-button").realHover()
        cy.get('[data-testid="post-comment-0-upvote-icon-hover"]')
          .should("be.visible")
          .and("have.css", "color", "rgb(7, 219, 53)")

        cy.get('[data-testid="post-comment-0-comment-downvote"]').as("downvote-button").click()
        cy.get("@vote-sum").should("have.text", "-2")
        cy.get('[data-testid="post-comment-0-downvote-icon"]')
          .as("downvote-icon")
          .should("have.css", "color", "rgb(239, 68, 68)")
        cy.wait("@gqlVoteCommentMutation")

        cy.reload()
        cy.get("@downvote-icon").should("exist")

        cy.get("@downvote-button").click()
        cy.get("@vote-sum").should("have.text", "-1")
        cy.wait("@gqlVoteCommentMutation")

        cy.get("@downvote-button").realHover()
        cy.get('[data-testid="post-comment-0-downvote-icon-hover"]')
          .should("be.visible")
          .and("have.css", "color", "rgb(239, 68, 68)")

        cy.get("@downvote-button").click()
        cy.get("@upvote-button").click()
        cy.get("@vote-sum").should("have.text", "0")
        cy.wait("@gqlVoteCommentMutation")

        cy.get("@downvote-button").click()
        cy.get("@vote-sum").should("have.text", "-2")
        cy.wait("@gqlVoteCommentMutation")
      })

      describe("Success and error combos (optimistic updates)", function () {
        beforeEach(function () {
          cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
          cy.visit("/posts/hABDkdGnfjLBXPVPquH1eZ")
        })

        it("Error", function () {
          cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
            if (req.body.operationName == "VoteComment") {
              req.reply({ statusCode: 500 })
            }
          })

          cy.get('[data-testid="post-comment-0-comment-upvote"]').click()
          cy.get('[data-testid="post-comment-0-vote-sum"]').as("vote-sum").should("have.text", "-1")

          cy.get('[data-testid="post-comment-0-comment-downvote"]').click()
          cy.get("@vote-sum").should("have.text", "-1")
        })

        it("Upvote error + upvote success + downvote error", function () {
          let requestNum = 1

          cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
            if (req.body.operationName == "VoteComment") {
              if (requestNum == 1 || requestNum == 3) {
                req.reply({ statusCode: 500 })
              }

              requestNum++
            }
          })

          cy.get('[data-testid="post-comment-0-comment-upvote"]').as("upvote").click()
          cy.get("@upvote").click()
          cy.get('[data-testid="post-comment-0-comment-downvote"]').click()

          cy.get('[data-testid="post-comment-0-vote-sum"]').should("have.text", "0")
        })

        it("Upvote success + downvote error + downvote success", function () {
          let requestNum = 1

          cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
            if (req.body.operationName == "VoteComment") {
              if (requestNum == 2) {
                req.reply({ statusCode: 500 })
              }

              requestNum++
            }
          })

          cy.get('[data-testid="post-comment-0-comment-upvote"]').click()
          cy.get('[data-testid="post-comment-0-comment-downvote"]').as("downvote").click()
          cy.get("@downvote").click()

          cy.get('[data-testid="post-comment-0-vote-sum"]').should("have.text", "-2")
        })

        it("Downvote success + upvote error + upvote success", function () {
          let requestNum = 1

          cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
            if (req.body.operationName == "VoteComment") {
              if (requestNum == 2) {
                req.reply({ statusCode: 500 })
              }

              requestNum++
            }
          })

          cy.get('[data-testid="post-comment-0-comment-downvote"]').click()
          cy.get('[data-testid="post-comment-0-comment-upvote"]').as("upvote").click()
          cy.get("@upvote").click()
          cy.get('[data-testid="post-comment-0-vote-sum"]').as("vote-sum").should("have.text", "0")
        })
      })
    })

    describe("Reply button", function () {
      it("Check it sends to login if not logged in", function () {
        cy.visit("/posts/hABDkdGnfjLBXPVPquH1eZ")
        cy.get('[data-testid="post-comment-0-reply-button"]').click()
        cy.location("pathname").should("eq", "/login")
      })

      it("Check it opens and closes reply form", function () {
        cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")
        cy.visit("/posts/hABDkdGnfjLBXPVPquH1eZ")
        cy.get('[data-testid="post-comment-0-reply-button"]').as("reply-button").click()
        cy.get('[data-testid="post-comment-0-reply-form"]').should("exist")

        cy.get("@reply-button").click()
        cy.get('[data-testid="post-comment-0-reply-form"]').should("not.exist")
      })
    })

    describe("Open replies button", function () {
      it("Check it shows only when there are replies", function () {
        cy.visit("/posts/hABDkdGnfjLBXPVPquH1eZ")
        cy.get('[data-testid="post-comment-0-open-replies-button"]').should("exist")

        cy.visit("/posts/7y5hQri7cfRRpU5trE5CAn")
        cy.get('[data-testid="post-comment-0-open-replies-button"]').should("not.exist")
      })

      it("Check it opens and closes replies", function () {
        cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")
        cy.visit("/posts/hABDkdGnfjLBXPVPquH1eZ")

        cy.get('[data-testid="post-comment-0-open-replies-button"]').as("open-replies-button").click()
        cy.get('[data-testid="post-comment-0-replies-feed"]').should("exist")

        cy.get("@open-replies-button").click()
        cy.get('[data-testid="post-comment-0-replies-feed"]').should("not.exist")
      })
    })
  })
})

describe("Comment reply", function () {
  it("Check information is correct", function () {
    cy.visit("/posts/hABDkdGnfjLBXPVPquH1eZ")

    cy.get('[data-testid="post-comment-0-open-replies-button"]').as("open-replies-button").click()

    cy.get('[data-testid="post-comment-0-reply-0-owner"]').as("owner").should("have.text", "username2")
    cy.get("@owner").click()
    cy.location("pathname").should("eq", "/profile/username2")
    cy.go(-1)

    cy.get("@open-replies-button").click()
    cy.get('[data-testid="post-comment-0-reply-0-body"]').should("have.text", "Comment 34")
    cy.get('[data-testid="post-comment-0-reply-0-vote-sum"]').should("have.text", "1")
  })

  it("Check edit comment button on owned comment", function () {
    cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")
    cy.visit("/posts/hABDkdGnfjLBXPVPquH1eZ")

    cy.get('[data-testid="post-comment-0-open-replies-button"]').as("open-replies-button").click()
    cy.get('[data-testid="post-comment-0-reply-0-edit-button"]').click()
    cy.location("pathname").should("eq", "/comments/4BpXDUaCMH8Tqs5gMNX5hR/edit")
    cy.go(-1)

    cy.clearCookie("test-user")
    cy.reload()
    cy.get('[data-testid="post-comment-0-open-replies-button"]').as("open-replies-button").click()
    cy.get('[data-testid="post-comment-0-reply-0-edit-button"]').should("not.exist")

    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
    cy.reload()
    cy.get('[data-testid="post-comment-0-open-replies-button"]').as("open-replies-button").click()
    cy.get('[data-testid="post-comment-0-reply-0-edit-button"]').should("not.exist")
  })

  it("Check upvoting and downvoting works", function () {
    cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")
    cy.visit("/posts/hABDkdGnfjLBXPVPquH1eZ")
    cy.get('[data-testid="post-comment-0-open-replies-button"]').as("open-replies-button").click()

    cy.get('[data-testid="post-comment-0-reply-0-comment-upvote"]').as("upvote").click()
    cy.get('[data-testid="post-comment-0-reply-0-vote-sum"]').as("vote-sum").should("have.text", "2")

    cy.get("@upvote").click()
    cy.get("@vote-sum").should("have.text", "1")

    cy.get('[data-testid="post-comment-0-reply-0-comment-downvote"]').as("downvote").click()
    cy.get("@vote-sum").should("have.text", "0")

    cy.get("@downvote").click()
    cy.get("@vote-sum").should("have.text", "1")
  })
})
