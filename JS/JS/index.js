//首页的逻辑代码
//问题：如何在首页知道我登陆成功了
//通过登陆以后存储的凭证来证明

//1、拿到localStorrage内的凭证
const token = window.localStorage.getItem('token')
const id = window.localStorage.getItem('id')

//判断token和id的存在
if(!token || !id) {
    //表示没有登录
    //不需要展示登录后的信息（把用户昵称展示出来）
    $('.off').addClass('active')
    $('.on').removeClass('active')
}else{
    //登录成功
    getInfo()
}

//请求用户信息
// !看不懂啊！！
function getInfo() {
    $.ajax({
        url: 'http://localhost:8000/test/info.json',
        method: 'GET',
        data: {id: id},
        headers: {
            'Authorization': token
        },
        success (res){
            console.log(res)
            if( res.code !== 1) {
                // !前面不是已经判断过了吗？
                // todo答：因为本地存储的token可能已过期，需要服务器验证
                $('.off').addClass('active')
                $('.on').removeClass('active')
            }else{
                $('.on').addClass('active').find('span').text(res.info.nickname)
                $('.off').removeClass('active')
            }

        }
    })
}


// ?个人中心的跳转
$('button.self').on('click',function() {
    window.location.href = './7.07self.html'
})

// !看不懂啊！！！
// 添加退出登录功能
// 当文档加载完成后执行
//document 指的是从 <html> 开始到 </html> 结束的整个index.html文档对象：
// $(document).ready(function() {
//     // 选择 .on 元素内的最后一个 button，并绑定点击事件
//     $('.on button:last').on('click', function() {
//         console.log('退出登录')
//         // 从本地存储中删除token（登录凭证）
//         window.localStorage.removeItem('token')
//         window.localStorage.removeItem('id')
//         // 刷新页面，让页面重新判断登录状态
//         window.location.reload()
//     })
// })

$('button.logout').on('click', function(){
    //直接发送请求，请求退出
    $.get('http://localhost:8000/test/logout.json', { id : id},res =>{// !这是什么？
        // 答：这是一个GET请求，参数说明：
        // - URL: http://localhost:8000/test/logout.json
        // - 参数: { id: id } 发送用户ID到后端
        // - 回调函数: res => { window.location.reload() }
        //   请求成功后，刷新页面（通常用于清除前端的登录状态）
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('id')
        window.location.reload()
    })
})
