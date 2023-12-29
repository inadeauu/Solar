import { recurse } from "cypress-recurse"
import { aliasMutation, aliasQuery } from "../utils/graphqlTest"
import { PostFeedQuery } from "../../src/graphql_codegen/graphql"

beforeEach(function () {
  cy.exec("npm --prefix ../server run resetDb")
  cy.exec("npm --prefix ../server run seed")

  cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
    aliasQuery(req, "PostFeed")

    aliasMutation(req, "VotePost")
  })
})

describe("Post", function () {
  it("Check post information is correct", function () {
    cy.visit("/")

    cy.get('[data-testid="post-1-community"]').as("post-community").should("have.text", "Community2")
    cy.get("@post-community").click()
    cy.location("pathname").should("eq", "/communities/92NaeufxZpXED1QgFoXPHx")
    cy.go(-1)

    cy.get('[data-testid="post-1-owner"]').as("post-owner").should("have.text", "username3")
    cy.get("@post-owner").click()
    cy.location("pathname").should("eq", "/profile/username3")
    cy.go(-1)

    cy.get('[data-testid="post-1-title"]').should("have.text", "Post 5")
    cy.get('[data-testid="post-1-body"]').should("have.text", "Post body 5")

    cy.get('[data-testid="post-0-vote-sum"]').should("have.text", "-2")
    cy.get('[data-testid="post-0-comment-count"]').should("have.text", "2")
  })

  it("Check clicking on post goes to post page", function () {
    cy.visit("/")
    cy.get('[data-testid="post-0"]').click()
    cy.location("pathname").should("eq", "/posts/sS7SLVJRBL7dTBazMKGg1S")
  })

  it("Check post body overflow shows correctly", function () {
    cy.visit("/")

    cy.get('[data-testid="post-0-body-container"]').then((element) => {
      expect(element.outerHeight()).to.be.lessThan(element.prop("scrollHeight"))
    })

    cy.get('[data-testid="post-0-overflown"]').should("have.text", "See Full Post")

    cy.get('[data-testid="post-1-body-container"]').then((element) => {
      expect(element.outerHeight()).to.be.equal(element.prop("scrollHeight"))
    })

    cy.get('[data-testid="post-1-overflown"]').should("not.exist")
  })

  it("Check post edit button shows on owned post", function () {
    cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")
    cy.visit("/")

    cy.get('[data-testid="post-0-edit-button"]').click()
    cy.location("pathname").should("eq", "/posts/sS7SLVJRBL7dTBazMKGg1S/edit")
    cy.go(-1)

    cy.get('[data-testid="post-1-edit-button"]').should("not.exist")

    cy.clearCookie("test-user")
    cy.reload()
    cy.get('[data-testid="post-0-edit-button"]').should("not.exist")
  })

  it("Check upvoting and downvoting works", function () {
    cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")
    cy.visit("/")

    cy.get('[data-testid="post-0-upvote-icon"]').should("not.exist")
    cy.get('[data-testid="post-0-downvote-icon"]').should("not.exist")

    cy.get('[data-testid="post-0-upvote"]').as("upvote-button").click()
    cy.get('[data-testid="post-0-vote-sum"]').as("vote-sum").should("have.text", "-1")
    cy.get('[data-testid="post-0-upvote-icon"]').as("upvote-icon").should("have.css", "color", "rgb(7, 219, 53)")
    cy.wait("@gqlVotePostMutation")

    cy.reload()
    cy.get("@upvote-icon").should("exist")

    cy.get("@upvote-button").click()
    cy.get("@vote-sum").should("have.text", "-2")
    cy.wait("@gqlVotePostMutation")

    cy.get('[data-testid="post-0-downvote"]').as("downvote-button").click()
    cy.get("@vote-sum").should("have.text", "-3")
    cy.get('[data-testid="post-0-downvote-icon"]').as("downvote-icon").should("have.css", "color", "rgb(239, 68, 68)")
    cy.wait("@gqlVotePostMutation")

    cy.reload()
    cy.get("@downvote-icon").should("exist")

    cy.get("@downvote-button").click()
    cy.get("@vote-sum").should("have.text", "-2")
    cy.wait("@gqlVotePostMutation")

    cy.get("@downvote-button").click()
    cy.get("@upvote-button").click()
    cy.get("@vote-sum").should("have.text", "-1")
    cy.wait("@gqlVotePostMutation")

    cy.get("@downvote-button").click()
    cy.get("@vote-sum").should("have.text", "-3")
    cy.wait("@gqlVotePostMutation")
  })

  describe("Success and error combos (optimistic updates)", function () {
    beforeEach(function () {
      cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")
      cy.visit("/")
    })

    it("Error", function () {
      cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
        if (req.body.operationName == "VotePost") {
          req.reply({ statusCode: 500 })
        }
      })

      cy.get('[data-testid="post-0-upvote"]').click()
      cy.get('[data-testid="post-0-vote-sum"]').as("vote-sum").should("have.text", "-2")

      cy.get('[data-testid="post-0-downvote"]').click()
      cy.get("@vote-sum").should("have.text", "-2")
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

      cy.get('[data-testid="post-0-upvote"]').as("upvote").click()
      cy.get("@upvote").click()
      cy.get('[data-testid="post-0-downvote"]').click()

      cy.get('[data-testid="post-0-vote-sum"]').should("have.text", "-1")
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

      cy.get('[data-testid="post-0-upvote"]').click()
      cy.get('[data-testid="post-0-downvote"]').as("downvote").click()
      cy.get("@downvote").click()

      cy.get('[data-testid="post-0-vote-sum"]').should("have.text", "-3")
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

      cy.get('[data-testid="post-0-downvote"]').click()
      cy.get('[data-testid="post-0-upvote"]').as("upvote").click()
      cy.get("@upvote").click()
      cy.get('[data-testid="post-0-vote-sum"]').as("vote-sum").should("have.text", "-1")
    })
  })
})

describe("Post feed", function () {
  it("Check no posts message shows", function () {
    cy.exec("npm --prefix ../server run resetDb")

    cy.visit("/")

    cy.get('[data-testid="no-posts-text"]').as("no-posts-text").should("exist")
    cy.get("@no-posts-text").should("have.text", "No Posts")
  })

  it("Check infinite scroll", function () {
    cy.visit("/")

    let iterations = 1

    recurse(
      () => {
        cy.get('[data-testid="home-post-feed"]').as("home-post-feed").children().last().scrollIntoView()

        cy.wait("@gqlPostFeedQuery")
          .then(({ response }) => {
            if (!response) throw new Error("Response not present")

            if (iterations != 3) {
              expect(response.body.data.posts.edges).to.have.lengthOf(10)
            } else {
              expect(response.body.data.posts.edges).to.have.lengthOf(2)
            }
          })
          .then(() => {
            iterations += 1
          })

        return cy.get("@home-post-feed").children()
      },
      (children) => {
        return children.length == 23 && children[children.length - 1].innerHTML == "All posts loaded"
      }
    )
  })

  it("Check new ordering", function () {
    cy.visit("/")

    let posts: PostFeedQuery["posts"]["edges"] = []

    recurse(
      () => {
        cy.get('[data-testid="home-post-feed"]').as("home-post-feed").children().last().scrollIntoView()

        cy.wait("@gqlPostFeedQuery").then(({ response }) => {
          if (!response) throw new Error("Response not present")

          if (response.body.data.posts.orderBy == "NEW") {
            posts = posts.concat(response.body.data.posts.edges)
          }
        })

        return cy.get("@home-post-feed").children()
      },
      (children) => {
        return children.length == 23 && posts.length == 22
      }
    ).then(() => {
      expect(
        posts.every((post, i) => {
          if (i == 0) {
            return post.node.created_at > posts[i + 1].node.created_at
          } else if (i == posts.length - 1) {
            return post.node.created_at < posts[i - 1].node.created_at
          } else {
            return (
              post.node.created_at > posts[i + 1].node.created_at && post.node.created_at < posts[i - 1].node.created_at
            )
          }
        })
      ).to.be.true
    })
  })

  it("Check old ordering", function () {
    cy.visit("/")

    let posts: PostFeedQuery["posts"]["edges"] = []

    cy.get('[data-testid="order-dropdown"]').click()
    cy.get('[data-testid="order-Old"]').click()

    recurse(
      () => {
        cy.get('[data-testid="home-post-feed"]').as("home-post-feed").children().last().scrollIntoView()

        cy.wait("@gqlPostFeedQuery").then(({ response }) => {
          if (!response) throw new Error("Response not present")

          if (response.body.data.posts.orderBy == "OLD") {
            posts = posts.concat(response.body.data.posts.edges)
          }
        })

        return cy.get("@home-post-feed").children()
      },
      (children) => {
        return children.length == 23 && posts.length == 22
      }
    ).then(() => {
      expect(
        posts.every((post, i) => {
          if (i == 0) {
            return post.node.created_at < posts[i + 1].node.created_at
          } else if (i == posts.length - 1) {
            return post.node.created_at > posts[i - 1].node.created_at
          } else {
            return (
              post.node.created_at < posts[i + 1].node.created_at && post.node.created_at > posts[i - 1].node.created_at
            )
          }
        })
      ).to.be.true
    })
  })

  it("Check increasing vote count ordering", function () {
    cy.visit("/")

    let posts: PostFeedQuery["posts"]["edges"] = []

    cy.get('[data-testid="order-dropdown"]').click()
    cy.get('[data-testid="order-Low"]').click()

    recurse(
      () => {
        cy.get('[data-testid="home-post-feed"]').as("home-post-feed").children().last().scrollIntoView()

        cy.wait("@gqlPostFeedQuery").then(({ response }) => {
          if (!response) throw new Error("Response not present")

          if (response.body.data.posts.orderBy == "LOW") {
            posts = posts.concat(response.body.data.posts.edges)
          }
        })

        return cy.get("@home-post-feed").children()
      },
      (children) => {
        return children.length == 23 && posts.length == 22
      }
    ).then(() => {
      expect(
        posts.every((post, i) => {
          if (i == 0) {
            return post.node.voteSum <= posts[i + 1].node.voteSum
          } else if (i == posts.length - 1) {
            return post.node.voteSum >= posts[i - 1].node.voteSum
          } else {
            return post.node.voteSum <= posts[i + 1].node.voteSum && post.node.voteSum >= posts[i - 1].node.voteSum
          }
        })
      ).to.be.true
    })
  })

  it("Check decreasing vote count ordering", function () {
    cy.visit("/")

    let posts: PostFeedQuery["posts"]["edges"] = []

    cy.get('[data-testid="order-dropdown"]').click()
    cy.get('[data-testid="order-Top"]').click()

    recurse(
      () => {
        cy.get('[data-testid="home-post-feed"]').as("home-post-feed").children().last().scrollIntoView()

        cy.wait("@gqlPostFeedQuery").then(({ response }) => {
          if (!response) throw new Error("Response not present")

          if (response.body.data.posts.orderBy == "TOP") {
            posts = posts.concat(response.body.data.posts.edges)
          }
        })

        return cy.get("@home-post-feed").children()
      },
      (children) => {
        return children.length == 23 && posts.length == 22
      }
    ).then(() => {
      expect(
        posts.every((post, i) => {
          if (i == 0) {
            return post.node.voteSum >= posts[i + 1].node.voteSum
          } else if (i == posts.length - 1) {
            return post.node.voteSum <= posts[i - 1].node.voteSum
          } else {
            return post.node.voteSum >= posts[i + 1].node.voteSum && post.node.voteSum <= posts[i - 1].node.voteSum
          }
        })
      ).to.be.true
    })
  })
})
