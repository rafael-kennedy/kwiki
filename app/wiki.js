const {setActive} = require('editor.js')
const {pipe, nthRegExGrp} = require('utils.js')
const macros = require('macros.js')
const _ = require("lodash")
const render = require("wiki.render.js")
const ui = require('ui')

function showItem(itemName) {
  if (!wiki.active.hasOwnProperty(itemName)) {
    var cur = wiki.active[itemName] = new wiki.Item(itemName)
    cur.render()
  } else {
    var cur = wiki.active[itemName]
  }
  cur.navigateTo()
}

function itemLink (itemName, text) {
  var lnk = $(`<a>${text || itemName}</a>`)
  lnk.on('click', function(){
    showItem(itemName)
  })

}

class Item {
  constructor (name, isCopyOf) {
    this.itemName = name
    this.html = ""
    this.template = "default"
    this.dataObj = {}
    if (!isCopyOf) {
      this.updateData()
    } else {
      this.dataObj = isCopyOf.data
    }
  }

  static util() {
    return {
      dataRE: /\[\[([^]+)\]\]/gm,
      urlRE:  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
      tagRE: /\{#(.+?)\}/gm
    }
  }

  static makeNew() {
    ui.modalDialog('Enter a Name for a new Item', "Please Enter a unique name for a new item here.", {textArea: "New Item..."}).then(name => {
      if (name) {
        var newItem = new wiki.Item(name)
        newItem.edit()
        wiki.mainList.toLinkUL()
      }
    })
  }

  static copy(name) {
    debugger
    var _that = new wiki.Item(name)
    ui.modalDialog('Enter a Name for a new Item', "Please Enter a unique name for a new item here.", {textArea: "Copy of "+name}).then(name => {
      var newItem = new wiki.Item(name, _that)
      newItem.edit()
    })
  }

  set name (val) {
  }

  get name () {
    return this.itemName
  }

  updateData () {
    var _that = this
    return new Promise((resolve, reject) => {
      $.get('data', {
          item: this.name,
        },
        function success (data) {
          if(data){resolve(JSON.parse(data))}
        })
    }).then(data => {
      _that.dataObj = data
    })
  }
  get data () {
    return this.dataObj
  }
  set data (data) {
    this.dataObj = data
    return new Promise((resolve, reject) => {
      $.post('data', {
          item: this.name,
          data: JSON.stringify(data),
          method: "update"
        },
        function success (data) {

          resolve(data)
        })
    }).then(data => {
      console.log(data)
    }).catch(data => {
      console.log(data)
    })
  }

  updateHTML (template) {
    if (!template) {
      template = this.template
    }
    return new Promise((resolve, reject) => {
      $.get('render', {
        item: this.name,
        template: template
      }, function success (data) {
        resolve(data)
      })
    }).then(data => {

      this.html = data
    })
  }

  delete () {
    new Promise((resolve, reject) => {
      $.post('data', {
        method: "delete",
        item: this.name
      }, function success(data) {
        resolve(data)
      })
    }).then(data => {
      console.log(data)
      this.mainList.toLinkUL()
    })
  }


  hide () {
    if (this.el) {
      delete wiki.active[this.name]
      $(this.el).remove()
      delete this.el
    }
  }

  edit () {
    setActive(this)
  }

  get isActive() {
    return wiki.active.hasOwnProperty(this.name)
  }

  set isActive(val) {
    if (val) {
      this.render()
    } else {
      this.hide()
    }
  }

  save () {
    var that = this
      function parseText (inString) {
        var out = {
          name: that.name,
          data: {},
          body: inString,
          tags: [],
          updated: new Date(),
        }
        var re = wiki.Item.util().dataRE
        var fieldArray = nthRegExGrp(re, inString, 1)
        for (var f in fieldArray) {
          if (fieldArray.hasOwnProperty(f)) {
            var field = fieldArray[f]
            try {
              out.data = _.merge(out.data, JSON.parse(field))
            } catch (e) {
              console.log(`Data JSON failure: ${e}`)
            }
          }
        }
        out.tags = nthRegExGrp(wiki.Item.util().tagRE, inString, 1)
        return out
      }
      var outText = {name: this.name, body:"", data:{}}
      if (wiki.editor){
        outText = parseText(wiki.editor.value())
      }
      this.data = outText
  }

  navigateTo () {

    if (this.isActive) {
      this.el.insertBefore($('div.item')[0])
    } else {
      this.render()
    }
  }

  render() {
    render(this)
  }



}

module.exports = {
  showItem,
  Item,
  active: {}
}
