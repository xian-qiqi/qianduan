/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */
const fs = require("fs")

fs.readdir("./avatar",(err,data)=>{
    // console.log(data)
    data.forEach(item=>{
        fs.unlink(`./avatar/${item}`,(err)=>{})
    })

    fs.rmdir("./avatar",(err)=>{
        console.log(err)
    })
})

// !无法删除文件目录，因为是异步操作，在目录里面的文件并没有删除干净，导致fs.rmdir("./avatar",(err)=>{出现“不为空”的情况，无法彻底删除目录avatar