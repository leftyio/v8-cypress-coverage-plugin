const v8CollectCoverage = require("../plugin").collect_coverage
const fs = require("fs");
const load_config = require("../plugin").load_config
load_config(JSON.parse(fs.readFileSync("./cypress.json", "utf8")))
v8CollectCoverage()