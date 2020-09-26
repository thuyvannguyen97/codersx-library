var express = require('express');
var router = express.Router();

var cookieMiddleware = require('../middlewares/cookie.middleware');

router.get("", (request, response) => {
  response.render('index');
});
router.get("/404", (req, res) => {
  res.render('404');
});
router.get("/500", (req, res) => {
  res.render('500');
});
module.exports = router;