//详情页的逻辑

//1、验证是否是从列表页跳转过来的
const goodsId = window.localStorage.getItem('goodsId')
const token = window.localStorage.getItem('token')
const id = window.localStorage.getItem('id')
if (!goodsId || !token || !id){
    window.location.href = './7.10list.html'
}

//2、根据商品id请求商品信息
getInfo()
function getInfo(){
    //直接发送请求
    $.get('http://localhost:8000/test/item.json', {id: goodsId}, res=>{
        console.log(res)
        //使用信息进行填充页面
        $('.show > img').prop('src', res.info.img_big_logo)
        $('.info > .title').text(res.info.title)
        $('.info > .price').text(res.info.current_price)
        // 设置加入购物车按钮的商品ID
        $('.add-to-cart').attr('data-goods-id', res.info.goods_id)
    })
}

//3、加入购物车功能
$('.add-to-cart').on('click', function(){
    // 发送加入购物车请求
    $.ajax({
        url: 'http://localhost:8000/test/add.json',
        method: 'POST',
        headers: { 
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            id: id,
            goodsId: goodsId,
            // quantity: 1  // 默认数量为1
        }),
        success: function(res) {
            if (res.code === 1) {
                alert('添加购物车成功！');
                // 可选：跳转到购物车页面
                // window.location.href = './cart.html';
            } else {
                alert('添加失败: ' + res.message);
            }
        },
        error: function() {
            alert('网络错误，请重试');
        }
    });
});