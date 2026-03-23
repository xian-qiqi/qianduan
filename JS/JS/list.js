//列表页的逻辑代码

//1、请求分类列表，渲染分类位置内容
getCateList()

function getCateList(){
    //直接发送请求
    $.get('http://localhost:8000/test/category.json', res=>{
        console.log(res)
        //渲染分类内容
        let str = `<li class="active">全部</li>`
        res.List.forEach(item => {
            str += `<li>${ item }</li>`
        })
        $('.category').html(str)
    })
}


// 2. 请求商品列表渲染页面
// 2-1. 准备请求需要用到的参数
const info = {
  current: 1,
  pagesize: 12,
  search: '',
  filter: '',
  saleType: 10,
  sortType: 'id',
  sortMethod: 'ASC',
  category: ''
}

// 提前准备变量, 接受一共多少页
let totalPage = 1

// 2-2. 请求列表数据
getGoodsList()
function getGoodsList() {
  // 发送请求
  $.get('http://localhost:8000/test/goods.json', info, res => {
    console.log('API返回的完整数据:', res)
    // 给全局变量赋值
    totalPage = res.total
    // 执行渲染页面的操作了
    bindHtml(res)
  })
}

// 2-3. 渲染页面
function bindHtml(res) {
  // 1. 判断当前页如果是第一页, 那么 left 按钮有 disable 类名
  if (info.current === 1) $('.left').addClass('disable')
  else $('.left').removeClass('disable')

  // 2. 判断当前页如果是最后一页, 那么 right 按钮有 disable 类名
  if (info.current === res.total) $('.right').addClass('disable')
  else $('.right').removeClass('disable')

  // 3. 渲染统计位置
  $('.total').text(`${ info.current } / ${ res.total }`)

  // 4. 渲染一页显示多少条
  $('select').val(info.pagesize)

  // 5. 渲染当前页
  $('.page').val(info.current)

  // 6. 渲染商品列表
  let str = ``
  res.list.forEach(item => {
    str += `
      <li goodsId="${ item.goods_id }">
        <div class="show">
          <img src="${ item.img_big_logo }" alt="">
          ${ item.is_hot ? '<div class="hot">hot</div>' : '' }
          ${ item.is_sale ? '<div class="sale">sale</div>' : '' }
        </div>
        <div class="info">
          <p class="title">${ item.title }</p>
          <p class="price">
            <span class="current">￥ ${ item.current_price }</span>
            <span class="old">￥ ${ item.price }</span>
          </p>
          <button goodsId=${ item.goods_id }>加入购物车</button>
        </div>
      </li>
    `
  })
  $('.list').html(str)
}


//3、各种事件的渲染
//分类按钮
$('.category').on('click', 'li', function(){
  //切换类名
  $(this).addClass('active').siblings().removeClass('active')
  //修改info中的数据
  info.category = $(this).text() === '全部' ? '' : $(this).text()
  //因为切换分类会影响到一共多少页，所以先回归第一页
  info.current = 1
  //重新请求列表数据并渲染
  getGoodsList()
})
//筛选按钮
$('.filter').on('click', 'li', function(){
  //切换类名
  $(this).addClass('active').siblings().removeClass('active')
  //修改info中的数据
  info.filter = $(this).attr('data-type') // !attr('属性名')获取属性名
  info.current = 1
  getGoodsList()
})
//折扣按钮
$('.sale').on('click', 'li', function(){
  //切换类名
  $(this).addClass('active').siblings().removeClass('active')
  //修改info中的数据
  info.saleType = $(this).attr('sale-type') // !attr('属性名')获取属性名
  info.current = 1
  getGoodsList()
})
//排序按钮
$('.sort').on('click', 'li', function(){
  //切换类名
  $(this).addClass('active').siblings().removeClass('active')
  //修改info中的数据
  info.sortType = $(this).attr('sort-type') // !attr('属性名')获取属性名
  info.sortMethod = $(this).attr('method') // !attr('属性名')获取属性名
  info.current = 1
  getGoodsList()
})
//模糊搜索
$('.search').on('input', function(){
  //切换类名
  $(this).addClass('active').siblings().removeClass('active')
  //修改info中的数据
  info.search = $(this).val().trim() // !trim()去空格
  info.current = 1
  getGoodsList()
})
//各种分页信息
$('.left').on('click', function(){
  if($(this).hasClass('disable')) return

  console.log("上一页")
  //修改info中的信息
  info.current--
  getGoodsList()
})
$('.right').on('click', function(){
  if($(this).hasClass('disable')) return

  console.log("下一页")
  //修改info中的信息
  info.current++
  getGoodsList()
})
$('select').on('change', function(){
  //修改info中的信息
  info.pagesize = $(this).val()
  info.current = 1
  getGoodsList()
})
$('.jump').on('click', function(){
  let page = $('.page').val()
  //如果page非数字，直接等于1
  if(isNaN(page)) page = 1
  if(page <= 1) page = 1
  if(page >= totalPage) page = totalPage

  info.current = page
  getGoodsList()
})


//4、加入购物车
$('.list').on('click', 'button', function(e){
  //点击加入购物车时，也会触发跳转详情页的事件
  //阻止事件(跳转到详情页)传播
  e.stopPropagation()
  console.log('加入购物车')
  //验证登录
  const token = window.localStorage.getItem('token')
  const id = window.localStorage.getItem('id')
  if (!token || !id) {
    window.confirm('你还没有登录，请登录后再进行添加操作')
    return
  }
  // 获取商品ID - 先定义 goodsId 变量
  const goodsId = $(this).attr('goodsId')
  console.log('用户ID:', id, '商品ID:', goodsId)

  //发送请求加入购物车
  $.ajax({
    url: 'http://localhost:8000/test/add.json',
    method: 'POST',
    headers: { 
      authorization: token,
    },
    data: JSON.stringify({  // 使用 JSON.stringify
      id: id, 
      goodsId: goodsId  // 修正属性名
    }),
    contentType: 'application/json',  // 添加这行
    success(res){
      console.log(res)
      if (res.code !== 1){
        window.alert('您还没有登录，请登录后再进行操作！')
        return 
      }
      window.alert('加入购物车成功！')
    }
  })
})

//5、切换详情页面
$('.list').on('click', 'li', function(){
  console.log('跳转到详情页')
  //拿到商品id，存储在localstorage内
  //在详情页面就知道点击的哪一个商品跳转过去
  //如何得到id，在渲染页面时（72行）将id信息保存在标签内
  window.localStorage.setItem('goodsId',$(this).attr('goodsId'))
  //跳转页面
  window.location.href = './7.15detail.html'
})
