//个人中心的逻辑代码
//1、验证登录，如果没有登录，不会展示个人中心页面
//1、拿到localStorrage内的凭证
const token = window.localStorage.getItem('token')
const id = window.localStorage.getItem('id')

//判断token和id的存在
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
            }else{
                //有用户登录信息
                //展示用户信息----使文本框展示用户信息
                $('form [name=username]').val(res.info.username) // !不懂res.info.username
                $('form [name=nickname]').val(res.info.nickname) 
                $('form [name=age]').val(res.info.age) 
                $('form [name=gender]').val(res.info.gender) 
            }
        }

    })
}

//修改个人信息
$('form').on('submit', function(e){
    e.preventDefault()

    //采集用户信息
    const data = $('form').serialize()
    console.log(data)
    $.ajax({
        url: 'http://localhost:8000/test/update.json',
        method: 'POST',
        data: data + '&id=' +id, // !这是什么
        headers: {
            'Authorization': token
        },
        success (res){
            console.log(res)
            if(res.code === 1){
                window.alert('修改信息成功')
            }

        }
    })
})