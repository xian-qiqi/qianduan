/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */

// !异步（promise）操作文件
const fs = require("fs").promises

fs.readFile("./avatar/a.txt","utf-8").then(data=>{
    console.log(data)
})
