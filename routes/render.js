var express = require('express');
var router = express.Router();
var helpers = require('handlebars-helpers')()


router.get('/', function (req, res, next) {
  var local = d.data[req.query.item]
  local['layout'] = false
  res.render('items/' + req.query.template, local);
});

module.exports = router;
