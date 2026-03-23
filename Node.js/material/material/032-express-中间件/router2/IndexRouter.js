/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */
const express = require("express")

const router = express.Router()  //方法
//路由级别中间件
router.get("/home",(req,res)=>{
    res.send("home")
})

router.get("/login",(req,res)=>{
    res.send("login")
})

module.exports=  router