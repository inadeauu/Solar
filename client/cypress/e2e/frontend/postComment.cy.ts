import { recurse } from "cypress-recurse"
import { aliasMutation, aliasQuery } from "../../utils/graphqlTest"
import { CommentRepliesFeedQuery } from "../../../src/graphql_codegen/graphql"
import { nodeIdsUnique } from "../../utils/utils"

beforeEach(function () {
  cy.exec("npm --prefix ../server run resetDb")
  cy.exec("npm --prefix ../server run seed")

  cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
    aliasQuery(req, "CommentRepliesFeed")

    aliasMutation(req, "VoteComment")
    aliasMutation(req, "CreateCommentReply")
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

describe("Reply form", function () {
  it("Check input height grows to text amount", function () {
    cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")
    cy.visit("/posts/hABDkdGnfjLBXPVPquH1eZ")
    cy.get('[data-testid="post-comment-0-reply-button"]').click()

    cy.get('[data-testid="post-comment-0-reply-input"]').as("reply-input").invoke("val", "A".repeat(1000)).type("A")

    cy.get("@reply-input").then((element) => {
      expect(element.outerHeight()).to.eq(element.prop("scrollHeight"))
    })
  })

  it("Check input validation + indicator changes", function () {
    cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")
    cy.visit("/posts/hABDkdGnfjLBXPVPquH1eZ")
    cy.get('[data-testid="post-comment-0-reply-button"]').click()

    cy.get('[data-testid="post-comment-0-reply-submit"]').as("reply-button").should("be.disabled")
    cy.get('[data-testid="post-comment-0-reply-length"]')
      .as("reply-length")
      .should("have.css", "color", "rgb(239, 68, 68)")
    cy.get("@reply-length").should("have.text", "0/2000")

    cy.get('[data-testid="post-comment-0-reply-input"]').as("reply-input").invoke("val", "A".repeat(2100)).type("A")
    cy.get("@reply-button").should("be.disabled")
    cy.get("@reply-length").should("have.css", "color", "rgb(239, 68, 68)")
    cy.get("@reply-length").should("have.text", "2101/2000")

    cy.get("@reply-input").clear().type("new comment")
    cy.get("@reply-button").should("not.be.disabled")
    cy.get("@reply-length").should("have.css", "color", "rgb(34, 197, 94)")
    cy.get("@reply-length").should("have.text", "11/2000")
  })

  it("Check reply successfully created", function () {
    cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")
    cy.visit("/posts/hABDkdGnfjLBXPVPquH1eZ")
    cy.get('[data-testid="post-comment-0-reply-button"]').click()

    cy.get('[data-testid="post-comment-0-reply-input"]').type("reply comment")
    cy.get('[data-testid="post-comment-0-reply-submit"]').click()

    cy.wait("@gqlCreateCommentReplyMutation").then(({ response }) => {
      cy.wrap(response?.body.data)
        .its("createCommentReply")
        .should((res) => expect(res.code).to.eq(200))
        .should((res) => expect(res.successMsg).to.eq("Successfully replied"))
    })

    cy.get('[data-testid="post-comment-0-reply-form"]').should("not.exist")

    cy.get('[data-testid="post-comment-0-open-replies-button"]').as("open-replies-button").click()
    cy.get("@open-replies-button").should("have.text", "16 Replies")
    cy.get('[data-testid="post-comment-0-reply-0-body"]').should("have.text", "reply comment")
    cy.get('[data-testid="post-comment-0-reply-0-owner"]').should("have.text", "username2")
  })

  it("Check error response", function () {
    cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")
    cy.visit("/posts/hABDkdGnfjLBXPVPquH1eZ")
    cy.get('[data-testid="post-comment-0-reply-button"]').click()

    cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
      if (req.body.operationName == "CreateCommentReply") {
        req.reply({ fixture: "/post/errors/commentReplyInput.json" })
      }
    })

    cy.get('[data-testid="post-comment-0-reply-input"]').type("reply comment")
    cy.get('[data-testid="post-comment-0-reply-submit"]').click()

    cy.get('[data-testid="post-comment-0-reply-error"]').should("have.text", "Error: Invalid input")
    cy.get('[data-testid="post-comment-0-reply-form"]').should("exist")
  })
})

describe("Comment replies feed", function () {
  beforeEach(function () {
    cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")
    cy.visit("/posts/hABDkdGnfjLBXPVPquH1eZ")
  })

  it("Check infinite scroll", function () {
    let iterations = 1

    let comments: CommentRepliesFeedQuery["comments"]["edges"] = []

    cy.get('[data-testid="post-comment-0-open-replies-button"]').click()

    recurse(
      () => {
        if (iterations != 2) {
          cy.get('[data-testid="post-comment-0-fetch-button"]').click()
        }

        cy.wait("@gqlCommentRepliesFeedQuery").then(({ response }) => {
          if (!response) throw new Error("Response not present")

          if (iterations != 2) {
            expect(response.body.data.comments.edges).to.have.lengthOf(10)
          } else {
            expect(response.body.data.comments.edges).to.have.lengthOf(5)
          }

          comments = comments.concat(response.body.data.comments.edges)

          iterations += 1
        })

        return cy.get('[data-testid="post-comment-0-replies-feed"]').children()
      },
      (children) => {
        return (
          children.length == 16 &&
          children[children.length - 1].innerHTML == "All replies loaded" &&
          comments.length == 15
        )
      }
    ).then(() => {
      expect(nodeIdsUnique(comments)).to.be.true

      expect(
        comments.every(
          (comment) => comment.node.parent && comment.node.parent.id == "36756cee-a0ce-40d3-a51d-686699e0b3a1"
        )
      ).to.eq(true)
    })
  })

  it("Check new ordering", function () {
    let iterations = 1

    let comments: CommentRepliesFeedQuery["comments"]["edges"] = []

    cy.get('[data-testid="post-comment-0-open-replies-button"]').click()

    recurse(
      () => {
        if (iterations != 2) {
          cy.get('[data-testid="post-comment-0-fetch-button"]').click()
        }

        cy.wait("@gqlCommentRepliesFeedQuery").then(({ response }) => {
          if (!response) throw new Error("Response not present")

          if (response.body.data.comments.orderBy == "NEW") {
            comments = comments.concat(response.body.data.comments.edges)
          }

          iterations += 1
        })

        return cy.get('[data-testid="post-comment-0-replies-feed"]').children()
      },
      (children) => {
        return (
          children.length == 16 &&
          children[children.length - 1].innerHTML == "All replies loaded" &&
          comments.length == 15
        )
      }
    ).then(() => {
      expect(nodeIdsUnique(comments)).to.be.true

      expect(
        comments.every(
          (comment) => comment.node.parent && comment.node.parent.id == "36756cee-a0ce-40d3-a51d-686699e0b3a1"
        )
      ).to.eq(true)

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
    let iterations = 1

    let comments: CommentRepliesFeedQuery["comments"]["edges"] = []

    cy.get('[data-testid="comment-order-dropdown"]').click()
    cy.get('[data-testid="comment-order-Old"]').click()
    cy.get('[data-testid="post-comment-0-open-replies-button"]').click()

    recurse(
      () => {
        if (iterations != 2) {
          cy.get('[data-testid="post-comment-0-fetch-button"]').click()
        }

        cy.wait("@gqlCommentRepliesFeedQuery").then(({ response }) => {
          if (!response) throw new Error("Response not present")

          if (response.body.data.comments.orderBy == "OLD") {
            comments = comments.concat(response.body.data.comments.edges)
          }

          iterations += 1
        })

        return cy.get('[data-testid="post-comment-0-replies-feed"]').children()
      },
      (children) => {
        return (
          children.length == 16 &&
          children[children.length - 1].innerHTML == "All replies loaded" &&
          comments.length == 15
        )
      }
    ).then(() => {
      expect(nodeIdsUnique(comments)).to.be.true

      expect(
        comments.every(
          (comment) => comment.node.parent && comment.node.parent.id == "36756cee-a0ce-40d3-a51d-686699e0b3a1"
        )
      ).to.eq(true)

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
    let iterations = 1

    let comments: CommentRepliesFeedQuery["comments"]["edges"] = []

    cy.get('[data-testid="comment-order-dropdown"]').click()
    cy.get('[data-testid="comment-order-Low"]').click()
    cy.get('[data-testid="post-comment-0-open-replies-button"]').click()

    recurse(
      () => {
        if (iterations != 2) {
          cy.get('[data-testid="post-comment-0-fetch-button"]').click()
        }

        cy.wait("@gqlCommentRepliesFeedQuery").then(({ response }) => {
          if (!response) throw new Error("Response not present")

          if (response.body.data.comments.orderBy == "LOW") {
            comments = comments.concat(response.body.data.comments.edges)
          }

          iterations += 1
        })

        return cy.get('[data-testid="post-comment-0-replies-feed"]').children()
      },
      (children) => {
        return (
          children.length == 16 &&
          children[children.length - 1].innerHTML == "All replies loaded" &&
          comments.length == 15
        )
      }
    ).then(() => {
      expect(nodeIdsUnique(comments)).to.be.true

      expect(
        comments.every(
          (comment) => comment.node.parent && comment.node.parent.id == "36756cee-a0ce-40d3-a51d-686699e0b3a1"
        )
      ).to.eq(true)

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
    let iterations = 1

    let comments: CommentRepliesFeedQuery["comments"]["edges"] = []

    cy.get('[data-testid="comment-order-dropdown"]').click()
    cy.get('[data-testid="comment-order-Top"]').click()
    cy.get('[data-testid="post-comment-0-open-replies-button"]').click()

    recurse(
      () => {
        if (iterations != 2) {
          cy.get('[data-testid="post-comment-0-fetch-button"]').click()
        }

        cy.wait("@gqlCommentRepliesFeedQuery").then(({ response }) => {
          if (!response) throw new Error("Response not present")

          if (response.body.data.comments.orderBy == "TOP") {
            comments = comments.concat(response.body.data.comments.edges)
          }

          iterations += 1
        })

        return cy.get('[data-testid="post-comment-0-replies-feed"]').children()
      },
      (children) => {
        return (
          children.length == 16 &&
          children[children.length - 1].innerHTML == "All replies loaded" &&
          comments.length == 15
        )
      }
    ).then(() => {
      expect(nodeIdsUnique(comments)).to.be.true

      expect(
        comments.every(
          (comment) => comment.node.parent && comment.node.parent.id == "36756cee-a0ce-40d3-a51d-686699e0b3a1"
        )
      ).to.eq(true)

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
