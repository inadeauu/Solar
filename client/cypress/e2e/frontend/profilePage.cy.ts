import { recurse } from "cypress-recurse"
import { aliasQuery } from "../../utils/graphqlTest"
import {
  CommentFeedQuery,
  CommunityFeedQuery,
  PostFeedQuery,
  ProfileCommentFeedQuery,
} from "../../../src/graphql_codegen/graphql"
import { nodeIdsUnique } from "../../utils/utils"

beforeEach(function () {
  cy.exec("npm --prefix ../server run resetDb")
  cy.exec("npm --prefix ../server run seed")

  cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
    aliasQuery(req, "PostFeed")
    aliasQuery(req, "ProfileCommentFeed")
    aliasQuery(req, "CommunityFeed")
  })
})

describe("Navigation", function () {
  it("Redirect to 404 page if user doesn't exist", function () {
    cy.visit("/profile/123")
    cy.location("pathname").should("eq", "/404-not-found")
  })
})

describe("Sidebar", function () {
  it("Check information is correct", function () {
    cy.visit("/profile/username2")
    cy.get('[data-testid="sidebar-username"]').should("have.text", "username2")
    cy.get('[data-testid="sidebar-joined"]').should("have.text", "Joined 05/24/2022")
    cy.get('[data-testid="sidebar-post-count"]').should("have.text", "2 Posts")
    cy.get('[data-testid="sidebar-comment-count"]').should("have.text", "17 Comments")
  })

  it("Check edit button appears on user's own profile and navigates to settings", function () {
    cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")
    cy.visit("/profile/username2")
    cy.get('[data-testid="sidebar-edit-button"]').click()
    cy.location("pathname").should("eq", "/settings")
    cy.go(-1)

    cy.clearCookie("test-user")
    cy.reload()
    cy.get('[data-testid="sidebar-edit-button"]').should("not.exist")

    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
    cy.reload()
    cy.get('[data-testid="sidebar-edit-button"]').should("not.exist")
  })

  it("Check sidebar is visible and header is not on larger screens", function () {
    cy.visit("/profile/username2")
    cy.get('[data-testid="profile-header"]').should("not.be.visible")
    cy.get('[data-testid="profile-sidebar"]').should("be.visible")

    cy.viewport(1000, 800)
    cy.get('[data-testid="profile-header"]').should("not.be.visible")
    cy.get('[data-testid="profile-sidebar"]').should("be.visible")
  })
})

describe("Header", function () {
  it("Check information is correct", function () {
    cy.visit("/profile/username2")
    cy.get('[data-testid="header-username"]').should("have.text", "username2")
    cy.get('[data-testid="header-joined"]').should("have.text", "Joined 05/24/2022")
    cy.get('[data-testid="header-post-comment-count"]').should("have.text", "2 Posts•17 Comments")
  })

  it("Check edit button appears on user's own profile and navigates to settings", function () {
    cy.viewport(300, 600)
    cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")
    cy.visit("/profile/username2")

    cy.get('[data-testid="header-edit-button"]').click()
    cy.location("pathname").should("eq", "/settings")
    cy.go(-1)

    cy.clearCookie("test-user")
    cy.reload()
    cy.get('[data-testid="header-edit-button"]').should("not.exist")

    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
    cy.reload()
    cy.get('[data-testid="header-edit-button"]').should("not.exist")
  })

  it("Check header is visible and sidebar is not on smaller screens", function () {
    cy.viewport(300, 600)
    cy.visit("/profile/username2")

    cy.get('[data-testid="profile-header"]').should("be.visible")
    cy.get('[data-testid="profile-sidebar"]').should("not.be.visible")
  })
})

describe("Feed selector", function () {
  it("Check the correct tabs are present", function () {
    cy.visit("/profile/username2")

    cy.get('[data-testid="profile-feed-tabs"]').children().as("tabs")

    cy.get("@tabs").eq(0).should("have.text", "Posts")
    cy.get("@tabs").eq(1).should("have.text", "Comments")
    cy.get("@tabs").eq(2).should("have.text", "Communities")
  })

  it("Check the tabs show the correct feeds", function () {
    cy.visit("/profile/username2")

    cy.get('[data-testid="profile-feed-tabs"]').children().as("tabs")
    cy.get('[data-testid="profile-post-feed"]')

    cy.get("@tabs").eq(1).click()
    cy.get('[data-testid="profile-comment-feed"]')

    cy.get("@tabs").eq(2).click()
    cy.get('[data-testid="profile-community-feed"]')

    cy.get("@tabs").eq(0).click()
    cy.get('[data-testid="profile-post-feed"]')
  })
})

describe("Post feed", function () {
  it("Check infinite scroll", function () {
    cy.visit("/profile/username1")

    let posts: PostFeedQuery["posts"]["edges"] = []

    let iterations = 1

    recurse(
      () => {
        cy.get('[data-testid="profile-post-feed"]').as("profile-post-feed").children().last().scrollIntoView()

        cy.wait("@gqlPostFeedQuery").then(({ response }) => {
          if (!response) throw new Error("Response not present")

          if (iterations != 2) {
            expect(response.body.data.posts.edges).to.have.lengthOf(10)
          } else {
            expect(response.body.data.posts.edges).to.have.lengthOf(9)
          }

          posts = posts.concat(response.body.data.posts.edges)
          iterations += 1
        })

        return cy.get("@profile-post-feed").children()
      },
      (children) => {
        return (
          children.length == 20 && children[children.length - 1].innerHTML == "All posts loaded" && posts.length == 19
        )
      }
    ).then(() => {
      expect(nodeIdsUnique(posts)).to.be.true
      expect(posts.every((post) => post.node.owner.id == "8d2efb36-a726-425c-ad12-98f2683c5d86")).to.be.true
    })
  })

  it("Check new ordering", function () {
    cy.visit("/profile/username1")

    let posts: PostFeedQuery["posts"]["edges"] = []

    recurse(
      () => {
        cy.get('[data-testid="profile-post-feed"]').as("profile-post-feed").children().last().scrollIntoView()

        cy.wait("@gqlPostFeedQuery").then(({ response }) => {
          if (!response) throw new Error("Response not present")

          if (response.body.data.posts.orderBy == "NEW") {
            posts = posts.concat(response.body.data.posts.edges)
          }
        })

        return cy.get("@profile-post-feed").children()
      },
      (children) => {
        return children.length == 20 && posts.length == 19
      }
    ).then(() => {
      expect(nodeIdsUnique(posts)).to.be.true

      expect(posts.every((post) => post.node.owner.id == "8d2efb36-a726-425c-ad12-98f2683c5d86")).to.be.true

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
    cy.visit("/profile/username1")

    let posts: PostFeedQuery["posts"]["edges"] = []

    cy.get('[data-testid="order-dropdown"]').click()
    cy.get('[data-testid="order-Old"]').click()

    recurse(
      () => {
        cy.get('[data-testid="profile-post-feed"]').as("profile-post-feed").children().last().scrollIntoView()

        cy.wait("@gqlPostFeedQuery").then(({ response }) => {
          if (!response) throw new Error("Response not present")

          if (response.body.data.posts.orderBy == "OLD") {
            posts = posts.concat(response.body.data.posts.edges)
          }
        })

        return cy.get("@profile-post-feed").children()
      },
      (children) => {
        return children.length == 20 && posts.length == 19
      }
    ).then(() => {
      expect(nodeIdsUnique(posts)).to.be.true

      expect(posts.every((post) => post.node.owner.id == "8d2efb36-a726-425c-ad12-98f2683c5d86")).to.be.true

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
    cy.visit("/profile/username1")

    let posts: PostFeedQuery["posts"]["edges"] = []

    cy.get('[data-testid="order-dropdown"]').click()
    cy.get('[data-testid="order-Low"]').click()

    recurse(
      () => {
        cy.get('[data-testid="profile-post-feed"]').as("profile-post-feed").children().last().scrollIntoView()

        cy.wait("@gqlPostFeedQuery").then(({ response }) => {
          if (!response) throw new Error("Response not present")

          if (response.body.data.posts.orderBy == "LOW") {
            posts = posts.concat(response.body.data.posts.edges)
          }
        })

        return cy.get("@profile-post-feed").children()
      },
      (children) => {
        return children.length == 20 && posts.length == 19
      }
    ).then(() => {
      expect(nodeIdsUnique(posts)).to.be.true

      expect(posts.every((post) => post.node.owner.id == "8d2efb36-a726-425c-ad12-98f2683c5d86")).to.be.true

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
    cy.visit("/profile/username1")

    let posts: PostFeedQuery["posts"]["edges"] = []

    cy.get('[data-testid="order-dropdown"]').click()
    cy.get('[data-testid="order-Top"]').click()

    recurse(
      () => {
        cy.get('[data-testid="profile-post-feed"]').as("profile-post-feed").children().last().scrollIntoView()

        cy.wait("@gqlPostFeedQuery").then(({ response }) => {
          if (!response) throw new Error("Response not present")

          if (response.body.data.posts.orderBy == "TOP") {
            posts = posts.concat(response.body.data.posts.edges)
          }
        })

        return cy.get("@profile-post-feed").children()
      },
      (children) => {
        return children.length == 20 && posts.length == 19
      }
    ).then(() => {
      expect(nodeIdsUnique(posts)).to.be.true

      expect(posts.every((post) => post.node.owner.id == "8d2efb36-a726-425c-ad12-98f2683c5d86")).to.be.true

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

describe("Comment card", function () {
  beforeEach(function () {
    cy.visit("/profile/username1")
    cy.get('[data-testid="profile-feed-tabs"]').children().as("tabs")
    cy.get("@tabs").eq(1).click()
  })

  it("Check information is correct", function () {
    cy.get('[data-testid="profile-comment-0-username"]').should("have.text", "username1")
    cy.get('[data-testid="profile-comment-0-posted-by"]').should("have.text", "username1")
    cy.get('[data-testid="profile-comment-0-comment-owner"]').should("have.text", "username1")

    cy.get('[data-testid="profile-comment-0-comment-body"]').should("have.text", "Comment 35")
    cy.get('[data-testid="profile-comment-1-vote-sum"]').should("have.text", "-2")
    cy.get('[data-testid="profile-comment-0-reply-count"]').should("have.text", "14 Replies")

    cy.get('[data-testid="profile-comment-0-post-title"]').should("have.text", "Post 23").click()
    cy.location("pathname").should("eq", "/posts/mHRV3KpnHiiDHaAzhfrwxK")
    cy.go(-1)
    cy.get('[data-testid="profile-feed-tabs"]').children().as("tabs")
    cy.get("@tabs").eq(1).click()

    cy.get('[data-testid="profile-comment-0-community-title"]').should("have.text", "newcommunity").click()
    cy.location("pathname").should("eq", "/communities/13eZfzJ63BQPYZ7jBMi56B")
  })

  it("Check edit post button appears when it should and works", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.reload()
    cy.get('[data-testid="profile-feed-tabs"]').children().as("tabs")
    cy.get("@tabs").eq(1).click()

    cy.get('[data-testid="profile-comment-0-edit-button"]').click()
    cy.location("pathname").should("eq", "/comments/cQKzx68TcbLKJkyRPH8BKA/edit")
    cy.go(-1)

    cy.clearCookie("test-user")
    cy.reload()

    cy.get("@tabs").eq(1).click()
    cy.get('[data-testid="profile-comment-0-edit-button"]').should("not.exist")

    cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")
    cy.reload()

    cy.get("@tabs").eq(1).click()
    cy.get('[data-testid="profile-comment-0-edit-button"]').should("not.exist")
  })
})

describe("Comment feed", function () {
  beforeEach(function () {
    cy.visit("/profile/username1")
    cy.get('[data-testid="profile-feed-tabs"]').children().as("tabs")
    cy.get("@tabs").eq(1).click()
  })

  it("Check infinite scroll + top-level filter", function () {
    let iterations = 1

    let comments: ProfileCommentFeedQuery["comments"]["edges"] = []

    recurse(
      () => {
        cy.get('[data-testid="profile-comment-feed"]').as("profile-comment-feed").children().last().scrollIntoView()

        cy.wait("@gqlProfileCommentFeedQuery").then(({ response }) => {
          if (!response) throw new Error("Response not present")

          if (iterations != 2) {
            expect(response.body.data.comments.edges).to.have.lengthOf(10)
          } else {
            expect(response.body.data.comments.edges).to.have.lengthOf(6)
          }

          comments = comments.concat(response.body.data.comments.edges)
          iterations += 1
        })

        return cy.get("@profile-comment-feed").children()
      },
      (children) => {
        return (
          children.length == 17 &&
          children[children.length - 1].innerHTML == "All comments loaded" &&
          comments.length == 16
        )
      }
    ).then(() => {
      expect(nodeIdsUnique(comments)).to.be.true
      expect(comments.every((comment) => comment.node.parent == null)).to.be.true
      expect(comments.every((comment) => comment.node.owner.id == "8d2efb36-a726-425c-ad12-98f2683c5d86")).to.be.true
    })
  })

  it("Check new ordering + top-level filter", function () {
    let comments: CommentFeedQuery["comments"]["edges"] = []

    recurse(
      () => {
        cy.get('[data-testid="profile-comment-feed"]').as("profile-comment-feed").children().last().scrollIntoView()

        cy.wait("@gqlProfileCommentFeedQuery").then(({ response }) => {
          if (!response) throw new Error("Response not present")

          if (response.body.data.comments.orderBy == "NEW") {
            comments = comments.concat(response.body.data.comments.edges)
          }
        })

        return cy.get("@profile-comment-feed").children()
      },
      (children) => {
        return (
          children.length == 17 &&
          children[children.length - 1].innerHTML == "All comments loaded" &&
          comments.length == 16
        )
      }
    ).then(() => {
      expect(nodeIdsUnique(comments)).to.be.true
      expect(comments.every((comment) => comment.node.parent == null)).to.be.true
      expect(comments.every((comment) => comment.node.owner.id == "8d2efb36-a726-425c-ad12-98f2683c5d86")).to.be.true

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

  it("Check old ordering + top-level filter", function () {
    let comments: CommentFeedQuery["comments"]["edges"] = []

    cy.get('[data-testid="order-dropdown"]').click()
    cy.get('[data-testid="order-Old"]').click()

    recurse(
      () => {
        cy.get('[data-testid="profile-comment-feed"]').as("profile-comment-feed").children().last().scrollIntoView()

        cy.wait("@gqlProfileCommentFeedQuery").then(({ response }) => {
          if (!response) throw new Error("Response not present")

          if (response.body.data.comments.orderBy == "OLD") {
            comments = comments.concat(response.body.data.comments.edges)
          }
        })

        return cy.get("@profile-comment-feed").children()
      },
      (children) => {
        return (
          children.length == 17 &&
          children[children.length - 1].innerHTML == "All comments loaded" &&
          comments.length == 16
        )
      }
    ).then(() => {
      expect(nodeIdsUnique(comments)).to.be.true
      expect(comments.every((comment) => comment.node.parent == null)).to.be.true
      expect(comments.every((comment) => comment.node.owner.id == "8d2efb36-a726-425c-ad12-98f2683c5d86")).to.be.true

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

  it("Check increasing vote count ordering + top-level filter", function () {
    let comments: CommentFeedQuery["comments"]["edges"] = []

    cy.get('[data-testid="order-dropdown"]').click()
    cy.get('[data-testid="order-Low"]').click()

    recurse(
      () => {
        cy.get('[data-testid="profile-comment-feed"]').as("profile-comment-feed").children().last().scrollIntoView()

        cy.wait("@gqlProfileCommentFeedQuery").then(({ response }) => {
          if (!response) throw new Error("Response not present")

          if (response.body.data.comments.orderBy == "LOW") {
            comments = comments.concat(response.body.data.comments.edges)
          }
        })

        return cy.get("@profile-comment-feed").children()
      },
      (children) => {
        return (
          children.length == 17 &&
          children[children.length - 1].innerHTML == "All comments loaded" &&
          comments.length == 16
        )
      }
    ).then(() => {
      expect(nodeIdsUnique(comments)).to.be.true
      expect(comments.every((comment) => comment.node.parent == null)).to.be.true
      expect(comments.every((comment) => comment.node.owner.id == "8d2efb36-a726-425c-ad12-98f2683c5d86")).to.be.true

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

  it("Check decreasing vote count ordering + top-level filter", function () {
    let comments: CommentFeedQuery["comments"]["edges"] = []

    cy.get('[data-testid="order-dropdown"]').click()
    cy.get('[data-testid="order-Top"]').click()

    recurse(
      () => {
        cy.get('[data-testid="profile-comment-feed"]').as("profile-comment-feed").children().last().scrollIntoView()

        cy.wait("@gqlProfileCommentFeedQuery").then(({ response }) => {
          if (!response) throw new Error("Response not present")

          if (response.body.data.comments.orderBy == "TOP") {
            comments = comments.concat(response.body.data.comments.edges)
          }
        })

        return cy.get("@profile-comment-feed").children()
      },
      (children) => {
        return (
          children.length == 17 &&
          children[children.length - 1].innerHTML == "All comments loaded" &&
          comments.length == 16
        )
      }
    ).then(() => {
      expect(nodeIdsUnique(comments)).to.be.true
      expect(comments.every((comment) => comment.node.parent == null)).to.be.true
      expect(comments.every((comment) => comment.node.owner.id == "8d2efb36-a726-425c-ad12-98f2683c5d86")).to.be.true

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

  it("Check infinite scroll + reply filter", function () {
    let iterations = 1

    let comments: ProfileCommentFeedQuery["comments"]["edges"] = []

    cy.get('[data-testid="filter-dropdown"]').click()
    cy.get('[data-testid="filter-Reply"]').click()

    recurse(
      () => {
        cy.get('[data-testid="profile-comment-feed"]').as("profile-comment-feed").children().last().scrollIntoView()

        cy.wait("@gqlProfileCommentFeedQuery").then(({ response }) => {
          if (!response) throw new Error("Response not present")

          if (response.body.data.comments.replies) {
            if (iterations != 2) {
              expect(response.body.data.comments.edges).to.have.lengthOf(10)
            } else {
              expect(response.body.data.comments.edges).to.have.lengthOf(5)
            }

            comments = comments.concat(response.body.data.comments.edges)
            iterations += 1
          }
        })

        return cy.get("@profile-comment-feed").children()
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
      expect(comments.every((comment) => comment.node.parent != null)).to.be.true
      expect(comments.every((comment) => comment.node.owner.id == "8d2efb36-a726-425c-ad12-98f2683c5d86")).to.be.true
    })
  })
})

describe("Community card", function () {
  it("Check information is correct", function () {
    cy.visit("/profile/username1")
    cy.get('[data-testid="profile-feed-tabs"]').children().as("tabs")
    cy.get("@tabs").eq(2).click()

    cy.get('[data-testid="profile-community-0-community-title"]').should("have.text", "Community1")
    cy.get('[data-testid="profile-community-0-created"]').should("have.text", "Created 05/27/2023")
    cy.get('[data-testid="profile-community-0-post-member-count"]').should("have.text", "13 Posts • 1 Member")

    cy.get('[data-testid="profile-community-0-link"]').click()
    cy.location("pathname").should("eq", "/communities/7y5hQri7cfRRpU5trE5CAn")
  })

  it("Check edit button appears when community owned", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
    cy.visit("/profile/username1")
    cy.get('[data-testid="profile-feed-tabs"]').children().as("tabs")
    cy.get("@tabs").eq(2).click()

    cy.get('[data-testid="profile-community-0-edit-button"]').click()
    cy.location("pathname").should("eq", "/communities/7y5hQri7cfRRpU5trE5CAn/settings")

    cy.clearCookie("test-user")
    cy.visit("/profile/username1")
    cy.get("@tabs").eq(2).click()
    cy.get('[data-testid="profile-community-0-edit-button"]').should("not.exist")

    cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")
    cy.reload()

    cy.get("@tabs").eq(2).click()
    cy.get('[data-testid="profile-community-0-edit-button"]').should("not.exist")
  })
})

describe("Community feed", function () {
  it("Check infinite scroll + owns filter", function () {
    cy.visit("/profile/username1")
    cy.get('[data-testid="profile-feed-tabs"]').children().as("tabs")
    cy.get("@tabs").eq(2).click()

    let iterations = 1

    let communities: CommunityFeedQuery["communities"]["edges"] = []

    recurse(
      () => {
        cy.get('[data-testid="profile-community-feed"]').as("profile-community-feed").children().last().scrollIntoView()

        cy.wait("@gqlCommunityFeedQuery").then(({ response }) => {
          if (!response) throw new Error("Response not present")

          if (iterations != 2) {
            expect(response.body.data.communities.edges).to.have.lengthOf(10)
          } else {
            expect(response.body.data.communities.edges).to.have.lengthOf(4)
          }

          communities = communities.concat(response.body.data.communities.edges)
          iterations += 1
        })

        return cy.get("@profile-community-feed").children()
      },
      (children) => {
        return (
          children.length == 15 &&
          children[children.length - 1].innerHTML == "All communities loaded" &&
          communities.length == 14
        )
      }
    ).then(() => {
      expect(nodeIdsUnique(communities)).to.be.true
      expect(communities.every((community) => community.node.owner.id == "8d2efb36-a726-425c-ad12-98f2683c5d86")).to.be
        .true
    })
  })

  it("Check infinite scroll + member of filter", function () {
    cy.visit("/profile/username2")
    cy.get('[data-testid="profile-feed-tabs"]').children().as("tabs")
    cy.get("@tabs").eq(2).click()

    let iterations = 1

    let communities: CommunityFeedQuery["communities"]["edges"] = []

    cy.get('[data-testid="filter-dropdown"]').click()
    cy.get('[data-testid="filter-Member of"]').click()

    recurse(
      () => {
        cy.get('[data-testid="profile-community-feed"]').as("profile-community-feed").children().last().scrollIntoView()

        cy.wait("@gqlCommunityFeedQuery").then(({ response }) => {
          if (!response) throw new Error("Response not present")

          if (response.body.data.communities.memberOf) {
            if (iterations != 2) {
              expect(response.body.data.communities.edges).to.have.lengthOf(10)
            } else {
              expect(response.body.data.communities.edges).to.have.lengthOf(2)
            }

            communities = communities.concat(response.body.data.communities.edges)
            iterations += 1
          }
        })

        return cy.get("@profile-community-feed").children()
      },
      (children) => {
        return (
          children.length == 13 &&
          children[children.length - 1].innerHTML == "All communities loaded" &&
          communities.length == 12
        )
      }
    ).then(() => {
      console.log(communities)
      expect(nodeIdsUnique(communities)).to.be.true
      expect(communities[0].node.title == "test1").to.be.true
      expect(communities[communities.length - 1].node.title == "test9").to.be.true
    })
  })
})
