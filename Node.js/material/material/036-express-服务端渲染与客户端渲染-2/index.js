/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */
/*
 * ejs模板---服务器渲染
 */
const express = require("express")
const app = express()
const HomeRouter = require("./route/HomeRouter")
const LoginRouter = require("./route/LoginRouter")

// !配置模板引擎,服务器渲染页面
app.set("views","./views")
app.set("view engine","ejs")

//配置静态资源
app.use(express.static("public"))
app.use("/static",express.static("static"))
//配置解析post参数的-不用下载第三方 ,内置
app.use(express.urlencoded({extended:false})) //post参数解析 - username=kerwin&password=1234格式的数据为json格式（JavaScript 对象）
app.use(express.json()) //post参数- {name:"",age:100}
//应用级别
app.use(function(req,res,next){
    console.log("验证token")
    next()
})
//应用级别
app.use("/home",HomeRouter)
app.use("/login",LoginRouter)


app.use((req,res)=>{
    res.status(404).send("丢了")
})
app.listen(3000,()=>{
    console.log("server start")
})

