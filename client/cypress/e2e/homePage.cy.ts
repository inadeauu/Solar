import { recurse } from "cypress-recurse"
import { aliasQuery } from "../../src/utils/graphql-test-utils"
import { PostFeedQuery } from "../../src/graphql_codegen/graphql"

beforeEach(function () {
  cy.exec("npm --prefix ../server run resetDb")
  cy.exec("npm --prefix ../server run seed")

  cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
    aliasQuery(req, "PostFeed")
  })
})

describe("Post feed", function () {
  it("Check no posts message shows", function () {
    cy.exec("npm --prefix ../server run resetDb")

    cy.visit("/")

    cy.get('[data-testid="no-posts-text"]').as("no-posts-text").should("exist")
    cy.get("@no-posts-text").should("contain.text", "No Posts")
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
              expect(response.body.data.posts.edges).to.have.lengthOf(1)
            }
          })
          .then(() => {
            iterations += 1
          })

        return cy.get("@home-post-feed").children()
      },
      (children) => {
        return children.length == 22 && children[children.length - 1].innerHTML == "All posts loaded"
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

          if (response.body.data.orderBy == "NEW") {
            posts = posts.concat(response.body.data.posts.edges)
          }
        })

        return cy.get("@home-post-feed").children()
      },
      (children) => {
        return children.length == 22
      }
    ).then(() => {
      posts = posts.slice(0, posts.length - 2)

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

          if (response.body.data.orderBy == "OLD") {
            posts = posts.concat(response.body.data.posts.edges)
          }
        })

        return cy.get("@home-post-feed").children()
      },
      (children) => {
        return children.length == 22
      }
    ).then(() => {
      posts = posts.slice(0, posts.length - 2)

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

          if (response.body.data.orderBy == "LOW") {
            posts = posts.concat(response.body.data.posts.edges)
          }
        })

        return cy.get("@home-post-feed").children()
      },
      (children) => {
        return children.length == 22
      }
    ).then(() => {
      posts = posts.slice(0, posts.length - 2)

      expect(
        posts.every((post, i) => {
          if (i == 0) {
            return post.node.voteSum < posts[i + 1].node.voteSum
          } else if (i == posts.length - 1) {
            return post.node.voteSum > posts[i - 1].node.voteSum
          } else {
            return post.node.voteSum < posts[i + 1].node.voteSum && post.node.voteSum > posts[i - 1].node.voteSum
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

          if (response.body.data.orderBy == "TOP") {
            posts = posts.concat(response.body.data.posts.edges)
          }
        })

        return cy.get("@home-post-feed").children()
      },
      (children) => {
        return children.length == 22
      }
    ).then(() => {
      posts = posts.slice(0, posts.length - 2)

      expect(
        posts.every((post, i) => {
          if (i == 0) {
            return post.node.voteSum > posts[i + 1].node.voteSum
          } else if (i == posts.length - 1) {
            return post.node.voteSum < posts[i - 1].node.voteSum
          } else {
            return post.node.voteSum > posts[i + 1].node.voteSum && post.node.voteSum < posts[i - 1].node.voteSum
          }
        })
      ).to.be.true
    })
  })
})
