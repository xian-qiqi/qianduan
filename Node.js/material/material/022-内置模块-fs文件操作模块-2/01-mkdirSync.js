/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */

const fs =require("fs")

try {
    // ?同步创建文件
    fs.mkdirSync("./avatar")

} catch (error) {
    console.log("11",error)    
}
//同步
//不删除文件，阻塞后面代码执行