

it('adds numbers', () => {
    cy.visit('/?fly')
    cy.contains('Hello world').should('be.visible')

})
