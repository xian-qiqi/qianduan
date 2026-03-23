/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */
const Koa = require("koa")
const Router = require("koa-router")

const app = new Koa()
const router = new Router()

//增
router.post("/list",(ctx, next)=>{
    ctx.body = {
        ok:1,
        info: "add list success" 
    }
})
//获取
router.get("/list",(ctx, next)=>{
    ctx.body = {
        ok:1,
        info: "get list success" 
    }
})
router.put("/list/:id",(ctx, next)=>{
    ctx.body = {
        ok:1,
        info: "put list success" 
    }
})
router.del("/list/:id",(ctx, next)=>{
    ctx.body = {
        ok:1,
        info: "del list success" 
    }
})

app.use(router.routes()).use(router.allowedMethods())
// app.use((ctx, next)=>{
//     ctx.body = "hello world"
// })

app.listen(3000)