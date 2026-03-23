/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */
const express = require("express")
const app = express()

app.use((req, res, next)=>{
    if(req.url==="/favicon.ico") return     //避免数据打印两遍
    console.log("11111")
    next()
    console.log("33333")
    res.send("hello world")
})

app.use((req, res, next)=>{
    console.log("2222")
})
app.listen(3000)


// app.use((req, res, next)=>{
//     if(req.url==="/favicon.ico") return     //避免数据打印两遍
//     console.log("11111")
//     next()
    
// })

// app.use((req, res, next)=>{
//     console.log("2222")
//     console.log("33333")
//     res.send("hello world")
// })
// app.listen(3000)