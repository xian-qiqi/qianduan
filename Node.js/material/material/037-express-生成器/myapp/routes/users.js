var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // 获取前端cookie
  console.log(req.cookies)
  // 设置前端的cookie值
  res.cookie("age","20")
  res.send('respond with a resource');
});

module.exports = router;
