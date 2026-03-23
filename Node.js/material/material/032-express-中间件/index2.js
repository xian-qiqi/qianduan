/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */

const express = require("express")
const app = express()
const IndexRouter = require("./router2/IndexRouter")
//应用级别中间件---挂在app上的
app.use(function(req,res,next){
    console.log("验证token")
    next()
})
//应用级别中间件
app.use("/api",IndexRouter) //（路由模块）

app.listen(3000,()=>{
    console.log("server start")
})

