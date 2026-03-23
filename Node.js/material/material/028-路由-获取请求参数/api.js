/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */

function render(res,data,type=""){
    res.writeHead(200, { "Content-Type": `${type?type:"application/json"};charset=utf8` })
    res.write(data)
    res.end()
}
// get
const apiRouter = {
    "/api/login":(req,res)=>{
        //获取参数呢?
        const myURL = new URL(req.url,"http://127.0.0.1")
        console.log(req.url)
        console.log(myURL.searchParams)
        if(myURL.searchParams.get("username")==="xian" && myURL.searchParams.get("password")==="123456"){
            render(res,`{"ok":1}`)
        }else{
            render(res,`{"ok":0}`)
        }
        
    },

    //post
    "/api/loginpost":(req,res)=>{
        //获取参数呢?
        var post = ""
        // 监听机制，不断收集数据
        req.on("data",chunk=>{
            // console.log(chunk)
            post+=chunk
        })

        req.on("end",()=>{
            console.log(post)
            post = JSON.parse(post)  //按照json字符串，解析为json对象
            if(post.username==="xian" && post.password==="123456"){
                render(res,`{"ok":1}`)
            }else{
                render(res,`{"ok":0}`)
            }
        })
    }
}

module.exports = apiRouter