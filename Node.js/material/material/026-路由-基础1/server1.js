const http = require("http")
const fs = require("fs")

http.createServer((req, res) => {
    //favicon
    if(req.url==="/favicon.ico"){
        // todo 读取本地图标
        return
    }

    const myURL = new URL(req.url, "http://127.0.0.1:3000")
    console.log(myURL.pathname)
    switch(myURL.pathname){
        case "/login1":
            res.writeHead(200,{"content-type": "text/html;charset=utf-8"})
            res.write(fs.readFileSync("./static/login1.html"), "utf-8")
            break;
        case "/home1":
            res.writeHead(200,{"content-type": "text/html;charset=utf-8"})
            res.write(fs.readFileSync("./static/home1.html"), "utf-8")
            break;
        default:
            res.writeHead(404,{"content-type": "text/html;charset=utf-8"})
            res.write(fs.readFileSync("./static/404.html"), "utf-8")
    }
    res.end()
}).listen(3000, ()=>{
    console.log('server start')
})

