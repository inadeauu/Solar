beforeEach(function () {
  cy.exec("npm --prefix ../server run resetDb")
  cy.exec("npm --prefix ../server run seed")
})

describe("Navigation", function () {
  it("Show not found page with unused URL", function () {
    cy.visit("/123")
    cy.get('[data-testid="not-found-body"]')
  })

  it("Check home button goes back home", function () {
    cy.visit("/123")
    cy.get('[data-testid="home-button"]').click()
    cy.location("pathname").should("eq", "/")
  })
})
