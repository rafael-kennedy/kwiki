const _ = require('lodash')

function modalDialog(title="Modal Title", body="Modal Body Text", obj) {
  var defHTML = `<div class="modal">
    <div class="modal-header">${title}</div>
    <div class="modal-body">${body}</div>
    ${ _.has(obj, 'textArea') ? '<input class="modal-input" placeholder="'+obj.textArea+'">' : ""}
    <div class="modal-footer"><button class="modal-button-ok">OK</button> <button class="modal-button-cancel">CANCEL</button></div>
  </div>`

  return new Promise((resolve, reject) => {
    var el = $(defHTML)
    el.appendTo("body")
    el.css({
      "z-index": "1000",
      "background-color": "#fefefe",
      "margin": "15% auto",
      "padding": "20px",
      "border": "1px solid #888",
      "width": "80%",
      "position": "fixed",
      "top":0
    })
    el.find('button.modal-button-cancel').on('click', reject)
    el.find('button.modal-button-ok').on('click', () => {
      var tA = el.find('.modal-input')
      if(tA.length) {
        el.remove()
        resolve(tA.val())
      } else {
        el.remove()
        resolve()
      }
    })

  })
}

module.exports = {modalDialog}
