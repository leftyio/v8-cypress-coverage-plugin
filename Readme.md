# Cypress V8 Coverage Plugin

_this plugin aims at providing codecoverage using the chrome V8 coverage api_

It is adapted from [this poc](https://github.com/bahmutov/cypress-native-chrome-code-coverage-example)

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
                "src_root":"path/to/your/src/root",
                "collect_coverage_timeout":120000 //optional, this affects the final code collection step, that may timeout if your codebase is big enough
            }
        }
    }
```
On coverage collection we will replace the url root with the supplied `src_root`, and run the glob matching on the result string

Both thoses settings are required as they are used to recognize which files are to be kept amongst all the browser loaded files.

`support/index.js`
```js
[...]
import "cypress_v8_coverage_plugin/support"
[...]
```

This allows the plugin to hook on test lifecyle events

`plugins/indes.js`
```js
const cypress_v8_plugin = require("cypress_v8_coverage_plugin/plugin")
module.exports = (on, config) => {
    ...
    config = cypress_v8_plugin(on,config)
    ...
    return config
}

```

This registers the plugin in to cypress


### Convertion
_optional_
You can trigger a report convertion to the `html` or `lcov` through the `convert_coverage` task

This run the nyc command through npx on the generated files.

```javascript
afterAll(()=>{
    cy.task("convertCoverage",'html',"./html/report/dir")//use an empty dir, this generates a lot of files
    cy.task("convertCoverage","lcov","./lcovpath.info")
})
```
Otherwise, you can trigger this convertion manualy using nyc or istanbul
