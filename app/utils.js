module.exports = {

  pipe (obj, fnArray) {
    var out = obj
    for (var fn in fnArray) {
      if (fnArray.hasOwnProperty(fn)) {
        out = fnArray[fn](out)
      }
    }
  return out
},

  nthRegExGrp (re, str, grpNum) {
    var out = []
    var match = re.exec(str)
    while (match !== null) {
      out.push(match[grpNum])
      match = re.exec(str)
    }
    return out
  }

}
