import { CommentOrderByType, GetCommentsTestQuery, VoteStatus } from "../../../src/graphql_codegen/graphql"
import { graphQLClient } from "../../../src/utils/graphql"
import {
  createCommentReplyTestDoc,
  createCommentTestDoc,
  deleteCommentTestDoc,
  editCommentTestDoc,
  getCommentTestDoc,
  getCommentsTestDoc,
  voteCommentTestDoc,
} from "../../utils/graphqlDocs/commentGraphQL"
import { aliasMutation, aliasQuery } from "../../utils/graphqlTest"
import {
  cypressCheckOnFail,
  hasDecreasingVoteSumOrdering,
  hasIncreasingVoteSumOrdering,
  hasNewOrdering,
  hasOldOrdering,
  hasSameOwnerId,
  hasSameParentId,
  hasSamePostId,
  nodeIdsUnique,
} from "../../utils/utils"

beforeEach(function () {
  cy.exec("npm --prefix ../server run resetDb")
  cy.exec("npm --prefix ../server run seed")

  cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
    aliasQuery(req, "GetCommentsTest")

    aliasMutation(req, "CreateCommentTest")
    aliasMutation(req, "CreateCommentReplyTest")
    aliasMutation(req, "VoteCommentTest")
    aliasMutation(req, "EditCommentTest")
    aliasMutation(req, "DeleteCommentTest")
  })

  cy.visit("/")
})

describe("Comment endpoint", function () {
  it("Check correct comment and its information returned", function () {
    cy.wrap(graphQLClient.request(getCommentTestDoc, { input: { id: "36756cee-a0ce-40d3-a51d-686699e0b3a1" } }))
      .its("comment")
      .should((res) => expect(res.id).to.eq("36756cee-a0ce-40d3-a51d-686699e0b3a1"))
      .should((res) => expect(res.body).to.eq("Comment 3"))
      .should((res) => expect(res.created_at).to.eq("2023-11-30T11:23:12.876Z"))
      .should((res) => expect(res.updated_at).to.eq("2023-11-30T11:23:12.876Z"))
      .should((res) => expect(res.voteSum).to.eq(-1))
      .should((res) => expect(res.voteStatus).to.eq(VoteStatus.None))
      .should((res) => expect(res.replyCount).to.eq(15))
      .should((res) => expect(res.owner.id).to.eq("266c189f-5986-404a-9889-0a54c298acb2"))
      .should((res) => expect(res.post.id).to.eq("86677911-05d4-4e65-a6b6-3ebdaea58b93"))
      .should((res) => expect(res.parent).to.eq(null))
  })

  it("Check correct vote status returned", function () {
    cy.setCookie("test-user", "f734d0b4-20a1-4b7b-9d95-f5ad532582df")

    cy.then(() => {
      cy.wrap(graphQLClient.request(getCommentTestDoc, { input: { id: "36756cee-a0ce-40d3-a51d-686699e0b3a1" } }))
        .its("comment")
        .should((res) => expect(res.voteStatus).to.eq(VoteStatus.Dislike))
    })

    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(graphQLClient.request(getCommentTestDoc, { input: { id: "d2be5583-f646-4be0-ba2e-316e1012df45" } }))
        .its("comment")
        .should((res) => expect(res.voteStatus).to.eq(VoteStatus.Like))
    })
  })

  it("Check parent returned if a reply", function () {
    cy.wrap(graphQLClient.request(getCommentTestDoc, { input: { id: "232a2f08-0210-4140-a5de-7ac6625fd2d9" } }))
      .its("comment")
      .should((res) => expect(res.parent.id).to.eq("36756cee-a0ce-40d3-a51d-686699e0b3a1"))
  })
})

describe("Comments endpoint", function () {
  describe("Pagination + ordering", function () {
    it("Check pagination + post id + new ordering", function () {
      let comments: GetCommentsTestQuery["comments"]["edges"] = []
      let afterCursor: GetCommentsTestQuery["comments"]["pageInfo"]["endCursor"]

      cy.then(() => {
        cy.wrap(
          graphQLClient.request(getCommentsTestDoc, {
            input: {
              paginate: { first: 8 },
              filters: { postId: "351146cd-1612-4a44-94da-e33d27bedf39", orderBy: CommentOrderByType.New },
            },
          })
        )
          .its("comments")
          .then((res) => {
            expect(res.edges.length).to.eq(8)
            expect(res.pageInfo.endCursor.id).to.eq("a3b59fe6-76dd-4f93-8e93-a208e90c33ba")
            expect(res.pageInfo.endCursor.created_at).to.eq("2023-10-22T11:52:12.876Z")
            expect(res.pageInfo.endCursor.voteSum).to.eq(null)
            expect(res.pageInfo.hasNextPage).to.eq(true)

            comments = comments.concat(res.edges)
            afterCursor = res.pageInfo.endCursor
          })
          .its("orderBy")
          .should("eq", "NEW")
      })

      cy.then(() => {
        cy.wrap(
          graphQLClient.request(getCommentsTestDoc, {
            input: {
              paginate: { first: 15, after: afterCursor },
              filters: { postId: "351146cd-1612-4a44-94da-e33d27bedf39", orderBy: CommentOrderByType.New },
            },
          })
        )
          .its("comments")
          .then((res) => {
            expect(res.edges.length).to.eq(7)
            expect(res.pageInfo.endCursor).to.eq(null)
            expect(res.pageInfo.hasNextPage).to.eq(false)

            comments = comments.concat(res.edges)
          })
          .its("orderBy")
          .should("eq", "NEW")
      })

      cy.then(() => {
        cy.wrap(nodeIdsUnique(comments)).should("eq", true)
        cy.wrap(hasNewOrdering(comments)).should("eq", true)
      })
    })

    it("Check pagination + post id + old ordering", function () {
      let comments: GetCommentsTestQuery["comments"]["edges"] = []
      let afterCursor: GetCommentsTestQuery["comments"]["pageInfo"]["endCursor"]

      cy.then(() => {
        cy.wrap(
          graphQLClient.request(getCommentsTestDoc, {
            input: {
              paginate: { first: 5 },
              filters: { postId: "351146cd-1612-4a44-94da-e33d27bedf39", orderBy: CommentOrderByType.Old },
            },
          })
        )
          .its("comments")
          .then((res) => {
            expect(res.edges.length).to.eq(5)
            expect(res.pageInfo.endCursor.id).to.eq("913f5032-955f-4a7a-98e5-864ec81aface")
            expect(res.pageInfo.endCursor.created_at).to.eq("2023-10-19T11:52:12.876Z")
            expect(res.pageInfo.endCursor.voteSum).to.eq(null)
            expect(res.pageInfo.hasNextPage).to.eq(true)

            comments = comments.concat(res.edges)
            afterCursor = res.pageInfo.endCursor
          })
          .its("orderBy")
          .should("eq", "OLD")
      })

      cy.then(() => {
        cy.wrap(
          graphQLClient.request(getCommentsTestDoc, {
            input: {
              paginate: { first: 15, after: afterCursor },
              filters: { postId: "351146cd-1612-4a44-94da-e33d27bedf39", orderBy: CommentOrderByType.Old },
            },
          })
        )
          .its("comments")
          .then((res) => {
            expect(res.edges.length).to.eq(10)
            expect(res.pageInfo.endCursor).to.eq(null)
            expect(res.pageInfo.hasNextPage).to.eq(false)

            comments = comments.concat(res.edges)
          })
          .its("orderBy")
          .should("eq", "OLD")
      })

      cy.then(() => {
        cy.wrap(nodeIdsUnique(comments)).should("eq", true)
        cy.wrap(hasOldOrdering(comments)).should("eq", true)
      })
    })

    it("Check pagination + post id + increasing vote count ordering", function () {
      let comments: GetCommentsTestQuery["comments"]["edges"] = []
      let afterCursor: GetCommentsTestQuery["comments"]["pageInfo"]["endCursor"]

      cy.then(() => {
        cy.wrap(
          graphQLClient.request(getCommentsTestDoc, {
            input: {
              paginate: { first: 13 },
              filters: { postId: "351146cd-1612-4a44-94da-e33d27bedf39", orderBy: CommentOrderByType.Low },
            },
          })
        )
          .its("comments")
          .then((res) => {
            expect(res.edges.length).to.eq(13)
            expect(res.pageInfo.endCursor.id).to.eq("33956688-f725-4a60-9405-dcebcd8efeb6")
            expect(res.pageInfo.endCursor.created_at).to.eq("2023-10-25T11:52:12.876Z")
            expect(res.pageInfo.endCursor.voteSum).to.eq(1)
            expect(res.pageInfo.hasNextPage).to.eq(true)

            comments = comments.concat(res.edges)
            afterCursor = res.pageInfo.endCursor
          })
          .its("orderBy")
          .should("eq", "LOW")
      })

      cy.then(() => {
        cy.wrap(
          graphQLClient.request(getCommentsTestDoc, {
            input: {
              paginate: { first: 15, after: afterCursor },
              filters: {
                postId: "351146cd-1612-4a44-94da-e33d27bedf39",
                orderBy: CommentOrderByType.Low,
              },
            },
          })
        )
          .its("comments")
          .then((res) => {
            expect(res.edges.length).to.eq(2)
            expect(res.pageInfo.endCursor).to.eq(null)
            expect(res.pageInfo.hasNextPage).to.eq(false)

            comments = comments.concat(res.edges)
          })
          .its("orderBy")
          .should("eq", "LOW")
      })

      cy.then(() => {
        cy.wrap(nodeIdsUnique(comments)).should("eq", true)
        cy.wrap(hasIncreasingVoteSumOrdering(comments)).should("eq", true)
      })
    })

    it("Check pagination + post id + decreasing vote count ordering", function () {
      let comments: GetCommentsTestQuery["comments"]["edges"] = []
      let afterCursor: GetCommentsTestQuery["comments"]["pageInfo"]["endCursor"]

      cy.then(() => {
        cy.wrap(
          graphQLClient.request(getCommentsTestDoc, {
            input: {
              paginate: { first: 14 },
              filters: { postId: "351146cd-1612-4a44-94da-e33d27bedf39", orderBy: CommentOrderByType.Top },
            },
          })
        )
          .its("comments")
          .then((res) => {
            expect(res.edges.length).to.eq(14)
            expect(res.pageInfo.endCursor.id).to.eq("22aaa5a0-2d9d-4f63-9ccd-820fd57c63cf")
            expect(res.pageInfo.endCursor.created_at).to.eq("2023-10-29T11:52:12.876Z")
            expect(res.pageInfo.endCursor.voteSum).to.eq(-2)
            expect(res.pageInfo.hasNextPage).to.eq(true)

            comments = comments.concat(res.edges)
            afterCursor = res.pageInfo.endCursor
          })
          .its("orderBy")
          .should("eq", "TOP")
      })

      cy.then(() => {
        cy.wrap(
          graphQLClient.request(getCommentsTestDoc, {
            input: {
              paginate: { first: 15, after: afterCursor },
              filters: { postId: "351146cd-1612-4a44-94da-e33d27bedf39", orderBy: CommentOrderByType.Top },
            },
          })
        )
          .its("comments")
          .then((res) => {
            expect(res.edges.length).to.eq(1)
            expect(res.pageInfo.endCursor).to.eq(null)
            expect(res.pageInfo.hasNextPage).to.eq(false)

            comments = comments.concat(res.edges)
          })
          .its("orderBy")
          .should("eq", "TOP")
      })

      cy.then(() => {
        cy.wrap(nodeIdsUnique(comments)).should("eq", true)
        cy.wrap(hasDecreasingVoteSumOrdering(comments)).should("eq", true)
      })
    })
  })

  describe("Filters", function () {
    it("Check parent id filter + old ordering", function () {
      let comments: GetCommentsTestQuery["comments"]["edges"] = []

      cy.then(() => {
        cy.wrap(
          graphQLClient.request(getCommentsTestDoc, {
            input: {
              paginate: { first: 20 },
              filters: {
                orderBy: CommentOrderByType.Old,
                parentId: "5fe3150d-f477-4610-8edb-8ff750090214",
              },
            },
          })
        )
          .its("comments")
          .then((res) => {
            expect(res.edges.length).to.eq(14)
            expect(res.pageInfo.endCursor).to.eq(null)
            expect(res.pageInfo.hasNextPage).to.eq(false)

            comments = comments.concat(res.edges)
          })
      })

      cy.then(() => {
        expect(nodeIdsUnique(comments)).to.be.true
        expect(hasOldOrdering(comments)).to.be.true
        expect(hasSameParentId(comments, "5fe3150d-f477-4610-8edb-8ff750090214")).to.be.true
      })
    })

    it("Check user id filter + increasing vote count ordering", function () {
      let comments: GetCommentsTestQuery["comments"]["edges"] = []

      cy.then(() => {
        cy.wrap(
          graphQLClient.request(getCommentsTestDoc, {
            input: {
              paginate: { first: 20 },
              filters: {
                orderBy: CommentOrderByType.Low,
                userId: "8d2efb36-a726-425c-ad12-98f2683c5d86",
              },
            },
          })
        )
          .its("comments")
          .then((res) => {
            expect(res.edges.length).to.eq(16)
            expect(res.pageInfo.endCursor).to.eq(null)
            expect(res.pageInfo.hasNextPage).to.eq(false)

            comments = comments.concat(res.edges)
          })
      })

      cy.then(() => {
        expect(nodeIdsUnique(comments)).to.be.true
        expect(hasIncreasingVoteSumOrdering(comments)).to.be.true
        expect(hasSameOwnerId(comments, "8d2efb36-a726-425c-ad12-98f2683c5d86")).to.be.true
      })
    })

    it("Check replies filter + decreasing vote count ordering", function () {
      let comments: GetCommentsTestQuery["comments"]["edges"] = []

      cy.then(() => {
        cy.wrap(
          graphQLClient.request(getCommentsTestDoc, {
            input: {
              paginate: { first: 30 },
              filters: {
                orderBy: CommentOrderByType.Top,
                replies: true,
              },
            },
          })
        )
          .its("comments")
          .then((res) => {
            expect(res.edges.length).to.eq(30)
            expect(res.pageInfo.endCursor).to.eq(null)
            expect(res.pageInfo.hasNextPage).to.eq(false)

            comments = comments.concat(res.edges)
          })
      })

      cy.then(() => {
        expect(nodeIdsUnique(comments)).to.be.true
        expect(hasDecreasingVoteSumOrdering(comments)).to.be.true
        expect(comments.every((e) => e.node.parent != null)).to.be.true
      })
    })
  })

  describe("Combining filters", function () {
    it("Check user id & replies filters + new ordering", function () {
      let comments: GetCommentsTestQuery["comments"]["edges"] = []

      cy.then(() => {
        cy.wrap(
          graphQLClient.request(getCommentsTestDoc, {
            input: {
              paginate: { first: 30 },
              filters: {
                orderBy: CommentOrderByType.New,
                userId: "266c189f-5986-404a-9889-0a54c298acb2",
                replies: true,
              },
            },
          })
        )
          .its("comments")
          .then((res) => {
            expect(res.edges.length).to.eq(15)
            expect(res.pageInfo.endCursor).to.eq(null)
            expect(res.pageInfo.hasNextPage).to.eq(false)

            comments = comments.concat(res.edges)
          })
      })

      cy.then(() => {
        expect(nodeIdsUnique(comments)).to.be.true
        expect(hasNewOrdering(comments)).to.be.true
        expect(hasSameOwnerId(comments, "266c189f-5986-404a-9889-0a54c298acb2"))
      })
    })

    it("Check post id & replies filters + old ordering", function () {
      let comments: GetCommentsTestQuery["comments"]["edges"] = []

      cy.then(() => {
        cy.wrap(
          graphQLClient.request(getCommentsTestDoc, {
            input: {
              paginate: { first: 30 },
              filters: {
                orderBy: CommentOrderByType.Old,
                postId: "86677911-05d4-4e65-a6b6-3ebdaea58b93",
                replies: true,
              },
            },
          })
        )
          .its("comments")
          .then((res) => {
            expect(res.edges.length).to.eq(15)
            expect(res.pageInfo.endCursor).to.eq(null)
            expect(res.pageInfo.hasNextPage).to.eq(false)

            comments = comments.concat(res.edges)
          })
      })

      cy.then(() => {
        expect(nodeIdsUnique(comments)).to.be.true
        expect(hasOldOrdering(comments)).to.be.true
        expect(hasSamePostId(comments, "86677911-05d4-4e65-a6b6-3ebdaea58b93")).to.be.true
        expect(comments.every((e) => e.node.parent != null)).to.be.true
      })
    })
  })

  describe("Pagination input validation - Take", function () {
    beforeEach(function () {
      cypressCheckOnFail("PAGINATION_ERROR", "First must be between 0 and 100")
    })

    it("Check error with negative amount", function () {
      cy.then(() => {
        cy.wrap(
          graphQLClient.request(getCommentsTestDoc, {
            input: {
              paginate: { first: -5 },
              filters: { orderBy: CommentOrderByType.New },
            },
          })
        )
      })

      cy.wait("@gqlGetCommentsTestQuery").then(() => {
        throw new Error("No error returned")
      })
    })

    it("Check error with amount over 100", function () {
      cy.then(() => {
        cy.wrap(
          graphQLClient.request(getCommentsTestDoc, {
            input: {
              paginate: { first: 110 },
              filters: { orderBy: CommentOrderByType.New },
            },
          })
        )
      })

      cy.wait("@gqlGetCommentsTestQuery").then(() => {
        throw new Error("No error returned")
      })
    })
  })

  describe("Pagination input validation - check error if no 'created at' supplied with a cursor & new/old ordering", function () {
    beforeEach(function () {
      cypressCheckOnFail("PAGINATION_ERROR", "Created at must be specified with cursor")
    })

    it("Check new ordering", function () {
      cy.then(() => {
        cy.wrap(
          graphQLClient.request(getCommentsTestDoc, {
            input: {
              filters: { orderBy: CommentOrderByType.New },
              paginate: { first: 5, after: { id: "abc" } },
            },
          })
        )
      })

      cy.wait("@gqlGetPostsTestQuery").then(() => {
        throw new Error("No error returned")
      })
    })

    it("Check old ordering", function () {
      cy.then(() => {
        cy.wrap(
          graphQLClient.request(getCommentsTestDoc, {
            input: {
              filters: { orderBy: CommentOrderByType.Old },
              paginate: { first: 5, after: { id: "abc" } },
            },
          })
        )
      })

      cy.wait("@gqlGetPostsTestQuery").then(() => {
        throw new Error("No error returned")
      })
    })
  })

  describe("Pagination input validation - check error if no 'vote sum' supplied with a cursor & low/top ordering", function () {
    beforeEach(function () {
      cypressCheckOnFail("PAGINATION_ERROR", "Vote sum must be specified with cursor")
    })

    it("Check low ordering", function () {
      cy.then(() => {
        cy.wrap(
          graphQLClient.request(getCommentsTestDoc, {
            input: {
              filters: { orderBy: CommentOrderByType.Low },
              paginate: { first: 5, after: { id: "abc" } },
            },
          })
        )
      })

      cy.wait("@gqlGetPostsTestQuery").then(() => {
        throw new Error("No error returned")
      })
    })

    it("Check top ordering", function () {
      cy.then(() => {
        cy.wrap(
          graphQLClient.request(getCommentsTestDoc, {
            input: {
              filters: { orderBy: CommentOrderByType.Top },
              paginate: { first: 5, after: { id: "abc" } },
            },
          })
        )
      })

      cy.wait("@gqlGetPostsTestQuery").then(() => {
        throw new Error("No error returned")
      })
    })
  })
})

describe("Create comment endpoint", function () {
  it("Check not signed in error response", function () {
    cypressCheckOnFail("UNAUTHENTICATED", "Not signed in")

    cy.then(() => {
      cy.wrap(graphQLClient.request(createCommentTestDoc, { input: { postId: "abc", body: "abc" } }))
    })

    cy.wait("@gqlCreateCommentTestQuery").then(() => {
      throw new Error("No error returned")
    })
  })

  it("Check post does not exist error response", function () {
    cypressCheckOnFail("BAD_USER_INPUT", "Post does not exist")

    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(graphQLClient.request(createCommentTestDoc, { input: { postId: "abc", body: "abc" } }))
    })

    cy.wait("@gqlCreateCommentTestQuery").then(() => {
      throw new Error("No error returned")
    })
  })

  it("Check invalid input responses", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(createCommentTestDoc, {
          input: { postId: "351146cd-1612-4a44-94da-e33d27bedf39", body: "A".repeat(2100) },
        })
      )
        .its("createComment")
        .should((res) => expect(res.code).to.eq(400))
        .should((res) => expect(res.errorMsg).to.eq("Invalid input"))
        .should((res) => expect(res.inputErrors.body).to.eq("Body must be 1-2000 characters long"))
    })

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(createCommentTestDoc, {
          input: { postId: "351146cd-1612-4a44-94da-e33d27bedf39", body: "  " },
        })
      )
        .its("createComment")
        .should((res) => expect(res.code).to.eq(400))
        .should((res) => expect(res.errorMsg).to.eq("Invalid input"))
        .should((res) => expect(res.inputErrors.body).to.eq("Body must be 1-2000 characters long"))
    })
  })

  it("Check successfully creates comment", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(createCommentTestDoc, {
          input: { postId: "351146cd-1612-4a44-94da-e33d27bedf39", body: "new comment" },
        })
      )
        .its("createComment")
        .then((res) => {
          expect(res.code).to.eq(200)
          expect(res.successMsg).to.eq("Successfully created comment")

          cy.then(() => {
            cy.wrap(
              graphQLClient.request(getCommentTestDoc, {
                input: { id: res.comment.id },
              })
            )
              .its("comment")
              .should((res) => expect(res.post.id).to.eq("351146cd-1612-4a44-94da-e33d27bedf39"))
              .should((res) => expect(res.body).to.eq("new comment"))
              .should((res) => expect(res.owner.id).to.eq("8d2efb36-a726-425c-ad12-98f2683c5d86"))
          })
        })
    })
  })
})

describe("Create comment reply endpoint", function () {
  it("Check not signed in error response", function () {
    cypressCheckOnFail("UNAUTHENTICATED", "Not signed in")

    cy.then(() => {
      cy.wrap(graphQLClient.request(createCommentReplyTestDoc, { input: { commentId: "abc", body: "abc" } }))
    })

    cy.wait("@gqlCreateCommentReplyTestQuery").then(() => {
      throw new Error("No error returned")
    })
  })

  it("Check parent comment does not exist error response", function () {
    cypressCheckOnFail("BAD_USER_INPUT", "Parent comment does not exist")

    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(graphQLClient.request(createCommentReplyTestDoc, { input: { commentId: "abc", body: "abc" } }))
    })

    cy.wait("@gqlCreateCommentReplyTestQuery").then(() => {
      throw new Error("No error returned")
    })
  })

  it("Check invalid input responses", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(createCommentReplyTestDoc, {
          input: { commentId: "402ad7e0-bfab-4fea-acd2-26e40c0846da", body: "  " },
        })
      )
        .its("createCommentReply")
        .should((res) => expect(res.code).to.eq(400))
        .should((res) => expect(res.errorMsg).to.eq("Invalid input"))
        .should((res) => expect(res.inputErrors.body).to.eq("Body must be 1-2000 characters long"))
        .should((res) => expect(res.inputErrors.commentId).to.eq("Invalid comment ID"))
    })

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(createCommentReplyTestDoc, {
          input: { commentId: "d2be5583-f646-4be0-ba2e-316e1012df45", body: "A".repeat(2100) },
        })
      )
        .its("createCommentReply")
        .should((res) => expect(res.code).to.eq(400))
        .should((res) => expect(res.errorMsg).to.eq("Invalid input"))
        .should((res) => expect(res.inputErrors.body).to.eq("Body must be 1-2000 characters long"))
        .should((res) => expect(res.inputErrors.commentId).to.eq(null))
    })
  })

  it("Check successfully create reply", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(createCommentReplyTestDoc, {
          input: { commentId: "d2be5583-f646-4be0-ba2e-316e1012df45", body: "new comment" },
        })
      )
        .its("createCommentReply")
        .then((res) => {
          expect(res.code).to.eq(200)
          expect(res.successMsg).to.eq("Successfully replied")

          cy.then(() => {
            cy.wrap(
              graphQLClient.request(getCommentTestDoc, {
                input: { id: res.comment.id },
              })
            )
              .its("comment")
              .should((res) => expect(res.parent.id).to.eq("d2be5583-f646-4be0-ba2e-316e1012df45"))
              .should((res) => expect(res.body).to.eq("new comment"))
              .should((res) => expect(res.post.id).to.eq("351146cd-1612-4a44-94da-e33d27bedf39"))
              .should((res) => expect(res.owner.id).to.eq("8d2efb36-a726-425c-ad12-98f2683c5d86"))
          })
        })
    })
  })
})

describe("Comment vote endpoint", function () {
  it("Check not signed in error response", function () {
    cypressCheckOnFail("UNAUTHENTICATED", "Not signed in")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(voteCommentTestDoc, {
          input: { commentId: "abc", like: true },
        })
      )
    })

    cy.wait("@gqlVoteCommentTestMutation").then(() => {
      throw new Error("No error returned")
    })
  })

  it("Check comment doesn't exist error response", function () {
    cypressCheckOnFail("BAD_USER_INPUT", "Comment does not exist")

    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(voteCommentTestDoc, {
          input: { commentId: "abc", like: true },
        })
      )
    })

    cy.wait("@gqlVoteCommentTestMutation").then(() => {
      throw new Error("No error returned")
    })
  })

  it("Check comment upvote then downvote", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(voteCommentTestDoc, {
          input: { commentId: "cb7250c3-e572-4dc7-9063-5c064b5a5ddb", like: true },
        })
      )
        .its("voteComment")
        .then((res) => {
          expect(res.code).to.eq(200)
          expect(res.successMsg).to.eq("Successfully liked comment")

          cy.then(() => {
            cy.wrap(graphQLClient.request(getCommentTestDoc, { input: { id: "cb7250c3-e572-4dc7-9063-5c064b5a5ddb" } }))
              .its("comment")
              .should((res) => expect(res.voteSum).to.eq(1))
          })
        })
    })

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(voteCommentTestDoc, {
          input: { commentId: "cb7250c3-e572-4dc7-9063-5c064b5a5ddb", like: false },
        })
      )
        .its("voteComment")
        .then((res) => {
          expect(res.code).to.eq(200)
          expect(res.successMsg).to.eq("Successfully disliked comment")

          cy.then(() => {
            cy.wrap(graphQLClient.request(getCommentTestDoc, { input: { id: "cb7250c3-e572-4dc7-9063-5c064b5a5ddb" } }))
              .its("comment")
              .should((res) => expect(res.voteSum).to.eq(-1))
          })
        })
    })
  })

  it("Check comment downvote then upvote", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(voteCommentTestDoc, {
          input: { commentId: "cb7250c3-e572-4dc7-9063-5c064b5a5ddb", like: false },
        })
      )
        .its("voteComment")
        .then((res) => {
          expect(res.code).to.eq(200)
          expect(res.successMsg).to.eq("Successfully disliked comment")

          cy.then(() => {
            cy.wrap(graphQLClient.request(getCommentTestDoc, { input: { id: "cb7250c3-e572-4dc7-9063-5c064b5a5ddb" } }))
              .its("comment")
              .should((res) => expect(res.voteSum).to.eq(-1))
          })
        })
    })

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(voteCommentTestDoc, {
          input: { commentId: "cb7250c3-e572-4dc7-9063-5c064b5a5ddb", like: true },
        })
      )
        .its("voteComment")
        .then((res) => {
          expect(res.code).to.eq(200)
          expect(res.successMsg).to.eq("Successfully liked comment")

          cy.then(() => {
            cy.wrap(graphQLClient.request(getCommentTestDoc, { input: { id: "cb7250c3-e572-4dc7-9063-5c064b5a5ddb" } }))
              .its("comment")
              .should((res) => expect(res.voteSum).to.eq(1))
          })
        })
    })
  })

  it("Check comment upvote then reversal", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(voteCommentTestDoc, {
          input: { commentId: "cb7250c3-e572-4dc7-9063-5c064b5a5ddb", like: true },
        })
      )
        .its("voteComment")
        .then((res) => {
          expect(res.code).to.eq(200)
          expect(res.successMsg).to.eq("Successfully liked comment")

          cy.then(() => {
            cy.wrap(graphQLClient.request(getCommentTestDoc, { input: { id: "cb7250c3-e572-4dc7-9063-5c064b5a5ddb" } }))
              .its("comment")
              .should((res) => expect(res.voteSum).to.eq(1))
          })
        })
    })

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(voteCommentTestDoc, {
          input: { commentId: "cb7250c3-e572-4dc7-9063-5c064b5a5ddb", like: true },
        })
      )
        .its("voteComment")
        .then((res) => {
          expect(res.code).to.eq(200)
          expect(res.successMsg).to.eq("Successfully unliked comment")

          cy.then(() => {
            cy.wrap(graphQLClient.request(getCommentTestDoc, { input: { id: "cb7250c3-e572-4dc7-9063-5c064b5a5ddb" } }))
              .its("comment")
              .should((res) => expect(res.voteSum).to.eq(0))
          })
        })
    })
  })

  it("Check comment downvote then reversal", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(voteCommentTestDoc, {
          input: { commentId: "cb7250c3-e572-4dc7-9063-5c064b5a5ddb", like: false },
        })
      )
        .its("voteComment")
        .then((res) => {
          expect(res.code).to.eq(200)
          expect(res.successMsg).to.eq("Successfully disliked comment")

          cy.then(() => {
            cy.wrap(graphQLClient.request(getCommentTestDoc, { input: { id: "cb7250c3-e572-4dc7-9063-5c064b5a5ddb" } }))
              .its("comment")
              .should((res) => expect(res.voteSum).to.eq(-1))
          })
        })
    })

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(voteCommentTestDoc, {
          input: { commentId: "cb7250c3-e572-4dc7-9063-5c064b5a5ddb", like: false },
        })
      )
        .its("voteComment")
        .then((res) => {
          expect(res.code).to.eq(200)
          expect(res.successMsg).to.eq("Successfully undisliked comment")

          cy.then(() => {
            cy.wrap(graphQLClient.request(getCommentTestDoc, { input: { id: "cb7250c3-e572-4dc7-9063-5c064b5a5ddb" } }))
              .its("comment")
              .should((res) => expect(res.voteSum).to.eq(0))
          })
        })
    })
  })
})

describe("Edit comment endpoint", function () {
  it("Check not signed in error response", function () {
    cypressCheckOnFail("UNAUTHENTICATED", "Not signed in")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(editCommentTestDoc, {
          input: { commentId: "abc", body: "abc" },
        })
      )
    })

    cy.wait("@gqlEditCommentTestMutation").then(() => {
      throw new Error("No error returned")
    })
  })

  it("Check comment does not exist error response", function () {
    cypressCheckOnFail("BAD_USER_INPUT", "Comment does not exist")

    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(editCommentTestDoc, {
          input: { commentId: "abc", body: "abc" },
        })
      )
    })

    cy.wait("@gqlEditCommentTestMutation").then(() => {
      throw new Error("No error returned")
    })
  })

  it("Check user trying to edit not owned comment error response", function () {
    cypressCheckOnFail("UNAUTHORIZED", "Unauthorized")

    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(editCommentTestDoc, {
          input: { commentId: "cb7250c3-e572-4dc7-9063-5c064b5a5ddb", body: "abc" },
        })
      )
    })

    cy.wait("@gqlEditCommentTestMutation").then(() => {
      throw new Error("No error returned")
    })
  })

  it("Check invalid input responses", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(editCommentTestDoc, {
          input: { commentId: "c7e98b97-6752-4774-93c1-04edd4a4a62b", body: "  " },
        })
      )
    })
      .its("editComment")
      .should((res) => expect(res.code).to.eq(400))
      .should((res) => expect(res.errorMsg).to.eq("Invalid input"))
      .should((res) => expect(res.inputErrors.body).to.eq("Body must be 1-2000 characters long"))

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(editCommentTestDoc, {
          input: { commentId: "c7e98b97-6752-4774-93c1-04edd4a4a62b", body: "A".repeat(2100) },
        })
      )
    })
      .its("editComment")
      .should((res) => expect(res.code).to.eq(400))
      .should((res) => expect(res.errorMsg).to.eq("Invalid input"))
      .should((res) => expect(res.inputErrors.body).to.eq("Body must be 1-2000 characters long"))
  })

  it("Check successfully edits comment", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(editCommentTestDoc, {
          input: { commentId: "c7e98b97-6752-4774-93c1-04edd4a4a62b", body: "new comment" },
        })
      )
    })
      .its("editComment")
      .then((res) => {
        expect(res.code).to.eq(200)
        expect(res.successMsg).to.eq("Successfully edited comment")

        cy.then(() => {
          cy.wrap(
            graphQLClient.request(getCommentTestDoc, {
              input: { id: res.comment.id },
            })
          )
            .its("comment")
            .should((res) => expect(res.body).to.eq("new comment"))
        })
      })
  })
})

describe("Delete comment endpoint", function () {
  it("Check not signed in error response", function () {
    cypressCheckOnFail("UNAUTHENTICATED", "Not signed in")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(deleteCommentTestDoc, {
          input: { commentId: "abc" },
        })
      )
    })

    cy.wait("@gqlDeleteCommentTestMutation").then(() => {
      throw new Error("No error returned")
    })
  })

  it("Check comment does not exist error response", function () {
    cypressCheckOnFail("BAD_USER_INPUT", "Comment does not exist")

    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(deleteCommentTestDoc, {
          input: { commentId: "abc" },
        })
      )
    })

    cy.wait("@gqlDeleteCommentTestMutation").then(() => {
      throw new Error("No error returned")
    })
  })

  it("Check user trying to delete not owned comment error response", function () {
    cypressCheckOnFail("UNAUTHORIZED", "Unauthorized")

    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(deleteCommentTestDoc, {
          input: { commentId: "cb7250c3-e572-4dc7-9063-5c064b5a5ddb" },
        })
      )
    })

    cy.wait("@gqlDeleteCommentTestMutation").then(() => {
      throw new Error("No error returned")
    })
  })

  it("Check successfully deletes comment", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(deleteCommentTestDoc, {
          input: { commentId: "fbf8adcc-f120-4b89-89dd-4effc7a2c54e" },
        })
      )
        .its("deleteComment")
        .should((res) => expect(res.code).to.eq(200))
        .should((res) => expect(res.successMsg).to.eq("Successfully deleted comment"))
    })

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(getCommentTestDoc, {
          input: { id: "fbf8adcc-f120-4b89-89dd-4effc7a2c54e" },
        })
      )
        .its("comment")
        .should("eq", null)
    })
  })
})
