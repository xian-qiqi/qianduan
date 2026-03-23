
const express = require("express")
const app = express()

// app.use(async (req, res, next)=>{
//     if(req.url==="/favicon.ico") return     //避免数据打印两遍
//     console.log("11111")
//     await next()  // *没用
//     console.log("44444", res.token )  // ?正常的话，使用上面获取的token，但是因为异步操作，next不等待异步，无法得到token
//     res.send("hello world")
// })

// app.use(async (req, res, next)=>{
//     console.log("222222")

//     // *异步
//     await delay(1000)  //1s后resolve执行
//     res.token = "sdafa57584a6d"  // ?获取token
//     console.log("3333333")
// })
// function delay(time){
//     return new Promise((resolve, reject)=>{
//         setTimeout(resolve,time)
//     })
// }
// app.listen(3000)


app.use((req, res, next)=>{
    if(req.url==="/favicon.ico") return     //避免数据打印两遍
    console.log("11111")
    next()  // *没用
    
})

app.use(async (req, res, next)=>{
    console.log("222222")

    // *异步
    await delay(1000)  //1s后resolve执行
    res.token = "sdafa57584a6d"  // ?获取token
    console.log("3333333")

    console.log("44444", res.token )  // ?正常的话，使用上面获取的token，但是因为异步操作，next不等待异步，无法得到token
    res.send("hello world")
})
function delay(time){
    return new Promise((resolve, reject)=>{
        setTimeout(resolve,time)
    })
}
app.listen(3000)