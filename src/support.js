const registerHooks = () => {
    before(() => {
    cy.task("v8CleanFiles")      
    })
  
    beforeEach(() => {
      cy.task("v8BeforeTest")
    })
  
    afterEach(() => {
      cy.task("v8AfterTest")
    })
  
    after(()=>{
        if(Cypress.env("V8CodeCoverageCollect")){
          cy.task("v8CollectCoverage",null,{timeout:Cypress.env('v8_coverage').collect_coverage_timeout})
        }
    })
  }
  const cyEnvs = Cypress._.mapKeys(Cypress.env(), (value, key) =>
  key.toLowerCase()
)

if (Cypress.env('V8CodeCoverageRegistered') !== true) {
  // register a hook just to log a message
  before(() => {
    console.log(`
      ⚠️ V8 Code coverage tasks were not registered by the plugins file.
      You must register using the plugin register command
    `)
  })
} else {
  registerHooks()
}