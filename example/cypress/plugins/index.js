const cypress_v8_plugin = require("../../../src/plugin")

module.exports = (on, config) => {
  return cypress_v8_plugin(on,config)
}
