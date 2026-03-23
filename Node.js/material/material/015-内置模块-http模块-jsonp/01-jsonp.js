/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */
var http = require("http")
var url = require("url")

// !需要在端口传递参数  http://localhost:3000/api/aaa?callback=test
//直接打开http://localhost:3000/api/aaa，函数名test会丢失
http.createServer((req,res)=>{
    var urlobj = url.parse(req.url,true)
    console.log(urlobj.query)
    console.log(urlobj.query.callback)
    switch(urlobj.pathname){
        case "/api/aaa":
            res.end(`${urlobj.query.callback}(${JSON.stringify({
                name:"kerwin",
                age:100
            })})`)
            break;
        default :
            res.end("404")
    }
}).listen(3000)