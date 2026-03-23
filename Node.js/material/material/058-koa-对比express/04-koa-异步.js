
const Koa = require("koa")
const app = new Koa()

app.use(async (ctx, next)=>{
    if(ctx.url==="/favicon.ico") return     
    console.log("11111")
    var mytoken = await next()
    // console.log("44444", ctx.token )  
    console.log("44444", mytoken )  
    ctx.body = "hello world"
})

app.use(async (ctx, next)=>{
    console.log("222222")

    // *异步
    await delay(1000)  //1s后resolve执行
    ctx.token = "sdafa57584a6d" 
    console.log("3333333")

    return "sdafa57584a6d"
})
function delay(time){
    return new Promise((resolve, reject)=>{
        setTimeout(resolve,time)
    })
}

app.listen(3000)