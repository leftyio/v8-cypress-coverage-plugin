# Cypress V8 Coverage Plugin

_this plugin aims at providing codecoverage using the chrome V8 coverage api_

It is adapted from (this poc)[https://github.com/bahmutov/cypress-native-chrome-code-coverage-example] 

## Abilities and limitation

This plugin **does** :
- gather coverage on multiple tests 
- gather coverage on multiple files 
- works with **chrome**
- converts coverage reports to **html** or **lcov**
- apply sourcemaps on a report generation

This plugins **doesn't**
- handle other browser than **chrome** ( for technical limitation reasons )
- cure all afflictions, make children behave, or long lost loves come back, this is not black magic 🧙‍♀️.

## Usage

### Configuration:
**required**
```json
    {...
        "env":{
            "v8_coverage":{
                "include":["glob/**/to/your/files.*js","other/glob"],
                "src_root":"path/to/your/src/root"
            }
        }
    }
```
On coverage collection we will replace the url root with the supplied `src_root`, and run the glob matching on the result string

Both thoses settings are required as they are used to recognize which files are to be kept amongst all the browser loaded files.

### Test Files:
**required**

In each test file, add the following task so that the coverage tool can be activated:

```javascript
beforeEach(() => {
  cy.task('beforeTest')
})

afterEach(() => {
  cy.task('afterTest')
})
```
### File Sanitation
**required**

On 
### Convertion
_optional_
You can trigger a report convertion to the `html` or `lcov` through the `convert_coverage` task
```javascript
afterAll(()=>{
    cy.task("convert_coverage",'html',"./html/report/dir")//use an empty dir, this generates a lot of files
    cy.task("convert_coverage","lcov","./lcovpath.info")
})
```
Otherwise, you can trigger this convertion manualy using nyc or istanbul
