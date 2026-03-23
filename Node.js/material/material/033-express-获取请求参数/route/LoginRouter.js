/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */
const express = require("express")

const router = express.Router()

//路由级别-响应前端的get请求
router.get("/",(req,res)=>{
    // new URL,（之前的node使用的方法）可对照28中api.js的/api/login学习
    console.log(req.query)
    res.send("login-success")
})

//路由级别-响应前端的post请求
router.post("/",(req,res)=>{
    console.log(req.body) // !必须配置中间件  在index里面配置，必须在使用route之前
    res.send({ok:1})
})

//路由级别-响应前端的put ,delete请求


module.exports=  router