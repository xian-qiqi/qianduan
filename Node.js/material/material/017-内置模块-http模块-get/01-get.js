/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */
var http = require("http")
var https = require("https")
var url = require("url")

// !流程：猫眼API数据 → cb(data) → res.end(data) → 客户端
//cb(data) 触发了向客户端的响应，res.end(data)将猫眼数据传入客户端

// #
/* 
当调用 httpget(cb) 时，cb 就是这个函数：
cb = function(data) {
    res.end(data)  // 将数据发送给客户端
}
*/

http.createServer((req,res)=>{
    var urlobj = url.parse(req.url,true)
    // console.log(urlobj.query.callback)

    res.writeHead(200,{
        "Content-Type":"application/json;charset=utf-8",
        //cors头，
        "access-control-allow-origin":"*"
    })

    switch(urlobj.pathname){
        case "/api/aaa":
            //客户端 去猫眼要数据

            // *httpget(res)也可以
            // ?回调函数
            httpget((data)=>{
                res.end(data)
            })
            break;
        default :
            res.end("404")
    }
}).listen(3000)



// ?server找猫眼
function httpget(cb){
    var data = ""
    https.get(`https://i.maoyan.com/api/mmdb/movie/v3/list/hot.json?ct=%E5%8C%97%E4%BA%AC&ci=1&channelId=4`,(res)=>{
        res.on("data",(chunk)=>{
            data+= chunk
        })

        res.on("end",()=>{
            console.log(data)
            // ?cb即等于回调函数
            cb(data)
            // *response.end(data)也可以
        })

    })
}