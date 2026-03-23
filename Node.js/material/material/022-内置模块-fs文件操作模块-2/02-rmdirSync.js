/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */
const fs = require("fs")

文件
fs.readdir("./avatar",(err,data)=>{
    // console.log(data)
    data.forEach(item=>{
        // ?同步删除文件
        fs.unlinkSync(`./avatar/${item}`)
    })

    fs.rmdir("./avatar",(err)=>{
        console.log(err)
    })
})