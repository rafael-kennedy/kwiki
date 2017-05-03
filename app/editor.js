const simplemde = require('simplemde');
const _ = require('lodash')
// TODO:30 integrate horsey with tags, macros, links

var toolconf = [
  {
    "name": "close",
    action (editor) {
      console.log('close')
      wiki.editing.save()
      wiki.editing.render()
      delete wiki.editing
      wiki.editor.toTextArea()
      wiki.editor.element.remove()
    },
    "className": "fa fa-window-close",
    "title": "Close"
  },
  "undo",
  "|",
  "bold",
  "italic",
  "heading",
  "quote",
  "unordered-list",
  "ordered-list",
  "table",
  "link",
  "image",
  "preview",
  "side-by-side",
  "fullscreen",
  "|",
  {
    "name": "delete",
    action(editor) {
      console.log('close')
      wiki.editing.delete()
      wiki.editing.hide()
      delete wiki.editing
      wiki.editor.toTextArea()
      wiki.editor.element.remove()
    },
    "className": "fa fa-trash-o",
    "title": "Delete"
  }
]

module.exports = {
  setActive (item) {
    var editEl = $('#editor')
    var toolbar = $("<div class='toolbar'></div>")
    wiki.editing = item

    var handlerArray = [
      {
        name: "delete",
        symbol: "✘",
        fn: function(){
          item.delete()
          editEl.html("")
        }
      },
    ]

    handlerArray.forEach(addButton)

    function updateData(inString) {
      var outStr = ""
      var re = /\[\[\{[^]+?\}\]\]/

      if (re.test(inString) && item.data.data) {
        outStr = inString.replace(re, `[[${JSON.stringify(item.data.data, null, 2)}]]`)
      }
      return outStr || inString
    }

    function addButton (obj) {
      var btn = $("<button class='toolbar "+obj.name+"'>"+obj.symbol+"</button>")
      btn.on('click', obj.fn)
      toolbar.append(btn)
    }
    var editor = $("<textarea id='editor'></textarea>")
    editor.appendTo(editEl)
    var mde = wiki.editor = new simplemde({
      element: editor[0],
      toolbar: toolconf,
      insertTexts: {link:["[","]()"]}
    })
    var saveThis = function () {
      item.save()
    }
      mde.value(updateData(wiki.editing.data.body))
      mde.codemirror.on('keyup', _.debounce(saveThis, 3000))
  }
}
