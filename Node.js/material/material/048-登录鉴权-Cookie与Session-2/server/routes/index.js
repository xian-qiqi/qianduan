var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //判断 req.session.user
    // if (req.session.user){
    //   res.render('index', { title: 'Express' });
    // }else{
    //   res.redirect('/login')
    // }  // ?不这样写--每一个接口都需要session过期校验，接口多的话，每一个都写很麻烦----写一个校验中间件来解决这个问题，再app.js 中，全局应用这个应用级别中间件
    
  res.render('index', { title: 'Express' });
});

module.exports = router;
