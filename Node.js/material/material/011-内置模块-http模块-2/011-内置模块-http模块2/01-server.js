const { type } = require("os")

var http = require("http")
var moduleRenderHtml = require('./module/renderHTML')
var moduleRenderStatus = require('./module/renderStatus')


//创建服务器
http.createServer((req, res)=>{
    /* 
    ?当你访问 http://localhost:3000/list/010-http(自己随便写的) 时，实际上浏览器发送了两个请求：
        第一个请求：
        URL: /list/010-http
        方法: GET
        这是你主动访问的页面

        第二个请求：
        URL: /favicon.ico
        方法: GET
        这是浏览器自动请求网站图标
        
    */

    if (req.url === '/favicon.ico'){
        return 
    }
    console.log(req.url)

    res.writeHead(moduleRenderStatus.renderStatus(req.url), {"content-type":"text/html; charset=utf-8"})
    res.write(moduleRenderHtml.renderHTML(req.url))
    res.end()
    
}).listen(3000,()=>{ 
    console.log("server start")
})

