const _ = require('lodash')

class ItemList {
  constructor(obj) {
    var {
      defaultFilter = {type:null, val:""},
      max = null,
      el = $('<ul class="tag-list"></ul>')
    } = obj
    this.defaultFilter = this.filter = defaultFilter
    this.max = max
    this.el = el
  }

  search(type, val){
    return new Promise((resolve, reject) => {
      $.get('data/search', {type, val}, data => {
        resolve(JSON.parse(data))
      })
    })
  }

  toLinkUL() {
    let filter = this.filter || {type: null, val: null}
    this.search(filter.type, filter.val).then(data => {

      this.items = data
      let itemArray = []
      for (var i in this.items) {
        if (this.items.hasOwnProperty(i)) {
          let item = this.items[i]
          let el = $(`<li><a>${item.name}</a></li>`)
          item.el = el
          el.find('a').on('click', v => wiki.showItem(item.name))
          itemArray.push(el)
        }
      }
      itemArray = _.sortBy(itemArray, ['name'])
      this.el.empty()
      itemArray.forEach(v => v.appendTo(this.el))
      this.isLinkUL = true
    })
  }

  filter(obj) {
    this.filter = obj || this.defaultFilter
    if (this.isLinkUL) {
      this.toLinkUL()
    }
  }

  clientFilter(val) {
    if (!val) {
      this.items.forEach(item => {
        item.el.show()
      })
    } else {
      this.items.forEach(item => {
        if (item.name.toUpperCase().indexOf(val.toUpperCase()) >= 0 || item.tags.indexOf(val) >= 0 ) {
          item.el.show()
        } else {
          item.el.hide()
        }
      })
    }
  }


}

module.exports = {
  ItemList
}
