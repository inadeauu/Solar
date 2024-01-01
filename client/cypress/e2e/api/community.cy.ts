import { GetCommunitiesTestQuery } from "../../../src/graphql_codegen/graphql"
import { graphQLClient } from "../../../src/utils/graphql"
import {
  changeCommunityTitleTestDoc,
  communityTitleExistsTestDoc,
  createCommunityTestDoc,
  deleteCommunityTestDoc,
  getCommunitiesTestDoc,
  getCommunityTestDoc,
  joinCommunityTestDoc,
} from "../../utils/graphqlDocs/communityGraphQL"
import {
  allTitlesContain,
  cypressCheckOnFail,
  hasSameOwnerId,
  inAllCommunities,
  nodeIdsUnique,
  titlesInAlphabeticalOrder,
} from "../../utils/utils"
import { aliasMutation, aliasQuery } from "../../utils/graphqlTest"

beforeEach(function () {
  cy.exec("npm --prefix ../server run resetDb")
  cy.exec("npm --prefix ../server run seed")

  cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
    aliasQuery(req, "GetCommunitiesTest")

    aliasMutation(req, "CreateCommunityTest")
    aliasMutation(req, "JoinCommunityTest")
    aliasMutation(req, "ChangeCommunityTitleTest")
    aliasMutation(req, "DeleteCommunityTest")
  })

  cy.visit("/")
})

describe("Community endpoint", function () {
  it("Check correct community and its information returned", function () {
    cy.wrap(graphQLClient.request(getCommunityTestDoc, { input: { id: "41094cb6-470d-4409-85b4-484fd43dd41d" } }))
      .its("community")
      .should((res) => expect(res.id).to.eq("41094cb6-470d-4409-85b4-484fd43dd41d"))
      .should((res) => expect(res.title).to.eq("Community2"))
      .should((res) => expect(res.created_at).to.eq("2023-06-27T09:52:32.876Z"))
      .should((res) => expect(res.memberCount).to.eq(2))
      .should((res) => expect(res.postCount).to.eq(8))
      .should((res) => expect(res.inCommunity).to.eq(false))
      .should((res) => expect(res.owner.id).to.eq("266c189f-5986-404a-9889-0a54c298acb2"))
  })

  it("Check correct 'in community' value returned", function () {
    cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")

    cy.then(() => {
      cy.wrap(graphQLClient.request(getCommunityTestDoc, { input: { id: "41094cb6-470d-4409-85b4-484fd43dd41d" } }))
        .its("community")
        .should((res) => expect(res.inCommunity).to.eq(false))
    })

    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(graphQLClient.request(getCommunityTestDoc, { input: { id: "41094cb6-470d-4409-85b4-484fd43dd41d" } }))
        .its("community")
        .should((res) => expect(res.inCommunity).to.eq(true))
    })
  })
})

describe("Communities endpoint", function () {
  it("Check pagination + title contains", function () {
    let communities: GetCommunitiesTestQuery["communities"]["edges"] = []
    let afterCursor: GetCommunitiesTestQuery["communities"]["pageInfo"]["endCursor"]

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(getCommunitiesTestDoc, {
          input: { paginate: { first: 7 }, filters: { titleContains: "test" } },
        })
      )
        .its("communities")
        .then((res) => {
          expect(res.edges.length).to.eq(7)
          expect(res.pageInfo.endCursor.id).to.eq("ed922a7f-40ae-4b0b-a56e-989f02a5c3ba")
          expect(res.pageInfo.endCursor.title).to.eq("test3")
          expect(res.pageInfo.endCursor.created_at).to.eq("2023-07-13T09:52:32.876Z")
          expect(res.pageInfo.hasNextPage).to.eq(true)

          communities = communities.concat(res.edges)
          afterCursor = res.pageInfo.endCursor
        })
        .its("memberOf")
        .should("eq", false)
    })

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(getCommunitiesTestDoc, {
          input: { paginate: { first: 7, after: afterCursor }, filters: { titleContains: "test" } },
        })
      )
        .its("communities")
        .then((res) => {
          expect(res.edges.length).to.eq(6)
          expect(res.pageInfo.endCursor).to.eq(null)
          expect(res.pageInfo.hasNextPage).to.eq(false)

          communities = communities.concat(res.edges)
        })
        .its("memberOf")
        .should("eq", false)
    })

    cy.then(() => {
      cy.wrap(nodeIdsUnique(communities)).should("eq", true)
      cy.wrap(allTitlesContain(communities, "test")).should("eq", true)
      cy.wrap(titlesInAlphabeticalOrder(communities)).should("eq", true)
    })
  })

  it("Check pagination + owner id", function () {
    let communities: GetCommunitiesTestQuery["communities"]["edges"] = []
    let afterCursor: GetCommunitiesTestQuery["communities"]["pageInfo"]["endCursor"]

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(getCommunitiesTestDoc, {
          input: { paginate: { first: 10 }, filters: { ownerId: "8d2efb36-a726-425c-ad12-98f2683c5d86" } },
        })
      )
        .its("communities")
        .then((res) => {
          expect(res.edges.length).to.eq(10)
          expect(res.pageInfo.endCursor.id).to.eq("66350026-a007-41e8-839c-9d9a10161b5b")
          expect(res.pageInfo.endCursor.title).to.eq("test5")
          expect(res.pageInfo.endCursor.created_at).to.eq("2023-07-11T09:52:32.876Z")
          expect(res.pageInfo.hasNextPage).to.eq(true)

          communities = communities.concat(res.edges)
          afterCursor = res.pageInfo.endCursor
        })
        .its("memberOf")
        .should("eq", false)
    })

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(getCommunitiesTestDoc, {
          input: {
            paginate: { first: 10, after: afterCursor },
            filters: { ownerId: "8d2efb36-a726-425c-ad12-98f2683c5d86" },
          },
        })
      )
        .its("communities")
        .then((res) => {
          expect(res.edges.length).to.eq(4)
          expect(res.pageInfo.endCursor).to.eq(null)
          expect(res.pageInfo.hasNextPage).to.eq(false)

          communities = communities.concat(res.edges)
        })
        .its("memberOf")
        .should("eq", false)
    })

    cy.then(() => {
      cy.wrap(nodeIdsUnique(communities)).should("eq", true)
      cy.wrap(titlesInAlphabeticalOrder(communities)).should("eq", true)
      cy.wrap(hasSameOwnerId(communities, "8d2efb36-a726-425c-ad12-98f2683c5d86")).should("eq", true)
    })
  })

  it("Check pagination + member id", function () {
    let communities: GetCommunitiesTestQuery["communities"]["edges"] = []
    let afterCursor: GetCommunitiesTestQuery["communities"]["pageInfo"]["endCursor"]

    cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(getCommunitiesTestDoc, {
          input: { paginate: { first: 7 }, filters: { memberId: "266c189f-5986-404a-9889-0a54c298acb2" } },
        })
      )
        .its("communities")
        .then((res) => {
          expect(res.edges.length).to.eq(7)
          expect(res.pageInfo.endCursor.id).to.eq("aee984e6-49b8-456d-8c6a-66c6b16fc991")
          expect(res.pageInfo.endCursor.title).to.eq("test4")
          expect(res.pageInfo.endCursor.created_at).to.eq("2023-07-12T09:52:32.876Z")
          expect(res.pageInfo.hasNextPage).to.eq(true)

          communities = communities.concat(res.edges)
          afterCursor = res.pageInfo.endCursor
        })
        .its("memberOf")
        .should("eq", true)
    })

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(getCommunitiesTestDoc, {
          input: {
            paginate: { first: 7, after: afterCursor },
            filters: { memberId: "266c189f-5986-404a-9889-0a54c298acb2" },
          },
        })
      )
        .its("communities")
        .then((res) => {
          expect(res.edges.length).to.eq(5)
          expect(res.pageInfo.endCursor).to.eq(null)
          expect(res.pageInfo.hasNextPage).to.eq(false)

          communities = communities.concat(res.edges)
        })
        .its("memberOf")
        .should("eq", true)
    })

    cy.then(() => {
      cy.wrap(nodeIdsUnique(communities)).should("eq", true)
      cy.wrap(titlesInAlphabeticalOrder(communities)).should("eq", true)
      cy.wrap(inAllCommunities(communities)).should("eq", true)
    })
  })

  describe("Combining filters", function () {
    it("Check owner id & member id", function () {
      let communities: GetCommunitiesTestQuery["communities"]["edges"] = []

      cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

      cy.then(() => {
        cy.wrap(
          graphQLClient.request(getCommunitiesTestDoc, {
            input: {
              paginate: { first: 5 },
              filters: {
                ownerId: "266c189f-5986-404a-9889-0a54c298acb2",
                memberId: "8d2efb36-a726-425c-ad12-98f2683c5d86",
              },
            },
          })
        )
          .its("communities")
          .then((res) => {
            expect(res.edges.length).to.eq(1)
            expect(res.pageInfo.endCursor).to.eq(null)
            expect(res.pageInfo.hasNextPage).to.eq(false)

            communities = communities.concat(res.edges)
          })
          .its("memberOf")
          .should("eq", true)
      })

      cy.then(() => {
        cy.wrap(hasSameOwnerId(communities, "266c189f-5986-404a-9889-0a54c298acb2")).should("eq", true)
        cy.wrap(inAllCommunities(communities)).should("eq", true)
      })
    })

    it("Check title contains & owner id", function () {
      let communities: GetCommunitiesTestQuery["communities"]["edges"] = []

      cy.then(() => {
        cy.wrap(
          graphQLClient.request(getCommunitiesTestDoc, {
            input: {
              paginate: { first: 10 },
              filters: {
                titleContains: "test1",
                ownerId: "8d2efb36-a726-425c-ad12-98f2683c5d86",
              },
            },
          })
        )
          .its("communities")
          .then((res) => {
            expect(res.edges.length).to.eq(5)
            expect(res.pageInfo.endCursor).to.eq(null)
            expect(res.pageInfo.hasNextPage).to.eq(false)

            communities = communities.concat(res.edges)
          })
          .its("memberOf")
          .should("eq", false)
      })

      cy.then(() => {
        cy.wrap(hasSameOwnerId(communities, "8d2efb36-a726-425c-ad12-98f2683c5d86")).should("eq", true)
        cy.wrap(allTitlesContain(communities, "test1")).should("eq", true)
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
          graphQLClient.request(getCommunitiesTestDoc, {
            input: {
              paginate: { first: -5 },
              filters: { titleContains: "Community" },
            },
          })
        )
      })

      cy.wait("@gqlGetCommunitiesTestQuery").then(() => {
        throw new Error("No error returned")
      })
    })

    it("Check error with amount over 100", function () {
      cy.then(() => {
        cy.wrap(
          graphQLClient.request(getCommunitiesTestDoc, {
            input: {
              paginate: { first: 110 },
              filters: { titleContains: "Community" },
            },
          })
        )
      })

      cy.wait("@gqlGetCommunitiesTestQuery").then(() => {
        throw new Error("No error returned")
      })
    })
  })

  describe("Pagination input validation - Cursor", function () {
    it("Check error if no title supplied when cursor given", function () {
      cypressCheckOnFail("PAGINATION_ERROR", "Title must be specified with cursor")

      cy.then(() => {
        cy.wrap(
          graphQLClient.request(getCommunitiesTestDoc, {
            input: {
              paginate: { first: 5, after: { id: "abc" } },
              filters: { titleContains: "Community" },
            },
          })
        )
      })

      cy.wait("@gqlGetCommunitiesTestQuery").then(() => {
        throw new Error("No error returned")
      })
    })
  })
})

describe("Community title exists endpoint", function () {
  it("Check returns true for title in use", function () {
    cy.wrap(graphQLClient.request(communityTitleExistsTestDoc, { title: "Community1" }))
      .its("titleExists")
      .should("eq", true)
  })

  it("Check returns false for title not in use", function () {
    cy.wrap(graphQLClient.request(communityTitleExistsTestDoc, { title: "random" }))
      .its("titleExists")
      .should("eq", false)
  })
})

describe("Create community endpoint", function () {
  it("Check not signed in error response", function () {
    cypressCheckOnFail("UNAUTHENTICATED", "Not signed in")

    cy.then(() => {
      cy.wrap(graphQLClient.request(createCommunityTestDoc, { input: { title: "newCommunity" } }))
    })

    cy.wait("@gqlCreateCommunityTestMutation").then(() => {
      throw new Error("No error returned")
    })
  })

  it("Check invalid input responses", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(graphQLClient.request(createCommunityTestDoc, { input: { title: "Community1" } }))
        .its("createCommunity")
        .should((res) => expect(res.code).to.eq(400))
        .should((res) => expect(res.errorMsg).to.eq("Invalid input"))
        .should((res) => expect(res.inputErrors.title).to.eq("Title already in use"))
    })

    cy.then(() => {
      cy.wrap(graphQLClient.request(createCommunityTestDoc, { input: { title: "  " } }))
        .its("createCommunity")
        .should((res) => expect(res.code).to.eq(400))
        .should((res) => expect(res.errorMsg).to.eq("Invalid input"))
        .should((res) => expect(res.inputErrors.title).to.eq("Title must be 1-25 characters long"))
    })

    cy.then(() => {
      cy.wrap(graphQLClient.request(createCommunityTestDoc, { input: { title: "thisIsASuperLongCommunityName" } }))
        .its("createCommunity")
        .should((res) => expect(res.code).to.eq(400))
        .should((res) => expect(res.errorMsg).to.eq("Invalid input"))
        .should((res) => expect(res.inputErrors.title).to.eq("Title must be 1-25 characters long"))
    })
  })

  it("Check community successfully created", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(graphQLClient.request(createCommunityTestDoc, { input: { title: "newCommunity" } }))
        .its("createCommunity")
        .then((res) => {
          expect(res.code).to.eq(200)
          expect(res.successMsg).to.eq("Community successfully created")

          cy.then(() => {
            cy.wrap(graphQLClient.request(getCommunityTestDoc, { input: { id: res.community.id } }))
              .its("community")
              .should((res) => expect(res.title).to.eq("newCommunity"))
          })
        })
    })
  })
})

describe("Join community endpoint", function () {
  it("Check not signed in error response", function () {
    cypressCheckOnFail("UNAUTHENTICATED", "Not signed in")

    cy.then(() => {
      cy.wrap(graphQLClient.request(joinCommunityTestDoc, { input: { communityId: "abc" } }))
    })

    cy.wait("@gqlJoinCommunityTestMutation").then(() => {
      throw new Error("No error returned")
    })
  })

  it("Check community does not exist error response", function () {
    cypressCheckOnFail("BAD_USER_INPUT", "Community does not exist")

    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(graphQLClient.request(joinCommunityTestDoc, { input: { communityId: "abc" } }))
    })

    cy.wait("@gqlJoinCommunityTestMutation").then(() => {
      throw new Error("No error returned")
    })
  })

  it("Check joining an owned community error response", function () {
    cypressCheckOnFail("UNAUTHORIZED", "Cannot join an owned community")

    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(joinCommunityTestDoc, { input: { communityId: "351146cd-1612-4a44-94da-e33d27bedf39" } })
      )
    })

    cy.wait("@gqlJoinCommunityTestMutation").then(() => {
      throw new Error("No error returned")
    })
  })

  it("Check join community successfully", function () {
    cy.setCookie("test-user", "f734d0b4-20a1-4b7b-9d95-f5ad532582df")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(joinCommunityTestDoc, {
          input: { communityId: "5d148029-cac3-4cef-99f8-2208d5f6e3d2" },
        })
      )
        .its("userJoinCommunity")
        .should((res) => expect(res.code).to.eq(200))
        .should((res) => expect(res.successMsg).to.eq("Successfully joined community"))
    })

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(getCommunityTestDoc, {
          input: { id: "5d148029-cac3-4cef-99f8-2208d5f6e3d2" },
        })
      )
        .its("community")
        .should((res) => expect(res.inCommunity).to.eq(true))
    })
  })

  it("Check leave community successfully", function () {
    cy.setCookie("test-user", "266c189f-5986-404a-9889-0a54c298acb2")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(joinCommunityTestDoc, {
          input: { communityId: "5d148029-cac3-4cef-99f8-2208d5f6e3d2" },
        })
      )
        .its("userJoinCommunity")
        .should((res) => expect(res.code).to.eq(200))
        .should((res) => expect(res.successMsg).to.eq("Successfully left community"))
    })

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(getCommunityTestDoc, {
          input: { id: "5d148029-cac3-4cef-99f8-2208d5f6e3d2" },
        })
      )
        .its("community")
        .should((res) => expect(res.inCommunity).to.eq(false))
    })
  })
})

describe("Change community title endpoint", function () {
  it("Check not signed in error response", function () {
    cypressCheckOnFail("UNAUTHENTICATED", "Not signed in")

    cy.then(() => {
      cy.wrap(graphQLClient.request(changeCommunityTitleTestDoc, { input: { id: "abc", newTitle: "abc" } }))
    })

    cy.wait("@gqlChangeCommunityTitleTestMutation").then(() => {
      throw new Error("No error returned")
    })
  })

  it("Check community does not exist error response", function () {
    cypressCheckOnFail("BAD_USER_INPUT", "Community does not exist")

    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(graphQLClient.request(changeCommunityTitleTestDoc, { input: { id: "abc", newTitle: "abc" } }))
    })

    cy.wait("@gqlChangeCommunityTitleTestMutation").then(() => {
      throw new Error("No error returned")
    })
  })

  it("Check user not owner of community error response", function () {
    cypressCheckOnFail("UNAUTHORIZED", "Unauthorized")

    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(changeCommunityTitleTestDoc, {
          input: { id: "41094cb6-470d-4409-85b4-484fd43dd41d", newTitle: "abc" },
        })
      )
    })

    cy.wait("@gqlChangeCommunityTitleTestMutation").then(() => {
      throw new Error("No error returned")
    })
  })

  it("Check invalid input responses", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(changeCommunityTitleTestDoc, {
          input: { id: "351146cd-1612-4a44-94da-e33d27bedf39", newTitle: "  " },
        })
      )
        .its("changeCommunityTitle")
        .should((res) => expect(res.code).to.eq(400))
        .should((res) => expect(res.errorMsg).to.eq("Invalid input"))
        .should((res) => expect(res.inputErrors.newTitle).to.eq("Title must be 1-25 characters long"))
    })

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(changeCommunityTitleTestDoc, {
          input: { id: "351146cd-1612-4a44-94da-e33d27bedf39", newTitle: "thisIsASuperLongCommunityTitle" },
        })
      )
        .its("changeCommunityTitle")
        .should((res) => expect(res.code).to.eq(400))
        .should((res) => expect(res.errorMsg).to.eq("Invalid input"))
        .should((res) => expect(res.inputErrors.newTitle).to.eq("Title must be 1-25 characters long"))
    })

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(changeCommunityTitleTestDoc, {
          input: { id: "351146cd-1612-4a44-94da-e33d27bedf39", newTitle: "Community1" },
        })
      )
        .its("changeCommunityTitle")
        .should((res) => expect(res.code).to.eq(400))
        .should((res) => expect(res.errorMsg).to.eq("Invalid input"))
        .should((res) => expect(res.inputErrors.newTitle).to.eq("Community title already in use"))
    })
  })

  it("Check successfully change community title", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(changeCommunityTitleTestDoc, {
          input: { id: "351146cd-1612-4a44-94da-e33d27bedf39", newTitle: "newTitle" },
        })
      )
        .its("changeCommunityTitle")
        .then((res) => {
          expect(res.code).to.eq(200)
          expect(res.successMsg).to.eq("Successfully changed community title")

          cy.then(() => {
            cy.wrap(graphQLClient.request(getCommunityTestDoc, { input: { id: res.community.id } }))
              .its("community")
              .should((res) => expect(res.title).to.eq("newTitle"))
          })
        })
    })
  })
})

describe("Delete community endpoint", function () {
  it("Check not signed in error response", function () {
    cypressCheckOnFail("UNAUTHENTICATED", "Not signed in")

    cy.then(() => {
      cy.wrap(graphQLClient.request(deleteCommunityTestDoc, { input: { id: "abc", title: "abc" } }))
    })

    cy.wait("@gqlDeleteCommunityTestMutation").then(() => {
      throw new Error("No error returned")
    })
  })

  it("Check community does not exist error response", function () {
    cypressCheckOnFail("BAD_USER_INPUT", "Community does not exist")

    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(graphQLClient.request(deleteCommunityTestDoc, { input: { id: "abc", title: "abc" } }))
    })

    cy.wait("@gqlDeleteCommunityTestMutation").then(() => {
      throw new Error("No error returned")
    })
  })

  it("Check user does not own community error response", function () {
    cypressCheckOnFail("BAD_USER_INPUT", "Community does not exist")

    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(graphQLClient.request(deleteCommunityTestDoc, { input: { id: "abc", title: "abc" } }))
    })

    cy.wait("@gqlDeleteCommunityTestMutation").then(() => {
      throw new Error("No error returned")
    })
  })

  it("Check invalid input response", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(deleteCommunityTestDoc, {
          input: { id: "351146cd-1612-4a44-94da-e33d27bedf39", title: "abc" },
        })
      )
        .its("deleteCommunity")
        .should((res) => expect(res.code).to.eq(400))
        .should((res) => expect(res.errorMsg).to.eq("Invalid title"))
        .should((res) => expect(res.inputErrors.title).to.eq("Please enter your community's title"))
    })
  })

  it("Check successfully deletes community", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")

    cy.then(() => {
      cy.wrap(
        graphQLClient.request(deleteCommunityTestDoc, {
          input: { id: "351146cd-1612-4a44-94da-e33d27bedf39", title: "Community1" },
        })
      )
        .its("deleteCommunity")
        .should((res) => expect(res.code).to.eq(200))
        .should((res) => expect(res.successMsg).to.eq("Successfully deleted community"))
    })

    cy.then(() => {
      cy.then(() => {
        cy.wrap(graphQLClient.request(getCommunityTestDoc, { input: { id: "351146cd-1612-4a44-94da-e33d27bedf39" } }))
          .its("community")
          .should("eq", null)
      })
    })
  })
})
