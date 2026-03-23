/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 * 
 * 中间件
        应用级别中间件
        路由级别中间件
        错误处理中间件
        内置中间件
        第三方中间件
 */
const express = require("express")
const app = express()


app.get("/",(req,res)=>{
    res.send({
        name:"kerwin",
        age:100
    })
})

app.get("/login",(req,res)=>{
    res.write("login")
    res.end()
})



const func1 = (req,res,next)=>{
    // 验证用户token过期, cookie过期
   
    console.log("验证token")
    const isValid = true
    if(isValid){
        res.kerwin="这是fun1计算的结果"
        next()
    }else{
        //返回错误
        res.send("error")
        
    }
}
// ?应用级别中间件  ，需要放在前面， 之后所有的app使用get，post等都会执行fun1（验证token）
app.use(func1)
// app.use("/home",func1)  //只响应home路径应用中间件

const func2 = (req,res)=>{
    // 查询数据库
   // 返回内容
   console.log(res.kerwin)
   res.send({list:[1,2,3]})
}
app.get("/home",[func2])
app.get("/list",(req,res)=>{
    res.send("list")
})
app.listen(3000,()=>{
    console.log("server start")
})

