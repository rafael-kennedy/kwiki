module.exports = {
  parseText(text) {
    var re = /(\{\{\w+|\}\})/
    function getUid() {
      var out = 0
      getUid = function() {
        out ++
        return out
      }
      return getUid()
    }

    function closeTag (arr) {
      for (var i = 0; i < tArray.length; i++) {
        var entry = tArray[i]
        if (entry === "{{") {
          
        }

      }
      return {
        content: outArray,
        tag: tag,
        value: value,
        uid: uid
      }
    }

    var tArray = text.split(re)
  }
}
