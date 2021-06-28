/// <reference types="cypress" />

beforeEach(() => {
  cy.task('beforeTest')
})

afterEach(() => {
  cy.task('afterTest')
})

it('adds numbers', () => {
  cy.visit('/')
  cy.contains('Hello world').should('be.visible')

})

it('Substracts numbers',()=>{
  cy.visit('/?sub')
  cy.contains('Hello world').should('be.visible')
})

after(()=>{
cy.task("convert_report",["lcov","./lcov"])
})