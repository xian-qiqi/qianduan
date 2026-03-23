
const { EventEmitter } = require("events")
var http = require("http")
var https = require("https")
var url = require("url")

// !
var event = null
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
            event = new EventEmitter()  // !防止多次监听，多次回调
            event.on("play",(data)=>{  // !data来自httpget()里面从网页提取的数据
                console.log(11111)
                res.end(data)  //返回数据给前端网页
            })
            httpget()
            break;
        default :
            res.end("404")
    }
}).listen(3000)


function httpget(cb){
    var data = ""
    https.get(`https://i.maoyan.com/api/mmdb/movie/v3/list/hot.json?ct=%E5%8C%97%E4%BA%AC&ci=1&channelId=4`,(res)=>{
        res.on("data",(chunk)=>{
            data+= chunk
        })

        res.on("end",()=>{
            // console.log(data)
            // cb(data)
            event.emit("play",data)  // !
            // response.end(data)
        })

    })
}