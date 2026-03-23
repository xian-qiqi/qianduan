var express = require('express');
const JWT = require('../util/JWT');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //判断 req.session.user
    res.render('index', { title: 'Express' });
  
});

/*测试 token的 加密与验证过程*/
// const jwt = require('jsonwebtoken');
// var token = jwt.sign({  // *sign加密

//   data:'kerwin'
// // },'anydata',{expiresIn: 10000});  // !设置token有效期为10秒
// },'anydata',{expiresIn: '10s'});  // !设置token有效期为10秒
// console.log(token)

// var decoded = jwt.verify(token, 'anydata');  // *verify解密
// console.log(decoded)

// setTimeout(()=>{ // ?检测10s后，地第11s是否有效
//   var decoded = jwt.verify(token, 'anydata');
//   // console.log(decoded)  // ?token有效，出错了
//   console.log(decoded)  // 设置为10s，对了
// }, 11000)

// *封装
const token = JWT.generate({name:"kerwin"},"10s")

console.log(JWT.verify(token))

setTimeout(()=>{
  console.log(JWT.verify(token))

},9000)

setTimeout(()=>{
  console.log(JWT.verify(token))

},11000)

module.exports = router;
