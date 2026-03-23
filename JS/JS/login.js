
$('form').on('submit', function(e){
    //阻止默认事件
    e.preventDefault()

    //采集用户信息
    const data = $('form').serialize()
    
    //发送请求
    $.post('http://localhost:8000/test/login.json', data, res => {
        console.log(res)

        if (res.code === 0) {
            //登录失败
            $('form > span').text(res.message).css('display', 'block')
            return 
        }
        //登录成功
        //直接跳转到首页
        // window.location.href = './7.02index.html'

        //把登录过的“凭证”存储起来，为了其他页面使用
        window.localStorage.setItem('token', res.token)
        //把用户的id信息储存起来
        window.localStorage.setItem('id', res.user.id)

        //跳转页面
        window.location.href = './7.02index.html'


    })

})