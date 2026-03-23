/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */
const fs = require("fs").promises

// ?异步，无法将文件目录彻底删除
// fs.readdir("./avatar").then((data)=>{
//     data.forEach(item=>{
//         fs.unlink(`./avatar/${item}`)// ?每一个都是promise对象，
//     })
//     fs.rmdir(`./avatar/${item}`)
// })

// // ?promise删除
// fs.readdir("./avatar").then(async (data)=>{
//     // console.log(data)
//     let arr = []
//     data.forEach(item=>{
//         arr.push(fs.unlink(`./avatar/${item}`))
//     })
//     //Promise.all([])

//     await Promise.all(arr)  // ?等待所有异步执行完后
//     await fs.rmdir("./avatar")
// })



// ?上面方法的简化写法
fs.readdir("./avatar").then(async (data)=>{
    // console.log(data)
    // let arr = []
    // data.forEach(item=>{
    //     arr.push(fs.unlink(`./avatar/${item}`))
    // })
    //Promise.all([])

    await Promise.all(data.map(item=>fs.unlink(`./avatar/${item}`)))
    await fs.rmdir("./avatar")
})