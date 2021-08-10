
it('adds numbers', () => {
  cy.visit('/')
  cy.contains('Hello world').should('be.visible')

})

it('Substracts numbers',()=>{
  cy.visit('/?sub')
  cy.contains('Hello world').should('be.visible')
})

