var http = require("http")
const { type } = require("os")

//创建服务器
http.createServer((req, res)=>{  // !接受回调函数
    //接受浏览器传的参数，返回渲染的内容

    // req接浏览器传来的参数
    //res返回渲染的内容

    //1、
    // res.write('hello world1111')
    // res.write('hello world2222')
    // res.end()


    //2、
    //只能传json字符串格式，不能传数组
    // res.end("[1, 2, 3]")   // ?结束，不写的话，浏览器一直等待


    //3、可以解析前端标签
    // !都写上--使浏览器可以将test解析为html标签
    //以前必须写，现在不写也一样
    res.writeHead(200, {"content-type":"text/html; charset=utf-8"})

    //普通文本展示
    // res.writeHead(200, {"content-type":"text/plain"})
    // ?后端可以正常处理请求返回200，不能正常处理请求返回404(浏览器会返回404)
    // res.writeHead(404, {"content-type":"text/plain"})

    res.write(`
        <html>    
            <b>hello world</b>
        </html>    
    `)
    // ?不能是中文，会出现乱码,在writeHead()里面添加charset=utf-8可以输入中文
    res.write(`
        <html>    
            <b>加粗</b>  
        </html>    
    `)

    res.end()
    
}).listen(3000,()=>{  // !端口号3000 ，不要与本地服务器重复
    console.log("server start")
})