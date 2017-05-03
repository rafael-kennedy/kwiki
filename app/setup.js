const _ = require('lodash')
const {ItemList} = require('itemlists.js')


function setupMainList() {
  var mainList = new ItemList({el: $("<ul id='selector'></ul>")})
  wiki.mainList = mainList

  var toolbar = $("<div class='toolbar'></div>")
  var handlerArray = [
    {
      name: "refresh",
      symbol: '<i class="fa fa-refresh" aria-hidden="true"></i>',
      fn: function(){
        mainList.toLinkUL()
      }
    },
    {
      name: "newItem",
      symbol: '<i class="fa fa-file-text" aria-hidden="true"></i>',
      fn: wiki.Item.makeNew
    },
  ]

  function addButton (obj) {
    var btn = $("<button class='toolbar "+obj.name+"'>"+obj.symbol+"</button>")
    btn.on('click', obj.fn)
    toolbar.append(btn)
  }

  handlerArray.forEach(addButton)

  var searchbox = $("<input id='searchbox' placeholder='Search for title or tag'></input>")

  function search(){
    wiki.mainList.clientFilter(this.value)
  }

  searchbox.on("keyup", _.debounce(search, 500))
  toolbar.append(searchbox)
  toolbar.appendTo('#sidebar')

  mainList.toLinkUL()
  mainList.el.appendTo('#sidebar')

}

function setupAddByTemplate() {
  var sidebar = $('#sidebar')
  var templateList
  new ItemList({}).search("tag", "Template").then(data => {
    templateList = data.map(v => {
      var el = $('<p>'+v.name+'</p>')
      el.on("click", v => {
        newiki.Item
      })
      return
    })

  })
}


module.exports = function() {
  var handlerArray = [
    setupMainList,
    setupAddByTemplate,
  ]

  handlerArray.forEach(fn => {
    fn()
  })
}
