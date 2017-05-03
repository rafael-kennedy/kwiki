const fs = require('fs');
var obj = {}
obj.data = require('./data.json')
obj.save = function(){
  fs.writeFileSync('data/data.json', JSON.stringify(this.data))
}

module.exports = obj
