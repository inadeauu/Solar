import { ClientError } from "graphql-request"
import { GetPostsTestDocQuery, PostOrderByType, VoteStatus } from "../../../src/graphql_codegen/graphql"
import { graphQLClient } from "../../../src/utils/graphql"
import {
  createPostTestDoc,
  deletePostTestDoc,
  editPostTestDoc,
  getPostTestDoc,
  getPostsTestDoc,
  votePostTestDoc,
} from "../../utils/graphql/postGraphQL"
import {
  hasDecreasingVoteSumOrdering,
  hasIncreasingVoteSumOrdering,
  hasNewOrdering,
  hasOldOrdering,
  hasSameCommunityId,
  hasSameOwnerId,
  nodeIdsUnique,
} from "../../utils/utils"
import { aliasMutation } from "../../utils/graphqlTest"

beforeEach(function () {
  cy.exec("npm --prefix ../server run resetDb")
  cy.exec("npm --prefix ../server run seed")

  cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
    aliasMutation(req, "CreatePostTest")
    aliasMutation(req, "VotePostTest")
    aliasMutation(req, "EditPostTest")
    aliasMutation(req, "DeletePostTest")
  })

  cy.visit("/")
})

describe("Post endpoint", function () {
  it("Check correct post and its information returned", function () {
    cy.wrap(graphQLClient.request(getPostTestDoc, { input: { id: "351146cd-1612-4a44-94da-e33d27bedf39" } }))
      .its("post")
      .should((res) => expect(res.id).to.eq("351146cd-1612-4a44-94da-e33d27bedf39"))
      .should((res) => expect(res.title).to.eq("Post 1"))
      .should((res) => expect(res.body).to.eq("Post body 1"))
      .should((res) => expect(res.created_at).to.eq("2023-08-25T11:52:12.876Z"))
      .should((res) => expect(res.updated_at).to.eq("2023-08-25T11:52:12.876Z"))
      .should((res) => expect(res.commentCount).to.eq(16))
      .should((res) => expect(res.voteSum).to.eq(3))
      .should((res) => expect(res.voteStatus).to.eq(VoteStatus.None))
      .should((res) => expect(res.owner.id).to.eq("8d2efb36-a726-425c-ad12-98f2683c5d86"))
      .should((res) => expect(res.community.id).to.eq("351146cd-1612-4a44-94da-e33d27bedf39"))
  })

  it("Check correct vote sum returned", function () {
    cy.then(() => {
      cy.wrap(graphQLClient.request(getPostTestDoc, { input: { id: "d98d07e1-e017-4359-bca5-20b95355181e" } }))
        .its("post")
        .should((res) => expect(res.voteSum).to.eq(-1))
    })

    cy.then(() => {
      cy.wrap(graphQLClient.request(getPostTestDoc, { input: { id: "74ee0ea3-1907-434a-9a0d-0cb5bef872a2" } }))
        .its("post")
        .should((res) => expect(res.voteSum).to.eq(-2))
    })
  })

  it("Check correct vote status returned", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(graphQLClient.request(getPostTestDoc, { input: { id: "351146cd-1612-4a44-94da-e33d27bedf39" } }))
        .its("post")
        .should((res) => expect(res.voteStatus).to.eq(VoteStatus.Like))
    })

    cy.then(() => {
      cy.wrap(graphQLClient.request(getPostTestDoc, { input: { id: "d98d07e1-e017-4359-bca5-20b95355181e" } }))
        .its("post")
        .should((res) => expect(res.voteStatus).to.eq(VoteStatus.Dislike))
    })
  })
})

describe("Posts endpoint", function () {
  describe("Pagination & ordering", function () {
    it("Check pagination + new ordering", function () {
      let posts: GetPostsTestDocQuery["posts"]["edges"] = []
      let afterCursor: GetPostsTestDocQuery["posts"]["pageInfo"]["endCursor"]

      cy.then(() => {
        cy.wrap(
          graphQLClient.request(getPostsTestDoc, {
            input: { paginate: { first: 15 }, filters: { orderBy: PostOrderByType.New } },
          })
        )
          .its("posts")
          .then((res) => {
            expect(res.edges.length).to.eq(15)
            expect(res.pageInfo.endCursor.id).to.eq("752a6a78-4a22-4f46-990a-8b439d99ded8")
            expect(res.pageInfo.endCursor.created_at).to.eq("2023-08-17T11:52:12.876Z")
            expect(res.pageInfo.endCursor.voteSum).to.eq(null)
            expect(res.pageInfo.hasNextPage).to.eq(true)

            posts = posts.concat(res.edges)
            afterCursor = res.pageInfo.endCursor
          })
          .its("orderBy")
          .should("eq", "NEW")
      })

      cy.then(() => {
        cy.wrap(
          graphQLClient.request(getPostsTestDoc, {
            input: { paginate: { first: 15, after: afterCursor }, filters: { orderBy: PostOrderByType.New } },
          })
        )
          .its("posts")
          .then((res) => {
            expect(res.edges.length).to.eq(8)
            expect(res.pageInfo.endCursor).to.eq(null)
            expect(res.pageInfo.hasNextPage).to.eq(false)

            posts = posts.concat(res.edges)
          })
          .its("orderBy")
          .should("eq", "NEW")
      })

      cy.then(() => {
        cy.wrap(nodeIdsUnique(posts)).should("eq", true)
        cy.wrap(hasNewOrdering(posts)).should("eq", true)
      })
    })

    it("Check pagination + old ordering", function () {
      let posts: GetPostsTestDocQuery["posts"]["edges"] = []
      let afterCursor: GetPostsTestDocQuery["posts"]["pageInfo"]["endCursor"]

      cy.then(() => {
        cy.wrap(
          graphQLClient.request(getPostsTestDoc, {
            input: { paginate: { first: 15 }, filters: { orderBy: PostOrderByType.Old } },
          })
        )
          .its("posts")
          .then((res) => {
            expect(res.edges.length).to.eq(15)
            expect(res.pageInfo.endCursor.id).to.eq("26ead1e7-fa3a-4de3-81e8-781e5d7f3a9f")
            expect(res.pageInfo.endCursor.created_at).to.eq("2023-08-23T11:52:12.876Z")
            expect(res.pageInfo.endCursor.voteSum).to.eq(null)
            expect(res.pageInfo.hasNextPage).to.eq(true)

            posts = posts.concat(res.edges)
            afterCursor = res.pageInfo.endCursor
          })
          .its("orderBy")
          .should("eq", "OLD")
      })

      cy.then(() => {
        cy.wrap(
          graphQLClient.request(getPostsTestDoc, {
            input: { paginate: { first: 15, after: afterCursor }, filters: { orderBy: PostOrderByType.Old } },
          })
        )
          .its("posts")
          .then((res) => {
            expect(res.edges.length).to.eq(8)
            expect(res.pageInfo.endCursor).to.eq(null)
            expect(res.pageInfo.hasNextPage).to.eq(false)

            posts = posts.concat(res.edges)
          })
          .its("orderBy")
          .should("eq", "OLD")
      })

      cy.then(() => {
        cy.wrap(nodeIdsUnique(posts)).should("eq", true)
        cy.wrap(hasOldOrdering(posts)).should("eq", true)
      })
    })

    it("Check pagination + increasing vote count ordering", function () {
      let posts: GetPostsTestDocQuery["posts"]["edges"] = []
      let afterCursor: GetPostsTestDocQuery["posts"]["pageInfo"]["endCursor"]

      cy.then(() => {
        cy.wrap(
          graphQLClient.request(getPostsTestDoc, {
            input: { paginate: { first: 15 }, filters: { orderBy: PostOrderByType.Low } },
          })
        )
          .its("posts")
          .then((res) => {
            expect(res.edges.length).to.eq(15)
            expect(res.pageInfo.endCursor.id).to.eq("a7cf075b-9550-4c25-a677-6fdab73c6271")
            expect(res.pageInfo.endCursor.created_at).to.eq("2023-08-27T13:52:12.876Z")
            expect(res.pageInfo.endCursor.voteSum).to.eq(0)
            expect(res.pageInfo.hasNextPage).to.eq(true)

            posts = posts.concat(res.edges)
            afterCursor = res.pageInfo.endCursor
          })
          .its("orderBy")
          .should("eq", "LOW")
      })

      cy.then(() => {
        cy.wrap(
          graphQLClient.request(getPostsTestDoc, {
            input: { paginate: { first: 15, after: afterCursor }, filters: { orderBy: PostOrderByType.Low } },
          })
        )
          .its("posts")
          .then((res) => {
            expect(res.edges.length).to.eq(8)
            expect(res.pageInfo.endCursor).to.eq(null)
            expect(res.pageInfo.hasNextPage).to.eq(false)

            posts = posts.concat(res.edges)
          })
          .its("orderBy")
          .should("eq", "LOW")
      })

      cy.then(() => {
        cy.wrap(nodeIdsUnique(posts)).should("eq", true)
        cy.wrap(hasIncreasingVoteSumOrdering(posts)).should("eq", true)
      })
    })

    it("Check pagination + decreasing vote count ordering", function () {
      let posts: GetPostsTestDocQuery["posts"]["edges"] = []
      let afterCursor: GetPostsTestDocQuery["posts"]["pageInfo"]["endCursor"]

      cy.then(() => {
        cy.wrap(
          graphQLClient.request(getPostsTestDoc, {
            input: { paginate: { first: 15 }, filters: { orderBy: PostOrderByType.Top } },
          })
        )
          .its("posts")
          .then((res) => {
            expect(res.edges.length).to.eq(15)
            expect(res.pageInfo.endCursor.id).to.eq("b3d1f64a-e9c0-42bf-ad08-2f62d7cecf12")
            expect(res.pageInfo.endCursor.created_at).to.eq("2023-08-15T11:52:12.876Z")
            expect(res.pageInfo.endCursor.voteSum).to.eq(0)
            expect(res.pageInfo.hasNextPage).to.eq(true)

            posts = posts.concat(res.edges)
            afterCursor = res.pageInfo.endCursor
          })
          .its("orderBy")
          .should("eq", "TOP")
      })

      cy.then(() => {
        cy.wrap(
          graphQLClient.request(getPostsTestDoc, {
            input: { paginate: { first: 15, after: afterCursor }, filters: { orderBy: PostOrderByType.Top } },
          })
        )
          .its("posts")
          .then((res) => {
            expect(res.edges.length).to.eq(8)
            expect(res.pageInfo.endCursor).to.eq(null)
            expect(res.pageInfo.hasNextPage).to.eq(false)

            posts = posts.concat(res.edges)
          })
          .its("orderBy")
          .should("eq", "TOP")
      })

      cy.then(() => {
        cy.wrap(nodeIdsUnique(posts)).should("eq", true)
        cy.wrap(hasDecreasingVoteSumOrdering(posts)).should("eq", true)
      })
    })
  })

  describe("Combining filters", function () {
    it("Check old ordering & community id", function () {
      cy.wrap(
        graphQLClient.request(getPostsTestDoc, {
          input: {
            paginate: { first: 5 },
            filters: { orderBy: PostOrderByType.Old, communityId: "351146cd-1612-4a44-94da-e33d27bedf39" },
          },
        })
      )
        .its("posts")
        .should((res) => expect(res.edges.length).eq(5))
        .should((res) => expect(hasOldOrdering(res.edges)).to.be.true)
        .should((res) => expect(hasSameCommunityId(res.edges, "351146cd-1612-4a44-94da-e33d27bedf39")).to.be.true)
    })

    it("Check decreasing vote count & user id", function () {
      cy.wrap(
        graphQLClient.request(getPostsTestDoc, {
          input: {
            paginate: { first: 5 },
            filters: { orderBy: PostOrderByType.Top, userId: "8d2efb36-a726-425c-ad12-98f2683c5d86" },
          },
        })
      )
        .its("posts")
        .should((res) => expect(res.edges.length).eq(5))
        .should((res) => expect(hasDecreasingVoteSumOrdering(res.edges)).to.be.true)
        .should((res) => expect(hasSameOwnerId(res.edges, "8d2efb36-a726-425c-ad12-98f2683c5d86")).to.be.true)
    })

    it("Check new ordering & community id & user id", function () {
      cy.wrap(
        graphQLClient.request(getPostsTestDoc, {
          input: {
            paginate: { first: 5 },
            filters: {
              orderBy: PostOrderByType.New,
              communityId: "351146cd-1612-4a44-94da-e33d27bedf39",
              userId: "8d2efb36-a726-425c-ad12-98f2683c5d86",
            },
          },
        })
      )
        .its("posts")
        .should((res) => expect(res.edges.length).eq(5))
        .should((res) => expect(hasNewOrdering(res.edges)).to.be.true)
        .should((res) => expect(hasSameOwnerId(res.edges, "8d2efb36-a726-425c-ad12-98f2683c5d86")).to.be.true)
        .should((res) => expect(hasSameCommunityId(res.edges, "351146cd-1612-4a44-94da-e33d27bedf39")).to.be.true)
    })
  })

  describe("Pagination input validation - Take", function () {
    beforeEach(function () {
      cy.on("fail", (error) => {
        if (error instanceof ClientError) {
          if (!error.response.errors || error.response.errors?.length == 0) throw new Error("No error returned")
          expect(error.response.errors[0].extensions.code).to.eq("PAGINATION_ERROR")
          expect(error.response.errors[0].message).to.eq("First must be between 0 and 100")
          return
        }

        throw new Error("Uncaught error (should not be reached)")
      })
    })

    it("Check error with negative amount", function () {
      cy.wrap(
        graphQLClient.request(getPostsTestDoc, {
          input: {
            paginate: { first: -2 },
            filters: { orderBy: PostOrderByType.New },
          },
        })
      )
    })

    it("Check error with amount over 100", function () {
      cy.wrap(
        graphQLClient.request(getPostsTestDoc, {
          input: {
            paginate: { first: 110 },
            filters: { orderBy: PostOrderByType.New },
          },
        })
      )
    })
  })

  describe("Pagination input validation - check error if no 'created at' supplied with a cursor & new/old ordering", function () {
    beforeEach(function () {
      cy.on("fail", (error) => {
        if (error instanceof ClientError) {
          if (!error.response.errors || error.response.errors?.length == 0) throw new Error("No error returned")
          expect(error.response.errors[0].extensions.code).to.eq("PAGINATION_ERROR")
          expect(error.response.errors[0].message).to.eq("Created at must be specified with cursor")
          return
        }

        throw new Error("Uncaught error (should not be reached)")
      })
    })

    it("Check new ordering", function () {
      cy.wrap(
        graphQLClient.request(getPostsTestDoc, {
          input: {
            filters: { orderBy: PostOrderByType.New },
            paginate: { first: 5, after: { id: "abc" } },
          },
        })
      )
    })

    it("Check old ordering", function () {
      cy.wrap(
        graphQLClient.request(getPostsTestDoc, {
          input: {
            filters: { orderBy: PostOrderByType.Old },
            paginate: { first: 5, after: { id: "abc" } },
          },
        })
      )
    })
  })

  describe("Pagination input validation - check error if no 'vote sum' supplied with a cursor & low/top ordering", function () {
    beforeEach(function () {
      cy.on("fail", (error) => {
        if (error instanceof ClientError) {
          if (!error.response.errors || error.response.errors?.length == 0) throw new Error("No error returned")
          expect(error.response.errors[0].extensions.code).to.eq("PAGINATION_ERROR")
          expect(error.response.errors[0].message).to.eq("Vote sum must be specified with cursor")
          return
        }

        throw new Error("Uncaught error (should not be reached)")
      })
    })

    it("Check low ordering", function () {
      cy.wrap(
        graphQLClient.request(getPostsTestDoc, {
          input: {
            filters: { orderBy: PostOrderByType.Low },
            paginate: { first: 5, after: { id: "abc" } },
          },
        })
      )
    })

    it("Check top ordering", function () {
      cy.wrap(
        graphQLClient.request(getPostsTestDoc, {
          input: {
            filters: { orderBy: PostOrderByType.Top },
            paginate: { first: 5, after: { id: "abc" } },
          },
        })
      )
    })
  })
})

describe("Create post endpoint", function () {
  it("Check not signed in error response", function () {
    cy.on("fail", (error) => {
      if (error instanceof ClientError) {
        if (!error.response.errors || error.response.errors?.length == 0) throw new Error("No error returned")
        expect(error.response.errors[0].extensions.code).to.eq("UNAUTHENTICATED")
        expect(error.response.errors[0].message).to.eq("Not signed in")
        return
      }

      throw new Error("Uncaught error (should not be reached)")
    })

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(createPostTestDoc, {
          input: { communityId: "351146cd-1612-4a44-94da-e33d27bedf39", title: "Post title", body: "Post body" },
        })
      )
    })

    cy.wait("@gqlCreatePostTestMutation").then(() => {
      throw new Error("No error returned")
    })
  })

  it("Check invalid input responses", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(createPostTestDoc, {
          input: { communityId: "abc", title: "", body: "A".repeat(21000) },
        })
      )
        .its("createPost")
        .should((res) => expect(res.code).to.eq(400))
        .should((res) => expect(res.errorMsg).to.eq("Invalid input"))
        .should((res) => expect(res.inputErrors.title).to.eq("Title must be between 1 and 200 characters long"))
        .should((res) => expect(res.inputErrors.body).to.eq("Body must be less than 20,000 characters long"))
        .should((res) => expect(res.inputErrors.communityId).to.eq("Invalid community ID"))
    })

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(createPostTestDoc, {
          input: { communityId: "351146cd-1612-4a44-94da-e33d27bedf39", title: "A".repeat(201) },
        })
      )
        .its("createPost")
        .should((res) => expect(res.code).to.eq(400))
        .should((res) => expect(res.errorMsg).to.eq("Invalid input"))
        .should((res) => expect(res.inputErrors.title).to.eq("Title must be between 1 and 200 characters long"))
        .should((res) => expect(res.inputErrors.body).to.eq(null))
        .should((res) => expect(res.inputErrors.communityId).to.eq(null))
    })
  })

  it("Check post successfully created", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(createPostTestDoc, {
          input: { communityId: "351146cd-1612-4a44-94da-e33d27bedf39", title: "Post title", body: "Post body" },
        })
      )
        .its("createPost")
        .then((res) => {
          expect(res.code).to.eq(200)
          expect(res.successMsg).to.eq("Successfully created post")

          cy.then(() => {
            cy.wrap(
              graphQLClient.request(getPostTestDoc, {
                input: {
                  id: res.post.id,
                },
              })
            )
              .its("post")
              .should((res) => expect(res.title).to.eq("Post title"))
              .should((res) => expect(res.body).to.eq("Post body"))
          })
        })
    })

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(createPostTestDoc, {
          input: { communityId: "351146cd-1612-4a44-94da-e33d27bedf39", title: "Post, no body" },
        })
      )
        .its("createPost")
        .then((res) => {
          expect(res.code).to.eq(200)
          expect(res.successMsg).to.eq("Successfully created post")

          cy.then(() => {
            cy.wrap(
              graphQLClient.request(getPostTestDoc, {
                input: {
                  id: res.post.id,
                },
              })
            )
              .its("post")
              .should((res) => expect(res.title).to.eq("Post, no body"))
              .should((res) => expect(res.body).to.eq(""))
          })
        })
    })
  })
})

describe("Post vote endpoint", function () {
  it("Check not signed in error response", function () {
    cy.on("fail", (error) => {
      if (error instanceof ClientError) {
        if (!error.response.errors || error.response.errors?.length == 0) throw new Error("No error returned")
        expect(error.response.errors[0].extensions.code).to.eq("UNAUTHENTICATED")
        expect(error.response.errors[0].message).to.eq("Not signed in")
        return
      }

      throw new Error("Uncaught error (should not be reached)")
    })

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(votePostTestDoc, {
          input: { postId: "abc", like: true },
        })
      )
    })

    cy.wait("@gqlVotePostTestMutation").then(() => {
      throw new Error("No error returned")
    })
  })

  it("Check post doesn't exist error response", function () {
    cy.on("fail", (error) => {
      if (error instanceof ClientError) {
        if (!error.response.errors || error.response.errors?.length == 0) throw new Error("No error returned")
        expect(error.response.errors[0].extensions.code).to.eq("BAD_USER_INPUT")
        expect(error.response.errors[0].message).to.eq("Post does not exist")
        return
      }

      throw new Error("Uncaught error (should not be reached)")
    })

    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(votePostTestDoc, {
          input: { postId: "abc", like: true },
        })
      )
    })

    cy.wait("@gqlVotePostTestMutation").then(() => {
      throw new Error("No error returned")
    })
  })

  it("Check post upvote then downvote", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(votePostTestDoc, {
          input: { postId: "cfccc3c0-21b5-47f8-ab16-08f3ad2400c3", like: true },
        })
      )
        .its("votePost")
        .then((res) => {
          expect(res.code).to.eq(200)
          expect(res.successMsg).to.eq("Successfully liked post")

          cy.then(() => {
            cy.wrap(graphQLClient.request(getPostTestDoc, { input: { id: "cfccc3c0-21b5-47f8-ab16-08f3ad2400c3" } }))
              .its("post")
              .should((res) => expect(res.voteSum).to.eq(1))
          })
        })
    })

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(votePostTestDoc, {
          input: { postId: "cfccc3c0-21b5-47f8-ab16-08f3ad2400c3", like: false },
        })
      )
        .its("votePost")
        .then((res) => {
          expect(res.code).to.eq(200)
          expect(res.successMsg).to.eq("Successfully disliked post")

          cy.then(() => {
            cy.wrap(graphQLClient.request(getPostTestDoc, { input: { id: "cfccc3c0-21b5-47f8-ab16-08f3ad2400c3" } }))
              .its("post")
              .should((res) => expect(res.voteSum).to.eq(-1))
          })
        })
    })
  })

  it("Check post downvote then upvote", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(votePostTestDoc, {
          input: { postId: "cfccc3c0-21b5-47f8-ab16-08f3ad2400c3", like: false },
        })
      )
        .its("votePost")
        .then((res) => {
          expect(res.code).to.eq(200)
          expect(res.successMsg).to.eq("Successfully disliked post")

          cy.then(() => {
            cy.wrap(graphQLClient.request(getPostTestDoc, { input: { id: "cfccc3c0-21b5-47f8-ab16-08f3ad2400c3" } }))
              .its("post")
              .should((res) => expect(res.voteSum).to.eq(-1))
          })
        })
    })

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(votePostTestDoc, {
          input: { postId: "cfccc3c0-21b5-47f8-ab16-08f3ad2400c3", like: true },
        })
      )
        .its("votePost")
        .then((res) => {
          expect(res.code).to.eq(200)
          expect(res.successMsg).to.eq("Successfully liked post")

          cy.then(() => {
            cy.wrap(graphQLClient.request(getPostTestDoc, { input: { id: "cfccc3c0-21b5-47f8-ab16-08f3ad2400c3" } }))
              .its("post")
              .should((res) => expect(res.voteSum).to.eq(1))
          })
        })
    })
  })

  it("Check post upvote then reversal", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(votePostTestDoc, {
          input: { postId: "cfccc3c0-21b5-47f8-ab16-08f3ad2400c3", like: true },
        })
      )
        .its("votePost")
        .then((res) => {
          expect(res.code).to.eq(200)
          expect(res.successMsg).to.eq("Successfully liked post")

          cy.then(() => {
            cy.wrap(graphQLClient.request(getPostTestDoc, { input: { id: "cfccc3c0-21b5-47f8-ab16-08f3ad2400c3" } }))
              .its("post")
              .should((res) => expect(res.voteSum).to.eq(1))
          })
        })
    })

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(votePostTestDoc, {
          input: { postId: "cfccc3c0-21b5-47f8-ab16-08f3ad2400c3", like: true },
        })
      )
        .its("votePost")
        .then((res) => {
          expect(res.code).to.eq(200)
          expect(res.successMsg).to.eq("Successfully unliked post")

          cy.then(() => {
            cy.wrap(graphQLClient.request(getPostTestDoc, { input: { id: "cfccc3c0-21b5-47f8-ab16-08f3ad2400c3" } }))
              .its("post")
              .should((res) => expect(res.voteSum).to.eq(0))
          })
        })
    })
  })

  it("Check post downvote then reversal", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(votePostTestDoc, {
          input: { postId: "cfccc3c0-21b5-47f8-ab16-08f3ad2400c3", like: false },
        })
      )
        .its("votePost")
        .then((res) => {
          expect(res.code).to.eq(200)
          expect(res.successMsg).to.eq("Successfully disliked post")

          cy.wrap(graphQLClient.request(getPostTestDoc, { input: { id: "cfccc3c0-21b5-47f8-ab16-08f3ad2400c3" } }))
            .its("post")
            .should((res) => expect(res.voteSum).to.eq(-1))
        })
    })

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(votePostTestDoc, {
          input: { postId: "cfccc3c0-21b5-47f8-ab16-08f3ad2400c3", like: false },
        })
      )
        .its("votePost")
        .then((res) => {
          expect(res.code).to.eq(200)
          expect(res.successMsg).to.eq("Successfully undisliked post")

          cy.then(() => {
            cy.wrap(graphQLClient.request(getPostTestDoc, { input: { id: "cfccc3c0-21b5-47f8-ab16-08f3ad2400c3" } }))
              .its("post")
              .should((res) => expect(res.voteSum).to.eq(0))
          })
        })
    })
  })
})

describe("Edit post endpoint", function () {
  it("Check not signed in error response", function () {
    cy.on("fail", (error) => {
      if (error instanceof ClientError) {
        if (!error.response.errors || error.response.errors?.length == 0) throw new Error("No error returned")
        expect(error.response.errors[0].extensions.code).to.eq("UNAUTHENTICATED")
        expect(error.response.errors[0].message).to.eq("Not signed in")
        return
      }

      throw new Error("Uncaught error (should not be reached)")
    })

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(editPostTestDoc, {
          input: { postId: "abc", title: "new title", body: "new body" },
        })
      )
    })

    cy.wait("@gqlEditPostTestMutation").then(() => {
      throw new Error("No error returned")
    })
  })

  it("Check post does not exist error response", function () {
    cy.on("fail", (error) => {
      if (error instanceof ClientError) {
        if (!error.response.errors || error.response.errors?.length == 0) throw new Error("No error returned")
        expect(error.response.errors[0].extensions.code).to.eq("BAD_USER_INPUT")
        expect(error.response.errors[0].message).to.eq("Post does not exist")
        return
      }

      throw new Error("Uncaught error (should not be reached)")
    })

    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(editPostTestDoc, {
          input: { postId: "abc", title: "new title", body: "new body" },
        })
      )
    })

    cy.wait("@gqlEditPostTestMutation").then(() => {
      throw new Error("No error returned")
    })
  })

  it("Check error if user who doesn't own post tries to edit it", function () {
    cy.on("fail", (error) => {
      if (error instanceof ClientError) {
        if (!error.response.errors || error.response.errors?.length == 0) throw new Error("No error returned")
        expect(error.response.errors[0].extensions.code).to.eq("UNAUTHORIZED")
        expect(error.response.errors[0].message).to.eq("Unauthorized")
        return
      }

      throw new Error("Uncaught error (should not be reached)")
    })

    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(editPostTestDoc, {
          input: { postId: "cfccc3c0-21b5-47f8-ab16-08f3ad2400c3", title: "new title", body: "new body" },
        })
      )
    })
  })

  it("Check invalid input responses", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(editPostTestDoc, {
          input: { postId: "7dc6c6fe-e2d3-4b60-9d26-4cd81c1b8dd2", title: "", body: "A".repeat(21000) },
        })
      )
        .its("editPost")
        .should((res) => expect(res.code).to.eq(400))
        .should((res) => expect(res.errorMsg).to.eq("Invalid input"))
        .should((res) => expect(res.inputErrors.title).to.eq("Title must be between 1 and 200 characters long"))
        .should((res) => expect(res.inputErrors.body).to.eq("Body must be less than 20,000 characters long"))
    })

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(editPostTestDoc, {
          input: { postId: "7dc6c6fe-e2d3-4b60-9d26-4cd81c1b8dd2", title: "A".repeat(210), body: "" },
        })
      )
        .its("editPost")
        .should((res) => expect(res.code).to.eq(400))
        .should((res) => expect(res.errorMsg).to.eq("Invalid input"))
        .should((res) => expect(res.inputErrors.title).to.eq("Title must be between 1 and 200 characters long"))
        .should((res) => expect(res.inputErrors.body).to.eq(null))
    })
  })

  it("Check successfully edits post", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(editPostTestDoc, {
          input: { postId: "7dc6c6fe-e2d3-4b60-9d26-4cd81c1b8dd2", title: "New post title", body: "New post body" },
        })
      )
        .its("editPost")
        .then((res) => {
          expect(res.code).to.eq(200)
          expect(res.successMsg).to.eq("Successfully edited post")

          cy.then(() => {
            cy.wrap(graphQLClient.request(getPostTestDoc, { input: { id: "7dc6c6fe-e2d3-4b60-9d26-4cd81c1b8dd2" } }))
              .its("post")
              .should((res) => expect(res.title).to.eq("New post title"))
              .should((res) => expect(res.body).to.eq("New post body"))
          })
        })
    })
  })
})

describe("Delete post endpoint", function () {
  it("Check not signed in error response", function () {
    cy.on("fail", (error) => {
      if (error instanceof ClientError) {
        if (!error.response.errors || error.response.errors?.length == 0) throw new Error("No error returned")
        expect(error.response.errors[0].extensions.code).to.eq("UNAUTHENTICATED")
        expect(error.response.errors[0].message).to.eq("Not signed in")
        return
      }

      throw new Error("Uncaught error (should not be reached)")
    })

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(deletePostTestDoc, {
          input: { postId: "7dc6c6fe-e2d3-4b60-9d26-4cd81c1b8dd2" },
        })
      )
    })

    cy.wait("@gqlDeletePostTestMutation").then(() => {
      throw new Error("No error returned")
    })
  })

  it("Check post does not exist error response", function () {
    cy.on("fail", (error) => {
      if (error instanceof ClientError) {
        if (!error.response.errors || error.response.errors?.length == 0) throw new Error("No error returned")
        expect(error.response.errors[0].extensions.code).to.eq("BAD_USER_INPUT")
        expect(error.response.errors[0].message).to.eq("Post does not exist")
        return
      }

      throw new Error("Uncaught error (should not be reached)")
    })

    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(deletePostTestDoc, {
          input: { postId: "abc" },
        })
      )
    })

    cy.wait("@gqlDeletePostTestMutation").then(() => {
      throw new Error("No error returned")
    })
  })

  it("Check error if user who doesn't own post tries to delete it", function () {
    cy.on("fail", (error) => {
      if (error instanceof ClientError) {
        if (!error.response.errors || error.response.errors?.length == 0) throw new Error("No error returned")
        expect(error.response.errors[0].extensions.code).to.eq("UNAUTHORIZED")
        expect(error.response.errors[0].message).to.eq("Unauthorized")
        return
      }

      throw new Error("Uncaught error (should not be reached)")
    })

    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(deletePostTestDoc, {
          input: { postId: "cfccc3c0-21b5-47f8-ab16-08f3ad2400c3" },
        })
      )
    })
  })

  it("Check successfully deletes post", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(deletePostTestDoc, {
          input: { postId: "f19afc1b-1a61-4f93-b2b5-ce87d499feee" },
        })
      )
        .its("deletePost")
        .then((res) => {
          expect(res.code).to.eq(200)
          expect(res.successMsg).to.eq("Successfully deleted post")

          cy.then(() => {
            cy.wrap(graphQLClient.request(getPostTestDoc, { input: { id: "f19afc1b-1a61-4f93-b2b5-ce87d499feee" } }))
              .its("post")
              .should("eq", null)
          })
        })
    })
  })
})
