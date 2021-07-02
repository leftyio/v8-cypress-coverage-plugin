const registerHooks = () => {
    before(() => {
      /*
      const logInstance = Cypress.log({
        name: 'V8Coverage',
        message: ['Reseting [v8_code_coverage_plugin]']
      })
  
      cy.task(
        'resetCoverage',
        {
          // @ts-ignore
          isInteractive: Cypress.config('isInteractive')
        },
        { log: false }
      ).then(() => {
        logInstance.end()
      })
      */
    })
  
    beforeEach(() => {
      cy.task("v8BeforeTest")
    })
  
    afterEach(() => {
      cy.task("v8AfterTest")
    })
  
    after(()=>{
        cy.task("v8CollectCoverage")
    })
  }
  const cyEnvs = Cypress._.mapKeys(Cypress.env(), (value, key) =>
  key.toLowerCase()
)

if (Cypress.env('V8CodeCoverageRegistered') !== true) {
  // register a hook just to log a message
  before(() => {
    logMessage(`
      ⚠️ V8 Code coverage tasks were not registered by the plugins file.
      You must register using the plugin register command
    `)
  })
} else {
  registerHooks()
}