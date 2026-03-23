var express = require('express');
const UserModel = require('../model/UserModel');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//响应前端的post请求-增加用户
router.post("/user",(req,res)=>{
  console.log(req.body)
  //插入数据库
  // 1. 创建一个模型(user,限制filed类型), 一一对应数据库的集合(users)
  // user.create user.find user.delete user.update
  const {username,password,age} = req.body  // 解构前端数据
  // 后端使用UserModel将数据写入MongoDB数据库
  UserModel.create({
    username,password,age
  }).then(data=>{
    console.log(data)
    res.send({
      ok:1
    })
  })
})
//动态路由, 获取id   修改数据
router.put("/user/:myid",(req,res)=>{
  console.log(req.body,req.params.myid)
  const {username,age,password} = req.body
  UserModel.updateOne({_id:req.params.myid},{
    username,age,password
  }).then(data=>{
    res.send({
      ok:1
    })
  })
  
})

//删除数据
router.delete("/user/:id",(req,res)=>{

  UserModel.deleteOne({
    _id:req.params.id
  }).then(data=>{
    res.send({
      ok:1
    })
  })
})

//查询数据
router.get("/user",(req,res)=>{
  console.log(req.query)
  const {page,limit} = req.query
  UserModel.find({},["username","age"]).sort({age:-1}).skip((page-1)*limit).limit(limit).then(data=>{
    res.send(data)
  })
})

module.exports = router;
