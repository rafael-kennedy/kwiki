const _ = require('lodash')

module.exports = function (name, body, data) {
  var body = ""
  return {
    name,
    body,
    set body (newText){
      body = newText

    }

  }
}
