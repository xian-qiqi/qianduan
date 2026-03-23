/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */
const express = require("express")

const app = express()

app.get("/",(req,res)=>{
    res.send({
        name:"kerwin",
        age:100
    })
})

app.get("/login",(req,res)=>{
    res.write("login")
    res.end()
})


// app.get("/home",(req,res,next)=>{ // ?多个中间件
//     // 验证用户token过期, cookie过期
   
//     console.log("验证token")
//     const isValid = true
//     if(isValid){
//         next() // *让下一个中间件执行
//     }else{
//         //返回错误
//         res.send("error")
//     }
// },(req,res)=>{  // ?多个中间件
//      // 查询数据库
//     // 返回内容
//     res.send({list:[1,2,3]})
// })
// ?下面只是代码写法的修改
const func1 = (req,res,next)=>{
    // 验证用户token过期, cookie过期
   
    console.log("验证token")
    const isValid = true
    if(isValid){
        res.kerwin="这是fun1计算的结果"  // *给res添加属性，可以在其他中间件中使用
        next()
    }else{
        //返回错误
        res.send("error")
        
    }
}
const func2 = (req,res)=>{
    // 查询数据库
   // 返回内容
   console.log(res.kerwin)
   res.send({list:[1,2,3]})
}
app.get("/home",[func1,func2])

app.get("/list",[func1],(req,res)=>{
    res.send("list")
})




// // *b 是可选的字符，可以匹配到abcd路由，也可以匹配到acd路由
// // *已经废弃了，? 被用作参数修饰符，而不是表示可选字符。
// // app.get("/ab?cd",(req,res)=>{
// //     res.send("ok")
// // })
// // ?使用正则表表达式
// app.get(/\/ab?cd/,(req,res)=>{
//     res.send("ok")
// })

// // get http://aa.com/detail/2222
// //:占位符 满足 ‘/内容’即可打开页面
// // app.get("/ab/:id/:id2",(req,res)=>{
// app.get("/ab/:id/:id2",(req,res)=>{
//     res.send("ok")
// })

// // 匹配 abcd、abbcd、abbbcd等
// // ?新版本无法使用
// // app.get('/ab+cd', function(req, res) {
// //     res.send('ab+cd');
// //   });
// // ?使用正则表达式
// app.get(/\/ab+cd/, (req, res) => {
//   res.send('ab+cd');
// });

// // 匹配 abcd、abxcd、abRABDOMcd、ab123cd等
// // *ab 和 cd 之间可以输入任意内容
// // app.get('/ab*cd', function(req, res) {
// //     res.send('ab*cd');
// // });

// // *cd要不都写，要不都不写
// // ?新版本无法使用
// // app.get('/ab(cd)?e', function(req, res) {
// //     res.send('ab(cd)?e');
// // });
// // ?使用正则表达式
// app.get(/\/ab(cd)?e/, function(req, res) { // !function回调函数，也称为中间件
//     res.send('ab(cd)?e');
// });

// // *正则表达式，必须以fly结尾
// app.get(/.*fly$/, function(req, res) {
//     res.send('/.*fly$/');
// });

app.listen(3000,()=>{
    console.log("server start")
})