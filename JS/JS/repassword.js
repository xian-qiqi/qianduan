//修改密码的逻辑代码
//1、验证登录
const token = window.localStorage.getItem('token')
const id = window.localStorage.getItem('id')
if(!token || !id) {
    window.location.href = './7.03login.html'
}else{
    //登录成功
    getInfo()
}

//请求用户信息
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
            if (res.code !==1 ) {
                window.location.href = './7.03login.html'
                return 
            }
        }

    })
}

//表单提交发送请求
$('form').on('submit', function(e){
    e.preventDefault()
    const data = $('form').serialize()
    console.log(data)
    $.ajax({
        url: 'http://localhost:8000/test/rpwd.json',
        method: 'POST',
        data: data + '&id=' +id, // !这是什么
        headers: {
            'Authorization': token
        },
        success (res){
            console.log(res)

            if(res.code !== 1){
                $('form > span').text(res.message).css('display', 'block')
            }else{
                window.alert('密码修改成功,点击跳转登录页')
                // 清除本地存储的登录信息
                // window.localStorage.removeItem('token')
                // window.localStorage.removeItem('id')
                window.location.href = './7.03login.html'
            }
            

        }
    })
})
