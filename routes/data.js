const express = require('express')
const router = express.Router()
global.d = require('../data/data.js')
const _ = require('lodash')

function sendJSON (res, data) {
  res.send(JSON.stringify(data))
}

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.query.item) {
    sendJSON(res, d.data[req.query.item])
  } else {
    sendJSON(res, d.data)
  }
})

router.post('/', function (req, res, next) {
  if (req.body.data) {
    var inData = JSON.parse(req.body.data)
  }

  switch (req.body.method) {
    case 'write':
    d.data = inData
    break
    case 'update':
    if (req.body.item) {
      d.data[req.body.item] = inData
    } else {
      d.data = _.merge(d.data, inData)
    }
    break
    case 'delete':
    if (req.body.item) {
      delete d.data[req.body.item]
    }
    break
    default:

  }

  d.save()
  res.send('Updated Successfully')
})

router.get('/list', function (req, res, next) {
  var out = []
  Object.keys(d.data).forEach(v => {
    out.push({
      name: v,
      tags: d.data[v].tags || []
    })
  })
  sendJSON(res, out)
})

router.get('/search', function (req, res, next) {
  let {type, val} = req.query
  
  var out = []
  Object.keys(d.data).forEach(v => {
    out.push({
      name: v,
      tags: d.data[v].tags || []
    })
  })
    if (!type || !val) {
      return sendJSON(res, out)
    } else {
      switch (type) {
        case 'content':
        case 'body':
        out = out.filter(v => {
          return d.data[v.name].body.indexOf(val) !== -1
        })
        break
        case 'name':
        out = out.filter(v => {
          return v.name.indexOf(val) !== -1
        })
        break
        case 'tag':
        case 'tags':
        out = out.filter(v => {
          let comp = v.tags
          if (Array.isArray(val)) {
            return _.difference(val, comp).length === 0
          } else {
            return _.includes(comp, val)
          }
        })
        break
      }
    }
  sendJSON(res, out)
})

module.exports = router
