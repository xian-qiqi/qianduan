/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */
const fs =require("fs")
const path= require("path")
const mime = require('mime');  // CommonJS 的语法
// import mime from 'mime';  ES模块

function render(res,path,type=""){
    res.writeHead(200, { "Content-Type": `${type?type:"text/html"};charset=utf8` })
    res.write(fs.readFileSync(path), "utf-8")
    res.end()
}
const route = {
    "/login":(req,res)=>{
        render(res,"./static/login.html")
    },
    "/":(req,res)=>{
        render(res,"./static/home.html")
    },
    "/home":(req,res)=>{
        render(res,"./static/home.html")
    },
    "/404":(req,res)=>{
        if(readStaticFile(req,res)){
            return
        }
        res.writeHead(404, { "Content-Type": "text/html;charset=utf8" })
        res.write(fs.readFileSync("./static/404.html"), "utf-8")
        res.end()
    },
    // "/favicon.ico":(req,res)=>{
    //     render(res,"./static/favicon.ico","image/x-icon")
    // }  不需要单独写了，它属于静态资源文件里面，function readStaticFile(req,res)一并处理了
}

// !静态资源管理
function readStaticFile(req,res){
    //获取路径
    const myURL = new URL(req.url,"http://127.0.0.1:3000")

    // console.log(__dirname, myURL.pathname)
    const pathname = path.join(__dirname,"/static",myURL.pathname)  // ?文件完整的绝对路径
    console.log(pathname)

    //如果文件存在
    if(myURL.pathname==="/") return false 
    if(fs.existsSync(pathname)){
        //处理显示返回
        // render(res,pathname)  按照默认html模块传递到了前端，css格式无法生效（相当于普通字符串）
        render(res, pathname, mime.getType(myURL.pathname.split(".")[1]))
        // !myURL.pathname对应于"/css/login.css"
        // !.split(".")[1]截取css
        return true
    }else{
        return false
    }
}

module.exports = route