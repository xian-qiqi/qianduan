
const http = require("http")
const route = require("./route")
const api = require("./api")
// 将api接口和route（静态和图标路径）合并在一起，再进行前端渲染
const Router = {}

// !需要添加路由的话，调用use方法即可
function use(obj){
    Object.assign(Router, obj)
}

// http.createServer((req, res) => {
//     //favicon
//     const myURL = new URL(req.url, "http://127.0.0.1")
//     console.log(myURL.pathname)
    
//     try{
//         route[myURL.pathname](res)
//     }catch(error){
//         route["/404"](res)
//     }
    
//     res.end()
// }).listen(3000, () => {
//     console.log("server start")
// })

// ?封装
function start(){
    http.createServer((req, res) => {
        //favicon
        const myURL = new URL(req.url, "http://127.0.0.1")
        console.log(myURL.pathname)
        
        try{
            Router[myURL.pathname](res)
        }catch(error){
            Router["/404"](res)
        }
        
        // res.end()
    }).listen(3000, () => {
        console.log("server start")
    })
}

exports.start = start
exports.use = use