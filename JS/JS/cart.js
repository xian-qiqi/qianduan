//购物车页面逻辑
//验证登录
const token = window.localStorage.getItem('token')
const id = window.localStorage.getItem('id')

if (!token || !id) {
    window.location.href = './7.03login.html' 
}else{
    getCatrList()
}

//2、获取购物车列表
function getCatrList(){
    $.ajax({
        url: 'http://localhost:8000/test/list.json',
        method: 'GET',
        data: {id: id},
        headers: {authorization: token},
        success(res){
            // console.log(res.cart)
            if (res.code !== 1){
                window.location.href = './7.03login.html' 
                return
            }

            //渲染页面
            bindHtml(res)
        }
    })
}
//3、渲染页面
function bindHtml(res){
    //判断渲染empty还是list标签
    if (!res.cart.length) {
     $('.empty').addClass('active')
     $('.list').removeClass('active')
     return
    }
    //有购物车数据，渲染页面
    console.log(res.cart)

    //统计数据
    //多少种商品，一共有多少个被选中，总价
    let selectNum = 0, totalPrice = 0, totalNum = 0
    res.cart.forEach(item =>{
        if (item.is_select){
            selectNum++
            totalNum += item.cart_number
            totalPrice += item.cart_number * item.current_price
        }
    })

    let str = `
        <div class="top">
            全选 <input class="selectAll" type="checkbox" ${selectNum === res.cart.length ? 'checked' : ''}>
        </div>
    `
    res.cart.forEach(item =>{
        str += `
        <ul class="center">
            <li>
                <div class="select">
                    <input type="checkbox" ${item.is_select ? 'checked' : ''} goodsId=" ${item.goods_id}">
                </div>
                <div class="show">
                    <img src="${item.img_small_logo}" alt="">
                </div>
                <div class="title">${item.title}</div>
                <div class="price">￥ ${item.current_price}</div>
                <div class="number">
                    <button class="sub" goodsId=" ${item.goods_id}">-</button>
                    <input type="text" value="${item.cart_number}"  class="cart_number" goodsId=" ${item.goods_id}">
                    <button class="add" goodsId=" ${item.goods_id}">+</button>
                </div>
                <div class="subprice">￥ ${(item.current_price*item.cart_number).toFixed(2)}</div>  
                
                <div class="destory">
                    <button class="del" goodsId=" ${item.goods_id}">删除</button>
                </div>   
            </li>
        </ul>
    `})

    str += `
        <div class="buttom">
            <p>
                共计 <span>${ totalNum }</span> 件商品
            </p>

            <div class="btns">
                <button class="clear">清空购物车</button> 
                <button class="clear_complete" ${ selectNum ===0 ? 'disabled' : ''}>删除所有已选中</button>
                <button class="pal" ${ selectNum ===0 ? 'disabled' : ''}>去支付</button>
            </div>
            
            <p>
                共计 ￥ <span>${ totalPrice.toFixed(2) }</span>
            </p>
        </div>
    `
    $('.list').html(str)
}


//4、各种点击事件
//修改单一商品选中
$('.list').on('click', '.center .select input', function(){
    console.log('修改选中状态')
    //拿到对应的信息，发送请求
    $.ajax({
        url: 'http://localhost:8000/test/select.json',
        method: 'POST',
        headers: { authorization: token },
        data: { id: id, goodsId: $(this).attr('goodsId') },
        success (res) {
            console.log(res)
        }
    })
    //重新渲染页面
    getCatrList()
})

//修改单一商品数量增加
$('.list').on('click', '.center .number .add', function(){
    //拿到对应的信息，发送请求
    $.ajax({
        url: 'http://localhost:8000/test/number.json',
        method: 'POST',
        headers: { authorization: token },
        data: {
            id: id,
            goodsId: $(this).attr('goodsId'),
            // number: $('.cart_number').val() - 0 + 1
            number: $(this).prev().val() - 0 + 1  // !这里this是指？
        }
        
    })
    //重新渲染页面
    getCatrList()
})
//修改单一商品数量减少
$('.list').on('click', '.center .number .sub', function(){
    //拿到对应的信息，发送请求
    $.ajax({
        url: 'http://localhost:8000/test/number.json',
        method: 'POST',
        headers: { authorization: token },
        data: {
            id: id,
            goodsId: $(this).attr('goodsId'),
            // number: $('.cart_number').val() - 0 + 1
            number: $(this).next().val() - 0 - 1  // !这里this是指？
        }
        
    })
    //重新渲染页面
    getCatrList()
})
//修改单一商品数量--input
$('.list').on('input', '.center .number .cart_number', function(){
    let newQuantity = parseInt($(this).val());
    if (newQuantity < 1) {
        newQuantity = 1;  // 修正为数值1
        $(this).val(1);   // 设置输入框显示为1
        // 不要return，继续执行发送请求，不然直接返回，商品的价格无法跟随number进行改变
    }
    //拿到对应的信息，发送请求
    $.ajax({
        url: 'http://localhost:8000/test/number.json',
        method: 'POST',
        headers: { authorization: token },
        data: {
            id: id,
            goodsId: $(this).attr('goodsId'),
            // number: $('.cart_number').val() - 0 + 1
            number: newQuantity
        }
        
    })
    //重新渲染页面
    getCatrList()
})

//删除单一商品
$('.list').on('click', '.center .del', function(){
    //拿到对应的信息，发送请求
    $.ajax({
        url: 'http://localhost:8000/test/remove.json',
        method: 'GET',
        headers: { authorization: token },
        data: {
            id: id,
            goodsId: $(this).attr('goodsId'),
        }
        
    })
    //重新渲染页面
    getCatrList()
})

//全选商品
$('.list').on('click', '.selectAll', function(){
    //拿到对应的信息，发送请求
    //拿到自己的选中状态
    const type = $(this).prop('checked') ? 1 : 0  // !prop()用法
    $.ajax({
        url: 'http://localhost:8000/test/all.json',
        method: 'POST',
        headers: { authorization: token },
        data: {
            id: id,
            type: type
        }
        
    })
    //重新渲染页面
    getCatrList()
})

//清空购物车
$('.list').on('click', '.clear', function(){
    $.ajax({
        url: 'http://localhost:8000/test/clear.json',
        method: 'GET',
        headers: { authorization: token },
        data: {
            id: id
        }    
    })
    //重新渲染页面
    getCatrList()
})

//删除所有已选中
$('.list').on('click', '.clear_complete', function(){
    $.ajax({
        url: 'http://localhost:8000/test/removeselect.json',
        method: 'GET',
        headers: { authorization: token },
        data: {
            id: id
        }    
    })
    //重新渲染页面
    getCatrList()
})
//去支付
$('.list').on('click', '.pay', function(){
    //在这里就不写去支付页面了，方法同上面一样
    console.log('去支付')
    
})