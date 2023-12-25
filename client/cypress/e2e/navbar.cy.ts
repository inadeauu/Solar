import { aliasMutation } from "../../src/utils/graphql-test-utils"
import { translator } from "../../src/utils/uuid"

beforeEach(function () {
  cy.exec("npm --prefix ../server run resetDb")
  cy.exec("npm --prefix ../server run seed")

  cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
    aliasMutation(req, "Logout")
  })
})

describe("Navbar, unauthenticated", function () {
  it("Menu (on regular screen) buttons", function () {
    cy.visit("/")

    cy.get('[data-testid="signup-button"]').as("signup-button").invoke("attr", "href").should("eq", "/signup")
    cy.get("@signup-button").click()
    cy.location("pathname").should("eq", "/signup")
    cy.go("back")

    cy.get('[data-testid="login-button"]').as("login-button").invoke("attr", "href").should("eq", "/login")
    cy.get("@login-button").click()
    cy.location("pathname").should("eq", "/login")
    cy.go("back")
  })

  it("Menu (on small screen) opens and closes", function () {
    cy.viewport(300, 600)
    cy.visit("/")

    cy.get('[data-testid="nav-menu"]').should("not.exist")
    cy.get('[data-testid="nav-menu-container"]').as("nav-menu-container").click()
    cy.get('[data-testid="nav-menu"]').as("nav-menu").should("exist")

    cy.get("@nav-menu-container").click()
    cy.get("@nav-menu").should("not.exist")

    cy.get("@nav-menu-container").click()
    cy.get('[data-testid="navbar"]').click("bottom")
    cy.get("@nav-menu").should("not.exist")
  })

  it("Menu (on small screen) items", function () {
    cy.viewport(300, 600)
    cy.visit("/")

    cy.get('[data-testid="nav-menu-container"]').as("nav-menu-container").click()

    cy.get('[data-testid="menu-signup-button"]').as("menu-signup-button").invoke("attr", "href").should("eq", "/signup")
    cy.get("@menu-signup-button").click()
    cy.location("pathname").should("eq", "/signup")
    cy.go("back")

    cy.get("@nav-menu-container").click()

    cy.get('[data-testid="menu-login-button"]').as("menu-login-button").invoke("attr", "href").should("eq", "/login")
    cy.get("@menu-login-button").click()
    cy.location("pathname").should("eq", "/login")
    cy.go("back")
  })
})

describe("Navbar, authenticated", function () {
  beforeEach(function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86")
  })

  it("Profile menu opens and closes", function () {
    cy.visit("/")

    cy.get('[data-testid="nav-profile-menu"]').should("not.exist")
    cy.get('[data-testid="nav-profile-menu-container"]').as("nav-menu-container").click()
    cy.get('[data-testid="nav-profile-menu"]').as("nav-menu").should("exist")

    cy.get("@nav-menu-container").click()
    cy.get("@nav-menu").should("not.exist")

    cy.get("@nav-menu-container").click()
    cy.get('[data-testid="navbar"]').click("bottom")
    cy.get("@nav-menu").should("not.exist")
  })

  it("Profile menu items", function () {
    cy.visit("/")

    cy.get('[data-testid="nav-profile-username"]').should("have.text", "username1")

    cy.get('[data-testid="nav-profile-menu-container"]').as("nav-menu-container").click()

    cy.get('[data-testid="profile-button"]')
      .as("profile-button")
      .invoke("attr", "href")
      .should("eq", "/profile/username1")
    cy.get("@profile-button").click()
    cy.location("pathname").should("eq", "/profile/username1")
    cy.go("back")

    cy.get("@nav-menu-container").click()

    cy.get('[data-testid="create-community-button"]')
      .as("create-community-button")
      .invoke("attr", "href")
      .should("eq", "/create-community")
    cy.get("@create-community-button").click()
    cy.location("pathname").should("eq", "/create-community")
    cy.go("back")

    cy.get("@nav-menu-container").click()

    cy.get('[data-testid="settings-button"]').as("settings-button").invoke("attr", "href").should("eq", "/settings")
    cy.get("@settings-button").click()
    cy.location("pathname").should("eq", "/settings")
    cy.go("back")

    cy.get("@nav-menu-container").click()

    cy.get('[data-testid="logout-button"]').as("logout-button").click()
    cy.wait("@gqlLogoutMutation")
      .its("response.body.data.logout")
      .should((res) => expect(res.code).to.eq(200))
      .should((res) => expect(res.successMsg).to.eq("Successfully logged out"))

    cy.get("@nav-menu-container").should("not.exist")
  })
})

describe("Search bar", function () {
  it("Switch search types", function () {
    cy.visit("/")

    cy.get('[data-testid="searchbar-dropdown"]').as("dropdown").click()
    cy.get('[data-testid="searchbar-Users"]').as("search-users").click()
    cy.get('[data-testid="searchbar-input"]')
      .as("searchbar-input")
      .invoke("attr", "placeholder")
      .should("eq", "Search Users")

    cy.get("@dropdown").click()
    cy.get('[data-testid="searchbar-Communities"]').as("search-communities").click()
    cy.get("@searchbar-input").invoke("attr", "placeholder").should("eq", "Search Communities")
  })

  it("Search communities", function () {
    cy.visit("/")

    cy.get('[data-testid="searchbar-input"]')
      .as("searchbar-input")
      .invoke("attr", "placeholder")
      .should("eq", "Search Communities")

    cy.get("@searchbar-input").type("abc")
    cy.get('[data-testid="communities-results"]').as("communities-results").children().should("have.length", 1)
    cy.get("@communities-results").eq(0).should("have.text", "No results")
    cy.get("@searchbar-input").clear()

    cy.get("@searchbar-input").type("Community")
    cy.get("@communities-results").children().should("have.length", 2)
    cy.get("@communities-results")
      .children()
      .then((results) => {
        expect(results.eq(0).children().eq(0)).to.have.text("Community1")
        expect(results.eq(0).children().eq(1)).to.have.text("1 Member")

        expect(results.eq(1).children().eq(0)).to.have.text("Community2")
        expect(results.eq(1).children().eq(1)).to.have.text("2 Members")
      })

    cy.get("@communities-results").children().eq(0).click()
    cy.url().should(
      "eq",
      `http://localhost:5173/communities/${translator.fromUUID("351146cd-1612-4a44-94da-e33d27bedf39")}`
    )
  })

  it("Search users", function () {
    cy.visit("/")

    cy.get('[data-testid="searchbar-input"]').as("searchbar-input")
    cy.get('[data-testid="searchbar-dropdown"]').as("dropdown").click()
    cy.get('[data-testid="searchbar-Users"]').as("search-users").click()

    cy.get("@searchbar-input").type("123")
    cy.get('[data-testid="users-results"]').as("users-results").children().should("have.length", 1)
    cy.get("@users-results").eq(0).should("have.text", "No results")
    cy.get("@searchbar-input").clear()

    cy.get("@searchbar-input").type("username")
    cy.get("@users-results").children().should("have.length", 3)
    cy.get("@users-results")
      .children()
      .then((results) => {
        expect(results.eq(0).children().eq(0)).to.have.text("username1")
        expect(results.eq(0).children().eq(1)).to.have.text("18 Posts • 2 Comments")

        expect(results.eq(1).children().eq(0)).to.have.text("username2")
        expect(results.eq(1).children().eq(1)).to.have.text("2 Posts • 2 Comments")

        expect(results.eq(2).children().eq(0)).to.have.text("username3")
        expect(results.eq(2).children().eq(1)).to.have.text("1 Post • 1 Comment")
      })

    cy.get("@users-results").children().eq(0).click()
    cy.url().should("eq", `http://localhost:5173/profile/username1`)
  })
})
