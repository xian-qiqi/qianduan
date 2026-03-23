/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */
const fs =require("fs")
const route = {
    "/login1":(res)=>{
        res.writeHead(200, { "Content-Type": "text/html;charset=utf8" })
        res.write(fs.readFileSync("./static/login1.html"), "utf-8")
    },
    "/home1":(res)=>{
        res.writeHead(200, { "Content-Type": "text/html;charset=utf8" })
        res.write(fs.readFileSync("./static/home1.html"), "utf-8")
    },
    "/404":(res)=>{
        res.writeHead(404, { "Content-Type": "text/html;charset=utf8" })
        res.write(fs.readFileSync("./static/404.html"), "utf-8")
    }
}

module.exports = route