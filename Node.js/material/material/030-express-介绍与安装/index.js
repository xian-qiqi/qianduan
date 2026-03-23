/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */
const express = require("express")

const app = express()

app.get("/",(req,res)=>{

    // res.write('hello world')
    // res.end()   // ?node 的写法

    // res.send('hello world')
    //传输代码片段
    // res.send(`
    //     <html>
    //         <h1>hello world</h2>
    //     </html>
    // `)
    // 传输接口
    res.send({
        name:"kerwin",
        age:100
    }) 
})

app.get("/login",(req,res)=>{
    res.write("login")
    res.end()
})

app.listen(3000,()=>{
    console.log("server start")
})