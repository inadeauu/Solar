import { recurse } from "cypress-recurse"
import { aliasMutation, aliasQuery } from "../../utils/graphqlTest"
import { CommentFeedQuery } from "../../../src/graphql_codegen/graphql"
import { nodeIdsUnique } from "../../utils/utils"

beforeEach(function () {
  cy.exec("npm --prefix ../server run resetDb")
  cy.exec("npm --prefix ../server run seed")

  cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
    aliasQuery(req, "CommentFeed")

    aliasMutation(req, "VotePost")
    aliasMutation(req, "CreateComment")
  })
})

describe("Post", function () {
  it("Check post information is correct", function () {
    cy.visit("/posts/hABDkdGnfjLBXPVPquH1eZ")

    cy.get('[data-testid="post-community-title"]').as("post-community").should("have.text", "Community2")
    cy.get("@post-community").click()
    cy.location("pathname").should("eq", "/communities/92NaeufxZpXED1QgFoXPHx")
    cy.go(-1)

    cy.get('[data-testid="post-owner"]').as("post-owner").should("have.text", "username2")
    cy.get("@post-owner").click()
    cy.location("pathname").should("eq", "/profile/username2")
    cy.go(-1)

    cy.get('[data-testid="post-title"]').should("have.text", "Post 3")
    cy.get('[data-testid="post-body"]').should("have.text", "Post body 3")

    cy.get('[data-testid="comment-count"]').should("have.text", "16")
    cy.get('[data-testid="post-vote-sum"]').should("have.text", "1")
  })

  it("Check edit post button appears when it should and works", function () {
    cy.visit("/posts/hABDkdGnfjLBXPVPquH1eZ")
    cy.get('[data-testid="post-edit-button"]').should("not.exist")

    cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")
    cy.get('[data-testid="post-edit-button"]').click()
    cy.location("pathname").should("eq", "/posts/hABDkdGnfjLBXPVPquH1eZ/edit")
  })

  it("Check when body overflow shouldn't be present", function () {
    cy.visit("/posts/hABDkdGnfjLBXPVPquH1eZ")
    cy.get('[data-testid="post-body-overflow-container"]')
      .as("body-container")
      .should("have.css", "overflow", "visible")
    cy.get('[data-testid="show-more-button"]').should("not.exist")

    cy.visit("/posts/6HD5xZqjvvBKjhGikVu3TF")
    cy.get('[data-testid="post-body-overflow-container"]').should("not.exist")
  })

  it("Check when body overflow should be present", function () {
    cy.visit("/posts/sS7SLVJRBL7dTBazMKGg1S")
    cy.get('[data-testid="post-body-overflow-container"]').as("body-container").should("have.css", "overflow", "hidden")
    cy.get('[data-testid="show-more-button"]').click()
    cy.get("@body-container").should("have.css", "overflow", "visible")
  })

  describe("Sidebar (post vote buttons)", function () {
    it("Check send to login when not logged in", function () {
      cy.visit("/posts/ft9KxEQ4rv6tXzGPKccghm")
      cy.get('[data-testid="post-upvote"]').click()
      cy.location("pathname").should("eq", "/login")
      cy.go(-1)

      cy.get('[data-testid="post-downvote"]').click()
      cy.location("pathname").should("eq", "/login")
    })

    it("Check upvoting and downvoting works", function () {
      cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
      cy.visit("/posts/ft9KxEQ4rv6tXzGPKccghm")

      cy.get('[data-testid="upvote-icon"]').should("not.exist")
      cy.get('[data-testid="downvote-icon"]').should("not.exist")

      cy.get('[data-testid="post-upvote"]').as("upvote-button").click()
      cy.get('[data-testid="post-vote-sum"]').as("vote-sum").should("have.text", "1")
      cy.get('[data-testid="upvote-icon"]').as("upvote-icon").should("have.css", "color", "rgb(7, 219, 53)")
      cy.wait("@gqlVotePostMutation")

      cy.reload()
      cy.get("@upvote-icon").should("exist")

      cy.get("@upvote-button").click()
      cy.get("@vote-sum").should("have.text", "0")
      cy.wait("@gqlVotePostMutation")

      cy.get("@upvote-button").realHover()
      cy.get('[data-testid="upvote-icon-hover"]').should("be.visible").and("have.css", "color", "rgb(7, 219, 53)")

      cy.get('[data-testid="post-downvote"]').as("downvote-button").click()
      cy.get("@vote-sum").should("have.text", "-1")
      cy.get('[data-testid="downvote-icon"]').as("downvote-icon").should("have.css", "color", "rgb(239, 68, 68)")
      cy.wait("@gqlVotePostMutation")

      cy.reload()
      cy.get("@downvote-icon").should("exist")

      cy.get("@downvote-button").click()
      cy.get("@vote-sum").should("have.text", "0")
      cy.wait("@gqlVotePostMutation")

      cy.get("@downvote-button").realHover()
      cy.get('[data-testid="downvote-icon-hover"]').should("be.visible").and("have.css", "color", "rgb(239, 68, 68)")

      cy.get("@downvote-button").click()
      cy.get("@upvote-button").click()
      cy.get("@vote-sum").should("have.text", "1")
      cy.wait("@gqlVotePostMutation")

      cy.get("@downvote-button").click()
      cy.get("@vote-sum").should("have.text", "-1")
      cy.wait("@gqlVotePostMutation")
    })

    describe("Success and error combos (optimistic updates)", function () {
      beforeEach(function () {
        cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
        cy.visit("/posts/ft9KxEQ4rv6tXzGPKccghm")
      })

      it("Error", function () {
        cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
          if (req.body.operationName == "VotePost") {
            req.reply({ statusCode: 500 })
          }
        })

        cy.get('[data-testid="post-upvote"]').click()
        cy.get('[data-testid="post-vote-sum"]').as("vote-sum").should("have.text", "0")

        cy.get('[data-testid="post-downvote"]').click()
        cy.get("@vote-sum").should("have.text", "0")
      })

      it("Upvote error + upvote success + downvote error", function () {
        let requestNum = 1

        cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
          if (req.body.operationName == "VotePost") {
            if (requestNum == 1 || requestNum == 3) {
              req.reply({ statusCode: 500 })
            }

            requestNum++
          }
        })

        cy.get('[data-testid="post-upvote"]').as("upvote").click()
        cy.get("@upvote").click()
        cy.get('[data-testid="post-downvote"]').click()

        cy.get('[data-testid="post-vote-sum"]').should("have.text", "1")
      })

      it("Upvote success + downvote error + downvote success", function () {
        let requestNum = 1

        cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
          if (req.body.operationName == "VotePost") {
            if (requestNum == 2) {
              req.reply({ statusCode: 500 })
            }

            requestNum++
          }
        })

        cy.get('[data-testid="post-upvote"]').click()
        cy.get('[data-testid="post-downvote"]').as("downvote").click()
        cy.get("@downvote").click()

        cy.get('[data-testid="post-vote-sum"]').should("have.text", "-1")
      })

      it("Downvote success + upvote error + upvote success", function () {
        let requestNum = 1

        cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
          if (req.body.operationName == "VotePost") {
            if (requestNum == 2) {
              req.reply({ statusCode: 500 })
            }

            requestNum++
          }
        })

        cy.get('[data-testid="post-downvote"]').click()
        cy.get('[data-testid="post-upvote"]').as("upvote").click()
        cy.get("@upvote").click()
        cy.get('[data-testid="post-vote-sum"]').as("vote-sum").should("have.text", "1")
      })
    })
  })
})

describe("Comment creation form", function () {
  it("Check send to login when not logged in", function () {
    cy.visit("/posts/7y5hQri7cfRRpU5trE5CAn")
    cy.get('[data-testid="create-comment-button"]').click()
    cy.location("pathname").should("eq", "/login")
  })

  it("Check open and close", function () {
    cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")
    cy.visit("/posts/7y5hQri7cfRRpU5trE5CAn")

    cy.get('[data-testid="create-comment-button"]').click()
    cy.get('[data-testid="create-comment-form"]').should("exist")

    cy.get('[data-testid="close-create-comment-form-button').click()
    cy.get('[data-testid="create-comment-form"]').should("not.exist")
  })

  it("Check input validation + indicator changes", function () {
    cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")
    cy.visit("/posts/7y5hQri7cfRRpU5trE5CAn")
    cy.get('[data-testid="create-comment-button"]').click()

    cy.get('[data-testid="create-comment-submit"]').as("submit-button").should("be.disabled")
    cy.get('[data-testid="comment-body-length-indicator"]')
      .as("length-indicator")
      .should("have.css", "color", "rgb(239, 68, 68)")

    cy.get('[data-testid="comment-body-input"]').as("comment-input").invoke("val", "A".repeat(2100)).type("A")
    cy.get('[data-testid="create-comment-submit"]').as("submit-button").should("be.disabled")
    cy.get('[data-testid="comment-body-length-indicator"]')
      .as("length-indicator")
      .should("have.css", "color", "rgb(239, 68, 68)")

    cy.get('[data-testid="comment-body-input"]').then((element) => {
      expect(element.outerHeight()).to.eq(element.prop("scrollHeight"))
    })

    cy.get("@comment-input").clear().type("new comment")
    cy.get("@submit-button").should("not.be.disabled")
    cy.get('[data-testid="comment-body-length-indicator"]')
      .as("length-indicator")
      .should("have.css", "color", "rgb(34, 197, 94)")
  })

  it("Check comment successfully created", function () {
    cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")
    cy.visit("/posts/7y5hQri7cfRRpU5trE5CAn")
    cy.get('[data-testid="create-comment-button"]').click()

    cy.get('[data-testid="comment-body-input"]').type("New comment")
    cy.get('[data-testid="create-comment-submit"]').click()

    cy.wait("@gqlCreateCommentMutation").then(({ response }) => {
      cy.wrap(response?.body.data)
        .its("createComment")
        .should((res) => expect(res.code).to.eq(200))
        .should((res) => expect(res.successMsg).to.eq("Successfully created comment"))
    })

    cy.get('[data-testid="create-comment-form"]').should("not.exist")

    cy.get('[data-testid="post-comment-0-body"]').should("have.text", "New comment")
  })

  it("Check error response", function () {
    cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")
    cy.visit("/posts/7y5hQri7cfRRpU5trE5CAn")
    cy.get('[data-testid="create-comment-button"]').as("create-comment-button").click()

    cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
      if (req.body.operationName == "CreateComment") {
        req.reply({ fixture: "/post/errors/commentInput.json" })
      }
    })

    cy.get('[data-testid="comment-body-input"]').type("New comment")
    cy.get('[data-testid="create-comment-submit"]').click()
    cy.get('[data-testid="comment-create-error"]').should("have.text", "Error: Invalid input")

    cy.get('[data-testid="close-create-comment-form-button"]').click()
    cy.get("@create-comment-button").click()
    cy.get('[data-testid="comment-create-error"]').should("not.exist")
  })
})

describe("Comment feed", function () {
  it("Check no comments message shows", function () {
    cy.visit("/posts/duRZHrFgdqynoRoScrDdjL")
    cy.get('[data-testid="no-comments-text"]').should("have.text", "No Comments")
  })

  it("Check infinite scroll", function () {
    cy.visit("/posts/7y5hQri7cfRRpU5trE5CAn")

    let iterations = 1

    let comments: CommentFeedQuery["comments"]["edges"] = []

    recurse(
      () => {
        cy.get('[data-testid="post-comment-feed"]').as("post-comment-feed").children().last().scrollIntoView()

        cy.wait("@gqlCommentFeedQuery").then(({ response }) => {
          if (!response) throw new Error("Response not present")

          if (iterations != 2) {
            expect(response.body.data.comments.edges).to.have.lengthOf(10)
          } else {
            expect(response.body.data.comments.edges).to.have.lengthOf(5)
          }

          comments = comments.concat(response.body.data.comments.edges)
          iterations += 1
        })

        return cy.get("@post-comment-feed").children()
      },
      (children) => {
        return (
          children.length == 16 &&
          children[children.length - 1].innerHTML == "All comments loaded" &&
          comments.length == 15
        )
      }
    ).then(() => {
      expect(nodeIdsUnique(comments)).to.be.true
      expect(comments.every((comment) => comment.node.post.id == "351146cd-1612-4a44-94da-e33d27bedf39")).to.be.true
    })
  })

  it("Check new ordering", function () {
    cy.visit("/posts/7y5hQri7cfRRpU5trE5CAn")

    let comments: CommentFeedQuery["comments"]["edges"] = []

    recurse(
      () => {
        cy.get('[data-testid="post-comment-feed"]').as("post-comment-feed").children().last().scrollIntoView()

        cy.wait("@gqlCommentFeedQuery").then(({ response }) => {
          if (!response) throw new Error("Response not present")

          if (response.body.data.comments.orderBy == "NEW") {
            comments = comments.concat(response.body.data.comments.edges)
          }
        })

        return cy.get("@post-comment-feed").children()
      },
      (children) => {
        return (
          children.length == 16 &&
          children[children.length - 1].innerHTML == "All comments loaded" &&
          comments.length == 15
        )
      }
    ).then(() => {
      expect(nodeIdsUnique(comments)).to.be.true
      expect(comments.every((comment) => comment.node.post.id == "351146cd-1612-4a44-94da-e33d27bedf39")).to.be.true
      expect(
        comments.every((comment, i) => {
          if (i == 0) {
            return comment.node.created_at > comments[i + 1].node.created_at
          } else if (i == comments.length - 1) {
            return comment.node.created_at < comments[i - 1].node.created_at
          } else {
            return (
              comment.node.created_at > comments[i + 1].node.created_at &&
              comment.node.created_at < comments[i - 1].node.created_at
            )
          }
        })
      ).to.be.true
    })
  })

  it("Check old ordering", function () {
    cy.visit("/posts/7y5hQri7cfRRpU5trE5CAn")

    let comments: CommentFeedQuery["comments"]["edges"] = []

    cy.get('[data-testid="comment-order-dropdown"]').click()
    cy.get('[data-testid="comment-order-Old"]').click()

    recurse(
      () => {
        cy.get('[data-testid="post-comment-feed"]').as("post-comment-feed").children().last().scrollIntoView()

        cy.wait("@gqlCommentFeedQuery").then(({ response }) => {
          if (!response) throw new Error("Response not present")

          if (response.body.data.comments.orderBy == "OLD") {
            comments = comments.concat(response.body.data.comments.edges)
          }
        })

        return cy.get("@post-comment-feed").children()
      },
      (children) => {
        return (
          children.length == 16 &&
          children[children.length - 1].innerHTML == "All comments loaded" &&
          comments.length == 15
        )
      }
    ).then(() => {
      expect(nodeIdsUnique(comments)).to.be.true
      expect(comments.every((comment) => comment.node.post.id == "351146cd-1612-4a44-94da-e33d27bedf39")).to.be.true
      expect(
        comments.every((comment, i) => {
          if (i == 0) {
            return comment.node.created_at < comments[i + 1].node.created_at
          } else if (i == comments.length - 1) {
            return comment.node.created_at > comments[i - 1].node.created_at
          } else {
            return (
              comment.node.created_at < comments[i + 1].node.created_at &&
              comment.node.created_at > comments[i - 1].node.created_at
            )
          }
        })
      ).to.be.true
    })
  })

  it("Check increasing vote count ordering", function () {
    cy.visit("/posts/7y5hQri7cfRRpU5trE5CAn")

    let comments: CommentFeedQuery["comments"]["edges"] = []

    cy.get('[data-testid="comment-order-dropdown"]').click()
    cy.get('[data-testid="comment-order-Low"]').click()

    recurse(
      () => {
        cy.get('[data-testid="post-comment-feed"]').as("post-comment-feed").children().last().scrollIntoView()

        cy.wait("@gqlCommentFeedQuery").then(({ response }) => {
          if (!response) throw new Error("Response not present")

          if (response.body.data.comments.orderBy == "LOW") {
            comments = comments.concat(response.body.data.comments.edges)
          }
        })

        return cy.get("@post-comment-feed").children()
      },
      (children) => {
        return (
          children.length == 16 &&
          children[children.length - 1].innerHTML == "All comments loaded" &&
          comments.length == 15
        )
      }
    ).then(() => {
      expect(nodeIdsUnique(comments)).to.be.true
      expect(comments.every((comment) => comment.node.post.id == "351146cd-1612-4a44-94da-e33d27bedf39")).to.be.true
      expect(
        comments.every((comment, i) => {
          if (i == 0) {
            return comment.node.voteSum <= comments[i + 1].node.voteSum
          } else if (i == comments.length - 1) {
            return comment.node.voteSum >= comments[i - 1].node.voteSum
          } else {
            return (
              comment.node.voteSum <= comments[i + 1].node.voteSum &&
              comment.node.voteSum >= comments[i - 1].node.voteSum
            )
          }
        })
      ).to.be.true
    })
  })

  it("Check decreasing vote count ordering", function () {
    cy.visit("/posts/7y5hQri7cfRRpU5trE5CAn")

    let comments: CommentFeedQuery["comments"]["edges"] = []

    cy.get('[data-testid="comment-order-dropdown"]').click()
    cy.get('[data-testid="comment-order-Top"]').click()

    recurse(
      () => {
        cy.get('[data-testid="post-comment-feed"]').as("post-comment-feed").children().last().scrollIntoView()

        cy.wait("@gqlCommentFeedQuery").then(({ response }) => {
          if (!response) throw new Error("Response not present")

          if (response.body.data.comments.orderBy == "TOP") {
            comments = comments.concat(response.body.data.comments.edges)
          }
        })

        return cy.get("@post-comment-feed").children()
      },
      (children) => {
        return (
          children.length == 16 &&
          children[children.length - 1].innerHTML == "All comments loaded" &&
          comments.length == 15
        )
      }
    ).then(() => {
      expect(nodeIdsUnique(comments)).to.be.true
      expect(comments.every((comment) => comment.node.post.id == "351146cd-1612-4a44-94da-e33d27bedf39")).to.be.true
      expect(
        comments.every((comment, i) => {
          if (i == 0) {
            return comment.node.voteSum >= comments[i + 1].node.voteSum
          } else if (i == comments.length - 1) {
            return comment.node.voteSum <= comments[i - 1].node.voteSum
          } else {
            return (
              comment.node.voteSum >= comments[i + 1].node.voteSum &&
              comment.node.voteSum <= comments[i - 1].node.voteSum
            )
          }
        })
      ).to.be.true
    })
  })
})
