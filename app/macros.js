const _ = require("lodash")

var obj = {
  // valid events: click
  alertButton: {
    html (item) {
      return `<button>${item.name}</button>`
    },
    click (item) {
      alert(item.name)
    }
  },

  roll: {
    html (item, text) {
      return `<button>${text || 'roll'}</button>`
    },
    click (item, text, number, sides, plus) {
      var dice = []
      total = 0
      for (var i = 0; i < Number(number); i++) {
        let val = Math.ceil(Math.random()*sides)
        dice.push(val)
        total += val
      }
      if (!plus) {
        plus = 0
      }
      let outStr = `Your Roll: [${dice.join("] [")}] plus ${plus} for a total of ${total+Number(plus)}`
      alert(outStr)
    }
  },

  field: {
    html (item, fieldName) {
      return _.get(item.data.data, fieldName) || "No Field"
    }
  },

  incField: {
    html (item, text){
      return `<button>${text || 'increment'}</button>`
    },
    click (item, text, fieldPath, number) {
      try {
        let num = Number(number)
        _.set(item.data.data, fieldPath, _.get(item.data.data, fieldPath) + num)
        item.render()

      } catch (e) {
        console.log(e)
      }
    }
  },

  setField: {
    html (item, text){
      return `<button>${text || 'increment'}</button>`
    },
    click (item, text, toPath, from) {
      try {
        if (!Number.isNaN(Number(from))) {
          _.set(item.data.data, toPath, Number(from))
        } else {
          _.set(item.data.data, toPath, _.get(item.data.data, from))
        }
        item.render()

      } catch (e) {
        console.log(e)
      }
    }
  },

  // # TODO: Add list macro
  fieldList: {
    html (item, fieldPath, numbered, links) {
      var data = _.get(item.data.data, fieldPath)
      var content
      var wrapper = "ul"
      if (numbered) {
        wrapper = "ol"
      }
      if (links) {
        content = []
        data.forEach(v => {
          content.push(`<li><a href="${v}">${v}</a></li>`)
        })
      } else {
        content = `<li>${data.join("</li><li>")}</li>`
      }
      return `<${wrapper}> ${content} </${wrapper}>`
    }
  },

  pushField: {
    html (item, fieldPath, placeholder, buttonText) {
      var buttonEl = ""
      if (buttonText){
        buttonEl = `<button>${buttonText}</button>`
      }
      return `<input placeholder="${placeholder || "Add to "+ fieldPath}"></input>${buttonEl}`
    },
    apply (item, el, fieldPath) {
      var tBox = $(el).find('input')
      tBox.on('keyup', (event) => {
        if (event.keyCode === 13) {

          try {
            var inArray = _.get(item.data.data, fieldPath)
            if (!Array.isArray(inArray)) {
              inArray = []
            }
            inArray.push(tBox.val())
            tBox.val("")
            _.set(item.data.data, fieldPath, inArray)
            item.render()
          } catch (e) {
            console.log(e)
          }
        }
      })
    }
  }


}

module.exports = obj
