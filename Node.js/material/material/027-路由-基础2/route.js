
// const fs =require("fs")
// const route = {
//     "/login":(res)=>{
//         res.writeHead(200, { "Content-Type": "text/html;charset=utf8" })
//         res.write(fs.readFileSync("./static/login.html"), "utf-8")
//     },
//     "/home":(res)=>{
//         res.writeHead(200, { "Content-Type": "text/html;charset=utf8" })
//         res.write(fs.readFileSync("./static/home.html"), "utf-8")
//     },
//     "/404":(res)=>{
//         res.writeHead(404, { "Content-Type": "text/html;charset=utf8" })
//         res.write(fs.readFileSync("./static/404.html"), "utf-8")
//     },
//     "/favicon.ico":(res)=>{
//         res.writeHead(200, { "Content-Type": "image/x-icon;charset=utf8" })
//         res.write(fs.readFileSync("./static/favicon.ico"))
//     }
// }

// module.exports = route

// 封装
const fs =require("fs")

function render(res, path,type=""){
    res.writeHead(200, { "Content-Type": `${type ? type : "text/html"};charset=utf8` })
    res.write(fs.readFileSync(path, "utf-8"))
    res.end()
}
const route = {
    "/login":(res)=>{
        render(res, "./static/login.html")
    },
    "/home":(res)=>{
        render(res, "./static/home.html")
    },
    "/404":(res)=>{
        res.writeHead(404, { "Content-Type": "text/html;charset=utf8" })
        res.write(fs.readFileSync("./static/404.html","utf-8"))

    },
    "/favicon.ico":(res)=>{
        render(res, "./static/favicon.ico","image/x-icon")
    }
}

module.exports = route