//注册界面的逻辑代码
$('form').on('submit', function(e){
    //阻止默认行为
    e.preventDefault()

    //采集用户信息
    const data = $('form').serialize()
    console.log(data)

    //发送请求
    $.post('http://localhost:8000/test/register.json', data, res =>{
        console.log(res)
        //根据判断结果，来决定是否提示错误
        if(res.code === 0){
            //提示错误
            // 修改这里，显示后端返回的具体错误信息
            $('form > span').text(res.message).css('display', 'block')
            // $('form>span').css('display', 'block')
            return
        }

        //注册成功，跳转页面
        window.alert('恭喜，注册成功，点击确定跳转到登录页')
        window.location.href = './7.03login.html'
    })
})