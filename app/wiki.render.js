const {pipe, nthRegExGrp} = require('utils.js')
const macros = require('macros.js')

module.exports = function render (_that) {
  var macroArray = []
  var mFuncArray = []

  function insertMacros () {
    var re = /\{\{(.+?)\}\}/g
    var replacer = function (m, g) {
      try {
        var matches = g.match(/(\w+) ([^]+)/)
        var macroName = matches[1]
        var params = JSON.parse(matches[2])
      } catch (e) {
        var params = g.split(/\s*[\|:]\s*/g)
        var macroName = params.shift().replace(/ /g, "")
      }
      try {
        let thisMacro = macros[macroName]
        let el = thisMacro.html(_that, ...params)
        el = $(`<span>${el}</span>`)
        macroArray.push(el)
        if (thisMacro.apply) {
          mFuncArray.push(function(){
            thisMacro.apply(_that, el, ...params)
          })
        } else {
          mFuncArray.push(null)
        }

        if (thisMacro.click) {
          let fn = function() {
            thisMacro.click(_that, ...params)
          }
          el.on("click", fn)
        }
        return `<span class="macro-${macroArray.length-1}"></span>`
      } catch (e) {
        return `<span class="macro-${macroArray.length-1}">Macro Error: ${e}</span>`
      }

    }
    var out = _that.html.replace(re, replacer)
    return out
  }

  function applyMacros (inEl) {
    macroArray.forEach((el, i) => {
      el.appendTo(inEl.find('span.macro-'+i))
      if (mFuncArray[i]) {
        mFuncArray[i]()
      }
    })
    return inEl
  }

  function removeData (instr) {
    var re = wiki.Item.util().dataRE
    return instr.replace(re, '')
  }


  function handleTags (inHTML) {
    var re = wiki.Item.util().tagRE
    var taglist = nthRegExGrp(re, inHTML, 1)
    inHTML = inHTML.replace(re, '')
    var el = $(inHTML)
    for (var t in taglist) {
      if (taglist.hasOwnProperty(t)) {
        var tag = taglist[t]
        var tagEl = $(`<span class="tag"> ${tag} </span>`)
        el.find('.tag-list').append(tagEl)
      }
    }

    return el
  }


  function insertLinks (el) {
    el.find('a').each(function () {
      debugger
      var el = $(this)
      var target = el.attr('href')
      if (!wiki.Item.util().urlRE.test(target)) {
        el.attr('href', '#')
        el.on('click', function () {
          wiki.showItem(target)
        })
      }
    })
    return el
  }



  if (!_that.el) {
    _that.el = $('<div class="item ' + _that.name + '"></div>')
  }
  $('#content').append(_that.el)

  function finalRender (data) {

    var assetPipe = [
      insertMacros,
      removeData,
      handleTags,
      applyMacros,
      insertLinks,
    ]

    _that.el.empty()
    pipe(null, assetPipe).appendTo(_that.el)

    var editbutton = $(_that.el).find('.edit-button')
    editbutton.on('click', function () {
      _that.edit()
    })

    var closebutton = $(_that.el).find('.close-button')
    closebutton.on('click', function () {
      _that.hide()
    })

    var refreshbutton = $(_that.el).find('.refresh-button')
    refreshbutton.on('click', function () {
      _that.render()
    })

    var copybutton = $(_that.el).find('.copy-button')
    copybutton.on('click', function() {
      wiki.Item.copy(_that.name)
    })
  }

  _that.updateHTML().then(finalRender)
}
