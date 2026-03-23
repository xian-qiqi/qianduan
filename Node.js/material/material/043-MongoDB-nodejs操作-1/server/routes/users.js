var express = require('express');
var router = express.Router();
const UserModel = require('../model/UserModel');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/user/add', function(req, res, next) {
  //插入数据库
  // 1. 创建一个模型(user,限制filed类型), 一一对应数据库的集合(users)
  // user.create user.find user.delete user.update
  //实现复用----代码在model文件夹下
  const {username, password, age} = req.body
  UserModel.create({
    username, password, age
  }).then(data =>{  // !不能是res
    console.log(data)
    res.send({
    ok:1
  })
  })
  
});

module.exports = router;
