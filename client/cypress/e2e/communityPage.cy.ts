import { recurse } from "cypress-recurse"
import { PostFeedQuery } from "../../src/graphql_codegen/graphql"
import { aliasMutation, aliasQuery } from "../utils/graphqlTest"
import { translator } from "../../src/utils/uuid"

beforeEach(function () {
  cy.exec("npm --prefix ../server run resetDb")
  cy.exec("npm --prefix ../server run seed")

  cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
    aliasQuery(req, "PostFeed")
    aliasQuery(req, "Community")

    aliasMutation(req, "CreateCommunityPost")
    aliasMutation(req, "UserJoinCommunity")
  })
})

describe("Navigation", function () {
  it("Redirect if community not found", function () {
    cy.visit("/communities/123")
    cy.location("pathname").should("eq", "/404-not-found")
  })
})

describe("Post form, unauthenticated", function () {
  it("Redirect not logged in users", function () {
    cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn")
    cy.get('[data-testid="open-post-form-button"]').click()
    cy.location("pathname").should("eq", "/login")
  })
})

describe("Post form, authenticated", function () {
  beforeEach(function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
  })

  it("Check open and close", function () {
    cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn")
    cy.get('[data-testid="open-post-form-button"]').click()
    cy.get('[data-testid="post-form"]').should("exist")
    cy.get('[data-testid="close-post-form-button"]').click()
    cy.get('[data-testid="post-form"]').should("not.exist")
  })

  it("Check input validation", function () {
    cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn")
    cy.get('[data-testid="open-post-form-button"]').click()
    cy.get('[data-testid="post-button"]').as("post-button").should("be.disabled")

    cy.get('[data-testid="post-title-length-indicator"]')
      .as("post-title-length-indicator")
      .should("have.css", "color", "rgb(239, 68, 68)")

    cy.get('[data-testid="post-body-input"]').as("post-body-input").type("text")
    cy.get("@post-button").should("be.disabled")

    cy.get('[data-testid="post-title-input"]').as("post-title-input").type("some text")
    cy.get("@post-button").should("not.be.disabled")

    cy.get("@post-title-length-indicator").should("have.css", "color", "rgb(34, 197, 94)")

    cy.get("@post-title-input").invoke("val", "A".repeat(200)).type("A")
    cy.get("@post-title-length-indicator").should("have.css", "color", "rgb(239, 68, 68)")
    cy.get("@post-button").should("be.disabled")

    cy.get("@post-body-input").invoke("val", "A".repeat(20100)).type("A")
    cy.get('[data-testid="post-body-length-indicator"]').should("have.css", "color", "rgb(239, 68, 68)")

    cy.get("@post-body-input").then((element) => {
      expect(element.outerHeight()).to.eq(element.prop("scrollHeight"))
    })

    cy.get("@post-title-input").clear()
    cy.get("@post-button").should("be.disabled")
  })

  it("Check post creation", function () {
    cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn")
    cy.get('[data-testid="open-post-form-button"]').as("open-post-form-button").click()
    cy.get('[data-testid="post-title-input"]').as("post-title-input").type("Post title")
    cy.get('[data-testid="post-body-input"]').as("post-body-input").type("Post body")
    cy.get('[data-testid="post-button"]').click()

    cy.get("@open-post-form-button").click()
    cy.get("@post-title-input").should("have.value", "")
    cy.get("@post-body-input").should("have.value", "")

    cy.wait("@gqlCreateCommunityPostMutation").then(({ response }) => {
      cy.wrap(response?.body.data)
        .its("createPost")
        .should((res) => expect(res.code).to.eq(200))
        .should((res) => expect(res.successMsg).to.eq("Successfully created post"))
    })

    cy.get('[data-testid="community-post-0-title"]').should("have.text", "Post title")
    cy.get('[data-testid="community-post-0-body"]').should("have.text", "Post body")
  })

  it("Check error response", function () {
    cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn")
    cy.get('[data-testid="open-post-form-button"]').as("open-post-form-button").click()
    cy.get('[data-testid="post-title-input"]').as("post-title-input").type("Post title")
    cy.get('[data-testid="post-body-input"]').as("post-body-input").type("Post body")

    cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
      if (req.body.operationName == "CreateCommunityPost") {
        req.reply({ fixture: "/community/errors/createPostInput.json" })
      }
    })

    cy.get('[data-testid="post-button"]').click()

    cy.get('[data-testid="create-community-post-error"]')
      .as("error")
      .should("exist")
      .and("have.text", "Error: Invalid input")
    cy.get('[data-testid="post-form"]').should("exist")

    cy.get('[data-testid="community-post-0-title"]').should("not.have.text", "Post title")
    cy.get('[data-testid="community-post-0-body"]').should("not.have.text", "Post body")

    cy.get('[data-testid="close-post-form-button"]').click()
    cy.get("@open-post-form-button").click()
    cy.get("@error").should("not.exist")
  })
})

describe("Post feed", function () {
  it("Check no posts message shows", function () {
    cy.exec("npm --prefix ../server run deletePosts")

    cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn")

    cy.get('[data-testid="no-posts-text"]').as("no-posts-text").should("exist")
    cy.get("@no-posts-text").should("have.text", "No Posts")
  })

  it("Check infinite scroll", function () {
    cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn")

    let iterations = 1
    let posts: PostFeedQuery["posts"]["edges"] = []

    recurse(
      () => {
        cy.get('[data-testid="community-post-feed"]').as("community-post-feed").children().last().scrollIntoView()

        cy.wait("@gqlPostFeedQuery")
          .then(({ response }) => {
            if (!response) throw new Error("Response not present")

            posts = posts.concat(response.body.data.posts.edges)

            if (iterations != 2) {
              expect(response.body.data.posts.edges).to.have.lengthOf(10)
            } else {
              expect(response.body.data.posts.edges).to.have.lengthOf(3)
            }
          })
          .then(() => {
            iterations += 1
          })

        return cy.get("@community-post-feed").children()
      },
      (children) => {
        return (
          children.length == 14 && children[children.length - 1].innerHTML == "All posts loaded" && posts.length == 13
        )
      }
    ).then(() => {
      expect(posts.every((post) => post.node.community.id == "351146cd-1612-4a44-94da-e33d27bedf39")).to.be.true
    })
  })

  it("Check new ordering", function () {
    cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn")

    let posts: PostFeedQuery["posts"]["edges"] = []

    recurse(
      () => {
        cy.get('[data-testid="community-post-feed"]').as("community-post-feed").children().last().scrollIntoView()

        cy.wait("@gqlPostFeedQuery").then(({ response }) => {
          if (!response) throw new Error("Response not present")

          if (response.body.data.posts.orderBy == "NEW") {
            posts = posts.concat(response.body.data.posts.edges)
          }
        })

        return cy.get("@community-post-feed").children()
      },
      (children) => {
        return children.length == 14 && posts.length == 13
      }
    ).then(() => {
      expect(posts.every((post) => post.node.community.id == "351146cd-1612-4a44-94da-e33d27bedf39")).to.be.true

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
    cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn")

    let posts: PostFeedQuery["posts"]["edges"] = []
    cy.get('[data-testid="order-dropdown"]').click()
    cy.get('[data-testid="order-Old"]').click()

    recurse(
      () => {
        cy.get('[data-testid="community-post-feed"]').as("community-post-feed").children().last().scrollIntoView()

        cy.wait("@gqlPostFeedQuery").then(({ response }) => {
          if (!response) throw new Error("Response not present")

          if (response.body.data.posts.orderBy == "OLD") {
            posts = posts.concat(response.body.data.posts.edges)
          }
        })

        return cy.get("@community-post-feed").children()
      },
      (children) => {
        return children.length == 14 && posts.length == 13
      }
    ).then(() => {
      expect(posts.every((post) => post.node.community.id == "351146cd-1612-4a44-94da-e33d27bedf39")).to.be.true

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
    cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn")

    let posts: PostFeedQuery["posts"]["edges"] = []
    cy.get('[data-testid="order-dropdown"]').click()
    cy.get('[data-testid="order-Low"]').click()

    recurse(
      () => {
        cy.get('[data-testid="community-post-feed"]').as("community-post-feed").children().last().scrollIntoView()

        cy.wait("@gqlPostFeedQuery").then(({ response }) => {
          if (!response) throw new Error("Response not present")

          if (response.body.data.posts.orderBy == "LOW") {
            posts = posts.concat(response.body.data.posts.edges)
          }
        })

        return cy.get("@community-post-feed").children()
      },
      (children) => {
        return children.length == 14 && posts.length == 13
      }
    ).then(() => {
      expect(posts.every((post) => post.node.community.id == "351146cd-1612-4a44-94da-e33d27bedf39")).to.be.true

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
    cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn")

    let posts: PostFeedQuery["posts"]["edges"] = []
    cy.get('[data-testid="order-dropdown"]').click()
    cy.get('[data-testid="order-Top"]').click()

    recurse(
      () => {
        cy.get('[data-testid="community-post-feed"]').as("community-post-feed").children().last().scrollIntoView()

        cy.wait("@gqlPostFeedQuery").then(({ response }) => {
          if (!response) throw new Error("Response not present")

          if (response.body.data.posts.orderBy == "TOP") {
            posts = posts.concat(response.body.data.posts.edges)
          }
        })

        return cy.get("@community-post-feed").children()
      },
      (children) => {
        return children.length == 14 && posts.length == 13
      }
    ).then(() => {
      expect(posts.every((post) => post.node.community.id == "351146cd-1612-4a44-94da-e33d27bedf39")).to.be.true

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

describe("Post", function () {
  it("Check edit post button on owned post", function () {
    cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn")

    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.get('[data-testid="community-post-0-edit-button"]').should("not.exist")
    cy.get('[data-testid="community-post-1-edit-button"]').click()
    cy.location("pathname").should("eq", `/posts/${translator.fromUUID("f19afc1b-1a61-4f93-b2b5-ce87d499feee")}/edit`)

    cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn")

    cy.clearCookie("test-user")
    cy.get('[data-testid="community-post-1-edit-button"]').should("not.exist")
  })
})

describe("Sidebar", function () {
  it("Check correct information", function () {
    cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn")

    cy.get('[data-testid="community-title"]').should("have.text", "Community1")
    cy.get('[data-testid="community-created-at"]').should("have.text", "Created 05/27/2023")
    cy.get('[data-testid="community-member-count"]').should("have.text", "1 Member")
    cy.get('[data-testid="community-post-count"]').should("have.text", "13 Posts")

    cy.get('[data-testid="community-owner"').as("community-owner").should("have.text", "username1")
    cy.get("@community-owner").invoke("attr", "href").should("eq", "/profile/username1")
    cy.get("@community-owner").click()
    cy.location("pathname").should("eq", "/profile/username1")
  })

  describe("Join community button", function () {
    it("Check joining and leaving community", function () {
      cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn")

      cy.get('[data-testid="community-join-button"]').should("not.exist")

      cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
      cy.get('[data-testid="community-join-button"]').should("not.exist")

      cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")
      cy.reload()

      cy.get('[data-testid="community-join-button"]').as("join-button").should("have.text", "Join")

      cy.get("@join-button").click()
      cy.get("@join-button").should("have.text", "Joined")
      cy.get('[data-testid="community-member-count"]').should("have.text", "2 Members")

      cy.wait("@gqlUserJoinCommunityMutation").then(({ response }) => {
        cy.wrap(response?.body.data)
          .its("userJoinCommunity")
          .should((res) => expect(res.code).to.eq(200))
          .should((res) => expect(res.successMsg).to.eq("Successfully joined community"))
          .should((res) => expect(res.community.inCommunity).to.eq(true))
          .should((res) => expect(res.community.memberCount).to.eq(2))
      })

      cy.get("@join-button").click()
      cy.get('[data-testid="community-member-count"]').should("have.text", "1 Member")
      cy.get("@join-button").should("have.text", "Join")

      cy.wait("@gqlUserJoinCommunityMutation").then(({ response }) => {
        cy.wrap(response?.body.data)
          .its("userJoinCommunity")
          .should((res) => expect(res.code).to.eq(200))
          .should((res) => expect(res.successMsg).to.eq("Successfully left community"))
          .should((res) => expect(res.community.inCommunity).to.eq(false))
          .should((res) => expect(res.community.memberCount).to.eq(1))
      })
    })

    describe("Success and error combos (optimistic updates)", function () {
      beforeEach(function () {
        cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")
        cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn")
        cy.get('[data-testid="community-join-button"]').as("join-button")
      })

      it("Error + success + error", function () {
        let requestNum = 1

        cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
          if (req.body.operationName == "UserJoinCommunity") {
            if (requestNum == 1 || requestNum == 3) {
              req.reply({ statusCode: 500 })
            }

            requestNum++
          }
        })

        cy.get("@join-button").click()
        cy.get("@join-button").click()
        cy.get("@join-button").click()

        cy.get("@join-button").should("have.text", "Joined")
        cy.get('[data-testid="community-member-count"]').should("have.text", "2 Members")
      })

      it("Success + error + success", function () {
        let requestNum = 1

        cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
          if (req.body.operationName == "UserJoinCommunity") {
            if (requestNum == 2) {
              req.reply({ statusCode: 500 })
            }

            requestNum++
          }
        })

        cy.get("@join-button").click()
        cy.get("@join-button").click()
        cy.get("@join-button").click()

        cy.get("@join-button").should("have.text", "Join")
        cy.get('[data-testid="community-member-count"]').should("have.text", "1 Member")
      })
    })
  })

  it("Check edit community button", function () {
    cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn")

    cy.get('[data-testid="community-edit-button"]').should("not.exist")

    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
    cy.reload()

    cy.get('[data-testid="community-edit-button"]').click()
    cy.location("pathname").should("eq", "/communities/7y5hQri7cfRRpU5trE5CAn/settings")

    cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")
    cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn")
    cy.get('[data-testid="community-edit-button"]').should("not.exist")
  })
})

describe("Header (small screen)", function () {
  it("Check correct information", function () {
    cy.viewport(300, 600)
    cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn")

    cy.get('[data-testid="community-header-title"]').should("have.text", "Community1")
    cy.get('[data-testid="community-header-created-at"]').should("have.text", "Created 05/27/2023")
    cy.get('[data-testid="community-header-posts-and-members"]').should("have.text", "1 Member • 13 Posts")

    cy.get('[data-testid="community-header-owner"').as("community-owner").should("have.text", "username1")
    cy.get("@community-owner").invoke("attr", "href").should("eq", "/profile/username1")
    cy.get("@community-owner").click()
    cy.location("pathname").should("eq", "/profile/username1")
  })

  it("Check edit community button", function () {
    cy.viewport(300, 600)
    cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn")

    cy.get('[data-testid="community-header-edit-button"]').should("not.exist")

    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
    cy.reload()

    cy.get('[data-testid="community-header-edit-button"]').click()
    cy.location("pathname").should("eq", "/communities/7y5hQri7cfRRpU5trE5CAn/settings")

    cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")
    cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn")
    cy.get('[data-testid="community-header-edit-button"]').should("not.exist")
  })

  it("Check join community button present", function () {
    cy.viewport(300, 600)
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
    cy.visit("/communities/7y5hQri7cfRRpU5trE5CAn")
    cy.get('[data-testid="community-header-join-button"]').should("not.exist")

    cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")
    cy.reload()
    cy.get('[data-testid="community-header-join-button"]')
  })
})
