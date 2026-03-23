from flask import Flask, request, jsonify
import time
import os
import json
app = Flask(__name__)

# 手动处理跨域的装饰器
@app.after_request
def after_request(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

# 处理 OPTIONS 预检请求
@app.route('/test/register.json', methods=['OPTIONS'])
@app.route('/test/login.json', methods=['OPTIONS'])
def handle_options():
    return '', 200

# 添加OPTIONS预检请求处理
@app.route('/test/info.json', methods=['OPTIONS'])
def handle_info_options():
    return '', 200

# # 用户数据文件路径
USERS_PATH = 'users.json'

# 加载用户数据函数
def load_users():
    """加载用户数据"""
    with open(USERS_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

# 保存用户数据函数
def save_users(users_data):
    """保存用户数据"""
    with open(USERS_PATH, 'w', encoding='utf-8') as f:
        json.dump(users_data, f, ensure_ascii=False, indent=4)

# 初始化用户数据
users_data = load_users()
users_db = users_data.get('users_db', [])


# 自动计算下一个用户ID（考虑最大ID）
def get_next_user_id():
    if not users_db:
        return 1
    return max(user['id'] for user in users_db) + 1

# 初始化用户ID计数器
user_id_counter = get_next_user_id()

@app.route('/test/register.json', methods=['POST'])
def register():
    """
    处理用户注册请求
    """
    try:
        global user_id_counter, users_db
        
        # 获取前端提交的数据
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '').strip()
        rpassword = request.form.get('rpassword', '').strip()
        nickname = request.form.get('nickname', '').strip()
    
        if not username or not password or not rpassword or not nickname:
            return jsonify({
                'code': 0,
                'message': '注册失败，请填写完整信息！'
            })
        
        # 检查密码是否一致
        if password != rpassword:
            return jsonify({
                'code': 0,
                'message': '注册失败，两次输入的密码不一致！'
            })
        
        # 检查用户名是否已存在
        for user in users_db:
            if user['username'] == username:
                return jsonify({
                    'code': 0,
                    'message': '注册失败，该用户名已存在，请更换后重试！'
                })
        
        # 注册成功，将用户添加到数据库
        new_user = {
            'id': user_id_counter,
            'username': username,
            'password': password,
            'nickname': nickname,
            'age': '',
            'gender': '',
            'identity': '学生',
            'createTime': int(time.time() * 1000)  # 当前时间戳
        }
        users_db.append(new_user)
        user_id_counter += 1
        
        # 保存到文件
        users_data['users_db'] = users_db
        save_users(users_data)
        
        print(f"新用户注册成功: {username}")
        print(f"当前用户数: {len(users_db)}")
        
        return jsonify({
            'code': 1,
            'message': '注册成功！'
        })
        
    except Exception as e:
        print(f"注册过程中发生错误: {e}")
        return jsonify({
            'code': 0,
            'message': '注册失败，服务器发生错误！'
        })

@app.route('/test/login.json', methods=['POST'])
def login():
    """
    处理用户登录请求
    """
    try:
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '').strip()
        
        # 1. 首先检查用户名和密码是否为空
        if not username or not password:
            return jsonify({
                'code': 0,
                'message': '登录失败，请输入用户名和密码！'
            })  # 统一返回 0 表示失败
        
        # 2. 初始化用户查找标志
        user_found = False
        
        # 3. 验证用户名和密码
        for user in users_db:
            if user['username'] == username and user['password'] == password:
                user_found = True
                return jsonify({
                    'code': 1,
                    'message': '恭喜你，登录成功了！^_^',
                    'tips': '登录有效期是 1.00 个小时，你的登录状态会在 1.00 个小时后自动注销',
                    'token': 'eyJhbGciOiJIUzIIMizInRScCI6IkpxVC19.eyJpZCIGCwYa..yOPF9.VQfV392Kk_13zz3-B8CJw9ZIY6xZnZMCsY7ehffnv8',
                    'user': {
                        'msg': '这是你目前登录的账户的信息，喵，给你 ~_~ !',
                        'id': user['id'],
                        'username': user['username'],
                        'nickname': user['nickname'],
                        'createTime': user['createTime'],
                        'age': user['age'],
                        'gender': user['gender'],
                        'identity': user['identity']
                    }
                })  # 登录成功
        
        # 4. 如果循环结束都没有找到匹配的用户
        if not user_found:
            return jsonify({
                'code': 0,
                'message': '登录失败，用户名或密码错误，请重新登录！'
            })  # 登录失败
        
    except Exception as e:
        print(f"登录过程中发生错误: {e}")
        return jsonify({
            'code': 0,
            'message': '登录失败，服务器发生错误！'
        })


@app.route('/test/info.json', methods=['GET'])
def get_user_info():
    """
    获取用户信息（需要token验证）
    """
    try:
        # 从请求头获取token
        auth_header = request.headers.get('Authorization')
        
        # 检查是否有Authorization头
        if not auth_header:
            return jsonify({
                'code': 401,
                'message': "你的 请求头 里面没有 'authorization' 字段 (^o^)/~",
                'tips': "请检查你是否设置了请求头信息，检查单词是否正确 !!! 注意空格问题 !!!"
            }), 401  # !这401是干什么？
        
        # 获取用户ID参数
        user_id = request.args.get('id')
        if not user_id:
            return jsonify({
                'code': 0,
                'message': '缺少用户ID参数'
            })
        
        # 将user_id转换为整数
        try:
            user_id = int(user_id)
        except ValueError:
            return jsonify({
                'code': 0,
                'message': '用户ID格式错误'
            })
        
        # 查找用户
        user_found = None
        for user in users_db:
            if user['id'] == user_id:
                user_found = user
                break
        
        if not user_found:
            return jsonify({
                'code': 0,
                'message': '用户不存在'
            })
        
        # 返回用户信息（排除密码等敏感信息）
        return jsonify({
            'code': 1,
            'message': '获取用户信息成功！^ ^',
            'info': {
                'id': user_found['id'],
                'username': user_found['username'],
                'nickname': user_found['nickname'],
                'age': user_found['age'],
                'gender': user_found['gender'],
                'identity': user_found['identity'],
                'createTime': user_found['createTime'],
                'updateTime': user_found.get('updateTime', user_found['createTime'])
            }
        })
        
    except Exception as e:
        print(f"获取用户信息过程中发生错误: {e}")
        return jsonify({
            'code': 0,
            'message': '获取用户信息失败，服务器发生错误！'
        })

@app.route('/test/logout.json', methods=['GET', 'POST', 'OPTIONS'])
def logout():
    """
    处理用户退出登录请求
    """
    try:
        # 获取用户ID参数
        user_id = request.args.get('id') or request.form.get('id')
        
        if not user_id:
            return jsonify({
                'code': 0,
                'message': '退出失败，缺少用户ID参数'
            })
        
        # 将user_id转换为整数
        try:
            user_id = int(user_id)
        except ValueError:
            return jsonify({
                'code': 0,
                'message': '用户ID格式错误'
            })
        
        # 验证用户是否存在
        user_exists = any(user['id'] == user_id for user in users_db)
        
        if not user_exists:
            return jsonify({
                'code': 0,
                'message': '退出失败，用户不存在'
            })
        
        # 在实际项目中，这里可能会：
        # 1. 将token加入黑名单
        # 2. 清除服务器端的session
        # 3. 记录退出日志
        # 4. 清除缓存中的用户信息
        
        print(f"用户 {user_id} 退出登录")
        
        return jsonify({
            'code': 1,
                'message': '退出登录成功！',
            'tips': '您已安全退出系统，欢迎下次使用 ^_^'
        })
        
    except Exception as e:
        print(f"退出登录过程中发生错误: {e}")
        return jsonify({
            'code': 0,
            'message': '退出登录失败，服务器发生错误！'
        })

# 添加 update 的 OPTIONS 预检请求处理
@app.route('/test/update.json', methods=['OPTIONS'])
def handle_update_options():
    return '', 200

@app.route('/test/update.json', methods=['POST'])
def update_user_info():
    """
    更新用户信息
    """
    try:
        # 从请求头获取token
        auth_header = request.headers.get('Authorization')
        
        # 检查是否有Authorization头
        if not auth_header:
            return jsonify({
                'code': 0,
                'message': '修改失败，未授权访问'
            })
        
        # 获取用户ID
        user_id = request.form.get('id')
        if not user_id:
            return jsonify({
                'code': 0,
                'message': '修改失败，缺少用户ID'
            })
        
        # 将user_id转换为整数
        try:
            user_id = int(user_id)
        except ValueError:
            return jsonify({
                'code': 0,
                'message': '用户ID格式错误'
            })
        
        # 查找用户
        user_found = None
        for user in users_db:
            if user['id'] == user_id:
                user_found = user
                break
        
        if not user_found:
            return jsonify({
                'code': 0,
                'message': '修改失败，用户不存在'
            })
        
        # 获取要更新的字段
        nickname = request.form.get('nickname', '').strip()
        age = request.form.get('age', '').strip()
        gender = request.form.get('gender', '').strip()
        
        # 检查必填字段
        if not nickname:
            return jsonify({
                'code': 0,
                'message': '修改失败，昵称不能为空'
            })
        
        # 更新用户信息
        user_found['nickname'] = nickname
        user_found['age'] = age
        user_found['gender'] = gender
        user_found['updateTime'] = int(time.time() * 1000)  # 更新时间戳

        # 保存到文件（关键修改）
        users_data['users_db'] = users_db
        save_users(users_data)
        
        print(f"用户 {user_id} 信息已更新")
        print(f"- 新昵称: {nickname}")
        print(f"- 新年龄: {age}")
        print(f"- 新性别: {gender}")
        
        return jsonify({
            'code': 1,
            'message': '个人信息修改成功！'
        })
        
    except Exception as e:
        print(f"修改用户信息过程中发生错误: {e}")
        return jsonify({
            'code': 0,
            'message': '修改失败，服务器发生错误！'
        })

# 添加修改密码的 OPTIONS 预检请求处理
@app.route('/test/rpwd.json', methods=['OPTIONS'])
def handle_rpwd_options():
    return '', 200

@app.route('/test/rpwd.json', methods=['POST'])
def change_password():
    """
    修改用户密码
    """
    try:
        # 从请求头获取token
        auth_header = request.headers.get('Authorization')
        
        # 检查是否有Authorization头
        if not auth_header:
            return jsonify({
                'code': 0,
                'message': '修改失败'
            })
        
        # 获取用户ID
        user_id = request.form.get('id')
        if not user_id:
            return jsonify({
                'code': 0,
                'message': '修改失败'
            })
        
        # 获取密码相关字段（修正字段名）
        old_password = request.form.get('oldpassword', '').strip()  # 改为 oldpassword
        new_password = request.form.get('newpassword', '').strip()  # 改为 newpassword
        confirm_password = request.form.get('rnewpassword', '').strip()  # 改为 rnewpassword
        
        # 检查必填字段
        if not old_password or not new_password or not confirm_password:
            return jsonify({
                'code': 0,
                'message': '修改失败，请填写完整信息'
            })
        
        # 检查新密码和确认密码是否一致
        if new_password != confirm_password:
            return jsonify({
                'code': 0,
                'message': '修改失败，两次输入的新密码不一致'
            })
        
        # 检查新密码是否与原密码相同
        if old_password == new_password:
            return jsonify({
                'code': 0,
                'message': '修改失败，新密码不能与原密码相同'
            })
        
        # 查找用户并验证原密码
        user_found = None
        for user in users_db:
            if str(user['id']) == str(user_id):
                user_found = user
                break
        
        if not user_found:
            return jsonify({
                'code': 0,
                'message': '修改失败'
            })
        
        # 验证原密码是否正确
        if user_found['password'] != old_password:
            return jsonify({
                'code': 0,
                'message': '修改失败，原密码错误'
            })
        
        # 更新密码
        user_found['password'] = new_password
        user_found['updateTime'] = int(time.time() * 1000)  # 更新时间戳
        
        print(f"用户 {user_id} 密码已修改")
        
        return jsonify({
            'code': 1,
            'message': '密码修改成功'
        })
        
    except Exception as e:
        print(f"修改密码过程中发生错误: {e}")
        return jsonify({
            'code': 0,
            'message': '修改失败，服务器发生错误'
        })

# 处理 OPTIONS 预检请求
@app.route('/test/category.json', methods=['OPTIONS'])
def handle_category_options():
    return '', 200

@app.route('/test/category.json', methods=['GET'])
def get_category():
    """
    获取分类列表 - 返回与图片中完全相同的格式
    """
    try:
        # 按照图片中的数据结构创建分类列表
        category_list = [
            "其他",
            "内衣配饰", 
            "大家电",
            "海外购",
            "重装玩具",
            "珠宝首饰",
            "智能设备",
            "钟表眼镜",
            "皮具箱包",
            "邮币乐器",
            "手机相机",
            "电脑办公",
            "厨卫电器",
            "食品酒水",
            "居家生活",
            "厨房电器",
            "生活电器",
            "个护健康",
            "烹饪厨具",
            "家装建材",
            "奶粉尿裤",
            "热门推荐",
            "男装",
            "男鞋",
            "女装",
            "女鞋",
            "汽车生活"
        ]
        
        # 创建与图片中完全相同的响应格式
        response_data = {
            'message': '获取分类列表成功',
            'code': 1,
            'List': category_list
        }
        
        return jsonify(response_data)
        
    except Exception as e:
        print(f"获取分类列表过程中发生错误: {e}")
        return jsonify({
            'code': 0,
            'message': '获取分类列表失败'
        })

import os

# shop.py 和 goods.json 在同一个 test 文件夹内
GOODS_PATH = os.path.join(os.path.dirname(__file__), 'goods.json')

@app.route('/test/goods.json', methods=['GET'])
def get_goods():
    try:
        # 添加路径调试
        print(f"文件路径: {GOODS_PATH}")
        print(f"文件是否存在: {os.path.exists(GOODS_PATH)}")
        print(f"当前目录: {os.path.dirname(__file__)}")
        
        if not os.path.exists(GOODS_PATH):
            return jsonify({'code': 404, 'msg': f'文件不存在: {GOODS_PATH}'})
        
        # 读取商品数据
        with open(GOODS_PATH, 'r', encoding='utf-8') as f:
            all_goods = json.load(f)
        
        # 获取分页参数
        page = int(request.args.get('current', 1))
        page_size = int(request.args.get('pagesize', 12))
        category = request.args.get('category', '').strip()
        filter_type = request.args.get('filter', '').strip()  # 获取筛选类型
        sale_type = request.args.get('saleType', '').strip()  # 获取折扣类型（5,6,7,8,9,10）
        sort_type = request.args.get('sortType', 'id').strip()  # 排序字段（id/price/sale）
        sort_method = request.args.get('sortMethod', 'ASC').strip()  # 排序方式（ASC/DESC）
        search = request.args.get('search', '').strip()  # 获取搜索关键词


        # 打印接收到的参数
        print(f"接收参数 - 页码: {page}, 每页: {page_size}, 分类: {category}")
        
        # 根据分类筛选商品
        filtered_goods = all_goods
        
        # 如果选择了分类（且不是"全部"），则进行筛选
        if category and category != '全部':
            filtered_goods = []
            for goods in all_goods:
                # 检查商品是否有分类字段，并且匹配选择的分类
                if goods.get('category') == category:
                    filtered_goods.append(goods)
            
            print(f"分类 '{category}' 筛选后商品数量: {len(filtered_goods)}")
        else:
            print(f"未进行分类筛选，商品总数: {len(filtered_goods)}")

        # 根据筛选类型进行筛选
        if filter_type == 'sale':
            # 筛选折扣商品
            filtered_goods = [goods for goods in filtered_goods if goods.get('is_sale')]
            print(f"折扣筛选后商品数量: {len(filtered_goods)}")
        elif filter_type == 'hot':
            # 筛选热销商品
            filtered_goods = [goods for goods in filtered_goods if goods.get('is_hot')]
            print(f"热销筛选后商品数量: {len(filtered_goods)}")
        else:
            print(f"未进行类型筛选，商品数量: {len(filtered_goods)}")

        # 根据折扣幅度进行筛选
        if sale_type and sale_type != '10':  # 10表示全部，不筛选
            try:
                sale_discount = int(sale_type)
                # 将数字转换为百分比字符串，比如 5 -> "50%", 6 -> "60%", 7 -> "70%"
                target_discount = f"{sale_discount}0%"
                
                # 筛选指定折扣幅度的商品
                filtered_goods = [goods for goods in filtered_goods 
                                if goods.get('sale_type') == target_discount]
                print(f"折扣幅度 {target_discount} 筛选后商品数量: {len(filtered_goods)}")
            except ValueError:
                print(f"折扣参数格式错误: {sale_type}")
        else:
            print(f"未进行折扣幅度筛选，商品数量: {len(filtered_goods)}")

        # 根据排序参数对商品进行排序
        if filtered_goods:
            if sort_type == 'price':
                # 按价格排序
                filtered_goods.sort(key=lambda x: float(x.get('current_price', 0)), reverse=(sort_method == 'DESC'))
                print(f"按价格{'降序' if sort_method == 'DESC' else '升序'}排序")
                
            elif sort_type == 'sale':
                # 按折扣排序（从sale_type中提取折扣数值）
                def get_discount_value(goods):
                    sale_type = goods.get('sale_type', '0%')

                    # 去掉百分号并转换为数值，比如 "70%" -> 70
                    try:
                        return float(sale_type.replace('%', ''))
                    except:
                        return 0
                
                filtered_goods.sort(key=get_discount_value, 
                                reverse=(sort_method == 'DESC'))
                print(f"按折扣{'降序' if sort_method == 'DESC' else '升序'}排序")
                
            else:
                # 默认按ID排序（综合排序）
                filtered_goods.sort(key=lambda x: x.get('goods_id', 0), 
                                reverse=(sort_method == 'DESC'))
                print(f"按ID{'降序' if sort_method == 'DESC' else '升序'}排序")
        else:
            print("没有商品数据，跳过排序")

        # 根据搜索关键词筛选商品
        if search:
            # 在商品标题中搜索关键词（不区分大小写）
            filtered_goods = [goods for goods in filtered_goods 
                            if search.lower() in goods.get('title', '').lower()]
            print(f"搜索 '{search}' 后商品数量: {len(filtered_goods)}")
        else:
            print("未进行搜索筛选")
        

        
        # 计算分页
        total = len(filtered_goods)
        # 如果筛选后没有商品，总页数为1
        if total == 0:
            total_pages = 1
        else:
            total_pages = (total + page_size - 1) // page_size
        
        # 确保当前页不超过总页数
        if page > total_pages:
            page = total_pages
        
        start = (page - 1) * page_size
        end = start + page_size
        current_goods = filtered_goods[start:end]
        
        print(f"分页结果 - 总数: {total}, 每页: {page_size}, 总页数: {total_pages}, 当前页数据: {len(current_goods)}条")
        
        return jsonify({
            'code': 200,
            'list': current_goods,
            'total': total_pages
        })
    except Exception as e:
        print(f"错误详情: {str(e)}")
        return jsonify({'code': 500, 'msg': f'服务器错误：{str(e)}'})

# 定义购物车数据文件路径
CART_PATH = os.path.join(os.path.dirname(__file__), 'add.json')

# 修改添加到购物车的接口
@app.route('/test/add.json', methods=['POST'])
def add_to_cart():
    """添加到购物车接口 - 修正版"""
    try:
        # 添加路径调试
        print(f"购物车文件路径: {CART_PATH}")
        print(f"文件是否存在: {os.path.exists(CART_PATH)}")
        
        # 获取请求数据
        data = request.get_json()
        print(f"接收到的数据: {data}")
        
        # 验证必要参数
        if not data:
            return jsonify({
                'code': 5,
                'message': '请求数据不能为空！'
            })
        
        # 验证用户ID和商品ID
        user_id = data.get('id')
        goods_id = data.get('goodsId')
        
        if not user_id or not goods_id:
            return jsonify({
                'code': 5,
                'message': "缺少用户ID或商品ID",
                'teacher1': '细心一些，仔细检查。',
                'teacher2': '请求方式对不对？',
                'teacher3': '参数携带对不对？'
            })
        
        # 如果文件不存在，创建初始文件
        if not os.path.exists(CART_PATH):
            initial_data = {
                "message": "商品添加购物车成功",
                "cart_items": []
            }
            with open(CART_PATH, 'w', encoding='utf-8') as f:
                json.dump(initial_data, f, ensure_ascii=False, indent=2)
        
        # 读取现有购物车数据
        with open(CART_PATH, 'r', encoding='utf-8') as f:
            cart_data = json.load(f)
        
        cart_items = cart_data.get('cart_items', [])
        
        # 从商品数据中获取完整的商品信息
        goods_info = get_goods_info_by_id(goods_id)
        if not goods_info:
            return jsonify({
                'code': 5,
                'message': '商品不存在'
            })
        
        # 检查商品是否已在当前用户的购物车中
        existing_item = None
        for item in cart_items:
            if item.get('user_id') == user_id and item.get('goods_id') == goods_id:
                existing_item = item
                break
        
        if existing_item:
            # 如果已存在，增加数量
            existing_item['quantity'] += 1
            message = f"购物车中已有该商品，数量已增加！当前数量：{existing_item['quantity']}"
        else:
            # 如果不存在，添加新商品
            new_item = {
                'user_id': user_id,
                'goods_id': goods_id,
                'name': goods_info.get('title', ''),
                'price': goods_info.get('current_price', 0),
                'quantity': 1,
                'image': goods_info.get('img_small_logo', ''),
                'category': goods_info.get('category', ''),
                'is_hot': goods_info.get('is_hot', False),
                'is_sale': goods_info.get('is_sale', False),
                'sale_type': goods_info.get('sale_type', ''),
                'is_select': False   # 新添加的商品默认不选中
            }
            cart_items.append(new_item)
            message = "加入购物车成功！你太有钱了！o(n_0)哈哈"
        
        # 保存更新后的购物车数据
        cart_data['cart_items'] = cart_items
        with open(CART_PATH, 'w', encoding='utf-8') as f:
            json.dump(cart_data, f, ensure_ascii=False, indent=2)
        
        # 返回响应
        return jsonify({
            'code': 1,
            'message': message,
            'cart_total': len([item for item in cart_items if item.get('user_id') == user_id])
        })
            
    except Exception as e:
        print(f"添加到购物车错误: {str(e)}")
        return jsonify({
            'code': 5,
            'message': f'服务器错误：{str(e)}'
        })



#商品详情页
@app.route('/test/item.json', methods=['GET'])
def get_item_detail():
    """
    获取商品详情信息
    请求参数: id - 商品ID
    """
    try:
        # 添加路径调试
        print(f"商品详情接口 - 文件路径: {GOODS_PATH}")
        print(f"商品详情接口 - 文件是否存在: {os.path.exists(GOODS_PATH)}")
        
        if not os.path.exists(GOODS_PATH):
            return jsonify({'code': 404, 'msg': f'商品数据文件不存在: {GOODS_PATH}'})
        
        # 读取商品数据
        with open(GOODS_PATH, 'r', encoding='utf-8') as f:
            all_goods = json.load(f)
        
        # 获取商品ID参数
        goods_id = request.args.get('id', '').strip()
        print(f"商品详情接口 - 请求的商品ID: {goods_id}")
        
        if not goods_id:
            return jsonify({'code': 400, 'msg': '商品ID不能为空'})
        
        # 在商品列表中查找对应ID的商品
        target_goods = None
        for goods in all_goods:
            # 根据你的数据结构，可能需要调整这个字段名
            # 如果你的商品ID字段是 'id'、'goods_id' 或其他，请相应调整
            if str(goods.get('goods_id', '')) == str(goods_id) or str(goods.get('id', '')) == str(goods_id):
                target_goods = goods
                break
        
        if not target_goods:
            print(f"商品详情接口 - 未找到ID为 {goods_id} 的商品")
            return jsonify({'code': 404, 'msg': '商品不存在'})
        
        print(f"商品详情接口 - 找到商品: {target_goods.get('title', '未知商品')}")
        
        # 返回商品详情信息
        return jsonify({
            'code': 200,
            'msg': 'success',
            'info': target_goods
        })
        
    except Exception as e:
        print(f"商品详情接口错误: {str(e)}")
        return jsonify({'code': 500, 'msg': f'服务器错误：{str(e)}'})


# 购物车页面后端代码 - 修正版
@app.route('/test/list.json', methods=['GET'])
def get_cart_list():
    """
    获取购物车列表
    请求参数: id - 用户ID
    请求头: authorization - 用户token
    """
    try:
        # 添加路径调试
        print(f"购物车列表接口 - 文件路径: {CART_PATH}")
        print(f"购物车列表接口 - 文件是否存在: {os.path.exists(CART_PATH)}")
        
        # 验证token和用户ID
        token = request.headers.get('authorization')
        user_id = request.args.get('id')
        
        print(f"购物车列表接口 - 用户ID: {user_id}, Token: {token}")
        
        if not token or not user_id:
            return jsonify({
                'code': 401, 
                'msg': '未授权访问，请先登录',
                'cart': []
            })
        
        # 检查购物车数据文件是否存在
        if not os.path.exists(CART_PATH):
            print(f"购物车数据文件不存在: {CART_PATH}")
            return jsonify({
                'code': 1,
                'msg': 'success',
                'cart': []
            })
        
        # 读取购物车数据
        with open(CART_PATH, 'r', encoding='utf-8') as f:
            cart_data = json.load(f)
        
        # 获取当前用户的购物车商品列表
        cart_items = []
        for item in cart_data.get('cart_items', []):
            # 只返回当前用户的商品
            if str(item.get('user_id')) == str(user_id):
                cart_items.append(item)
        
        print(f"购物车列表接口 - 用户 {user_id} 找到 {len(cart_items)} 件商品")
        
        # 转换数据格式以匹配前端期望的结构
        formatted_cart = []
        for item in cart_items:
            # 将购物车商品格式转换为前端期望的格式
            formatted_item = {
                'cart_number': item.get('quantity', 1),
                'category': item.get('category', ''),
                'current_price': str(item.get('price', 0)),
                'goods_id': item.get('goods_id') or item.get('id'),  # 支持两种ID字段名
                'goods_number': item.get('goods_number', 99),  # 假设库存充足
                'img_small_logo': item.get('image', ''),
                'is_hot': item.get('is_hot', False),
                'is_sale': item.get('is_sale', False),
                'is_select': item.get('is_select', False),  # 默认选中
                'price': str(item.get('price', 0)),
                'sale_type': item.get('sale_type', ''),
                'title': item.get('name', '') or item.get('title', '未知商品')
            }
            formatted_cart.append(formatted_item)
        
        # 返回购物车数据（code为1表示成功，与前端判断一致）
        return jsonify({
            'code': 1,
            'msg': 'success',
            'cart': formatted_cart
        })
        
    except Exception as e:
        print(f"购物车列表接口错误: {str(e)}")
        return jsonify({
            'code': 5, 
            'msg': f'服务器错误：{str(e)}',
            'cart': []
        })


def get_goods_info_by_id(goods_id):
    """根据商品ID从商品数据中获取商品信息"""
    try:
        if not os.path.exists(GOODS_PATH):
            return None
        
        with open(GOODS_PATH, 'r', encoding='utf-8') as f:
            all_goods = json.load(f)
        
        for goods in all_goods:
            if str(goods.get('goods_id', '')) == str(goods_id):
                return goods
        
        return None
    except Exception as e:
        print(f"获取商品信息错误: {str(e)}")
        return None
        
# 我将代码进行整合了

# 购物车工具函数
class CartUtils:
    @staticmethod
    def load_cart_data():
        """加载购物车数据"""
        if not os.path.exists(CART_PATH):
            return {'cart_items': []}
        with open(CART_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    @staticmethod
    def save_cart_data(cart_data):
        """保存购物车数据"""
        with open(CART_PATH, 'w', encoding='utf-8') as f:
            json.dump(cart_data, f, ensure_ascii=False, indent=2)
    
    @staticmethod
    def find_cart_item(cart_items, user_id, goods_id):
        """查找购物车商品"""
        for item in cart_items:
            item_user_id = str(item.get('user_id', '')).strip()
            item_goods_id = str(item.get('goods_id', '')).strip()
            if item_user_id == str(user_id) and item_goods_id == str(goods_id):
                return item
        return None
    
    @staticmethod
    def calculate_totals(cart_items, user_id):
        """计算总价格和总数量"""
        total_price = 0
        total_quantity = 0
        selected_total_price = 0
        selected_total_quantity = 0
        
        for item in cart_items:
            if str(item.get('user_id', '')).strip() == str(user_id):
                quantity = item.get('quantity', 0)
                price = float(item.get('current_price', 0))
                is_selected = item.get('is_select', False)
                
                total_price += price * quantity
                total_quantity += quantity
                
                if is_selected:
                    selected_total_price += price * quantity
                    selected_total_quantity += quantity
        
        return {
            'total_price': round(total_price, 2),
            'total_quantity': total_quantity,
            'selected_total_price': round(selected_total_price, 2),
            'selected_total_quantity': selected_total_quantity
        }
    
    @staticmethod
    def get_request_data():
        """获取请求数据"""
        if request.content_type and 'application/json' in request.content_type:
            return request.get_json()
        else:
            return request.form
    
    @staticmethod
    def validate_required_params(data, required_fields):
        """验证必要参数"""
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            return False, f'缺少必要参数: {", ".join(missing_fields)}'
        return True, None

# 购物车基础处理器
def handle_cart_operation(operation_type, data_callback=None):
    """
    处理购物车操作的通用函数
    operation_type: 'select', 'quantity', 'remove'
    data_callback: 数据处理回调函数
    """
    try:
        # 获取请求数据
        if request.method == 'GET':
            data = request.args
        else:
            data = CartUtils.get_request_data()
        
        user_id = data.get('id', '').strip()
        goods_id = data.get('goodsId', '').strip()
        
        print(f"{operation_type}操作 - 用户ID: '{user_id}', 商品ID: '{goods_id}'")
        
        # 验证必要参数
        required_fields = ['id', 'goodsId']
        if operation_type == 'quantity':
            required_fields.append('number')
        
        is_valid, error_msg = CartUtils.validate_required_params(data, required_fields)
        if not is_valid:
            return jsonify({'code': 5, 'message': error_msg})
        
        # 验证数量参数
        if operation_type == 'quantity':
            try:
                new_quantity = int(data.get('number'))
                if new_quantity < 1:
                    return jsonify({'code': 5, 'message': '商品数量不能小于1'})
            except ValueError:
                return jsonify({'code': 5, 'message': '商品数量必须是有效数字'})
        
        # 加载购物车数据
        cart_data = CartUtils.load_cart_data()
        cart_items = cart_data.get('cart_items', [])
        
        # 查找商品
        target_item = CartUtils.find_cart_item(cart_items, user_id, goods_id)
        if not target_item:
            return jsonify({'code': 5, 'message': '未找到对应的购物车商品'})
        
        # 执行具体操作
        result_data = None
        if operation_type == 'select':
            # 切换选中状态
            current_select = target_item.get('is_select', False)
            target_item['is_select'] = not current_select
            message = '修改购买信息成功'
            
        elif operation_type == 'quantity':
            # 更新商品数量
            new_quantity = int(data.get('number'))
            old_quantity = target_item.get('quantity', 1)
            target_item['quantity'] = new_quantity
            target_item['cart_number'] = new_quantity
            message = '修改商品数量成功'
            result_data = {
                'updated_goods': {
                    'goods_id': goods_id,
                    'new_quantity': new_quantity
                }
            }
            print(f"修改商品数量: {target_item.get('name')} {old_quantity} -> {new_quantity}")
            
        elif operation_type == 'remove':
            # 删除商品
            cart_items = [item for item in cart_items 
                         if not (str(item.get('user_id', '')).strip() == user_id and 
                                str(item.get('goods_id', '')).strip() == goods_id)]
            message = '删除商品成功'
            result_data = {
                'removed_goods': {
                    'goods_id': goods_id,
                    'name': target_item.get('name', '')
                }
            }
            print(f"删除商品: {target_item.get('name')}")
        
        # 自定义数据处理
        if data_callback:
            data_callback(cart_items, user_id, goods_id, data)
        
        # 保存数据
        cart_data['cart_items'] = cart_items
        CartUtils.save_cart_data(cart_data)
        
        # 计算汇总数据
        totals = CartUtils.calculate_totals(cart_items, user_id)
        
        # 构建响应
        response = {
            'code': 1,
            'message': message,
            'data': {**totals, **(result_data or {})}
        }
        
        return jsonify(response)
        
    except Exception as e:
        print(f"{operation_type}操作错误: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'code': 5, 
            'message': f'服务器错误：{str(e)}'
        })

# 修改购物车商品选中状态接口
@app.route('/test/select.json', methods=['POST'])
def update_cart_selection():
    return handle_cart_operation('select')

# 修改购物车商品数量接口
@app.route('/test/number.json', methods=['POST'])
def update_cart_quantity():
    return handle_cart_operation('quantity')

# 删除购物车商品接口
@app.route('/test/remove.json', methods=['GET'])
def remove_cart_item():
    return handle_cart_operation('remove')


# 全选购物车商品接口
@app.route('/test/all.json', methods=['POST'])
def select_all_cart_items():
    """
    全选/取消全选购物车商品
    请求参数: 
        id - 用户ID
        type - 操作类型 (1:全选, 0:取消全选)
    """
    try:
        # 获取请求参数
        user_id = request.form.get('id', '').strip()
        select_type = request.form.get('type', '0').strip()
        
        print(f"全选操作 - 用户ID: '{user_id}', 操作类型: '{select_type}'")
        
        if not user_id:
            return jsonify({
                'code': 5,
                'message': '缺少必要参数: id'
            })
        
        # 验证操作类型
        try:
            select_type = int(select_type)
            if select_type not in [0, 1]:
                return jsonify({
                    'code': 5,
                    'message': '操作类型参数错误: type 必须是 0 或 1'
                })
        except ValueError:
            return jsonify({
                'code': 5,
                'message': '操作类型必须是有效数字'
            })
        
        # 检查购物车数据文件是否存在
        if not os.path.exists(CART_PATH):
            return jsonify({
                'code': 5,
                'message': '购物车数据不存在'
            })
        
        # 读取购物车数据
        with open(CART_PATH, 'r', encoding='utf-8') as f:
            cart_data = json.load(f)
        
        cart_items = cart_data.get('cart_items', [])
        updated_count = 0
        
        # 更新对应用户的所有商品的选中状态
        for item in cart_items:
            item_user_id = str(item.get('user_id', '')).strip()
            
            if item_user_id == user_id:
                item['is_select'] = bool(select_type)
                updated_count += 1
                print(f"更新商品选中状态: {item.get('name')} -> {bool(select_type)}")
        
        print(f"共更新了 {updated_count} 个商品的选中状态")
        
        if updated_count == 0:
            return jsonify({
                'code': 5,
                'message': '该用户的购物车中没有商品'
            })
        
        # 保存更新后的购物车数据
        cart_data['cart_items'] = cart_items
        with open(CART_PATH, 'w', encoding='utf-8') as f:
            json.dump(cart_data, f, ensure_ascii=False, indent=2)
        
        # 计算更新后的总价格和总数量
        total_price = 0
        total_quantity = 0
        selected_total_price = 0
        selected_total_quantity = 0
        
        for item in cart_items:
            if str(item.get('user_id', '')).strip() == user_id:
                quantity = item.get('quantity', 0)
                price = float(item.get('current_price', 0))
                is_selected = item.get('is_select', False)
                
                total_price += price * quantity
                total_quantity += quantity
                
                if is_selected:
                    selected_total_price += price * quantity
                    selected_total_quantity += quantity
        
        # 返回成功响应，包含更新后的汇总数据
        return jsonify({
            'code': 1,
            'message': '全选操作成功' if select_type == 1 else '取消全选操作成功',
            'data': {
                'total_price': round(total_price, 2),
                'total_quantity': total_quantity,
                'selected_total_price': round(selected_total_price, 2),
                'selected_total_quantity': selected_total_quantity,
                'updated_count': updated_count,
                'operation': 'select_all' if select_type == 1 else 'unselect_all'
            }
        })
        
    except Exception as e:
        print(f"全选操作错误: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'code': 5, 
            'message': f'服务器错误：{str(e)}'
        })

# 清空购物车接口----使用之前定义的类CartUtils 类简化代码
@app.route('/test/clear.json', methods=['GET'])
def clear_cart():
    """
    清空购物车
    请求参数: 
        id - 用户ID
    """
    try:
        # 获取请求参数
        user_id = request.args.get('id', '').strip()
        
        print(f"清空购物车 - 用户ID: '{user_id}'")
        
        if not user_id:
            return jsonify({
                'code': 5,
                'message': '缺少必要参数: id'
            })
        
        # 加载购物车数据
        cart_data = CartUtils.load_cart_data()
        cart_items = cart_data.get('cart_items', [])
        
        # 记录被清空的商品信息
        cleared_items = []
        
        # 过滤出不属于该用户的商品（保留其他用户的商品）
        remaining_items = []
        for item in cart_items:
            item_user_id = str(item.get('user_id', '')).strip()
            
            if item_user_id == user_id:
                cleared_items.append({
                    'goods_id': item.get('goods_id'),
                    'name': item.get('name'),
                    'quantity': item.get('quantity', 0)
                })
                print(f"清空商品: {item.get('name')}")
            else:
                remaining_items.append(item)
        
        cleared_count = len(cleared_items)
        print(f"共清空了 {cleared_count} 个商品")
        
        if cleared_count == 0:
            return jsonify({
                'code': 5,
                'message': '购物车中暂无商品'
            })
        
        # 保存更新后的购物车数据
        cart_data['cart_items'] = remaining_items
        CartUtils.save_cart_data(cart_data)
        
        # 返回成功响应
        return jsonify({
            'code': 1,
            'message': '清空购物车成功',
            'data': {
                'total_price': 0,
                'total_quantity': 0,
                'selected_total_price': 0,
                'selected_total_quantity': 0,
                'cleared_count': cleared_count,
                'cleared_items': cleared_items
            }
        })
        
    except Exception as e:
        print(f"清空购物车错误: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'code': 5, 
            'message': f'服务器错误：{str(e)}'
        })

# 删除所有已选中商品接口
@app.route('/test/removeselect.json', methods=['GET'])
def remove_selected_cart_items():
    """
    删除所有已选中的购物车商品
    请求参数: 
        id - 用户ID
    """
    try:
        # 获取请求参数
        user_id = request.args.get('id', '').strip()
        
        print(f"删除已选中商品 - 用户ID: '{user_id}'")
        
        if not user_id:
            return jsonify({
                'code': 5,
                'message': '缺少必要参数: id'
            })
        
        # 加载购物车数据
        cart_data = CartUtils.load_cart_data()
        cart_items = cart_data.get('cart_items', [])
        
        # 记录被删除的选中商品信息
        removed_items = []
        
        # 过滤出未选中的商品或非该用户的商品
        remaining_items = []
        for item in cart_items:
            item_user_id = str(item.get('user_id', '')).strip()
            is_selected = item.get('is_select', False)
            
            # 如果是当前用户且已选中的商品，则删除
            if item_user_id == user_id and is_selected:
                removed_items.append({
                    'goods_id': item.get('goods_id'),
                    'name': item.get('name'),
                    'quantity': item.get('quantity', 0),
                    'price': item.get('current_price', 0)
                })
                print(f"删除已选中商品: {item.get('name')}")
            else:
                # 保留未选中的商品或其他用户的商品
                remaining_items.append(item)
        
        removed_count = len(removed_items)
        print(f"共删除了 {removed_count} 个已选中商品")
        
        if removed_count == 0:
            return jsonify({
                'code': 5,
                'message': '没有已选中的商品'
            })
        
        # 保存更新后的购物车数据
        cart_data['cart_items'] = remaining_items
        CartUtils.save_cart_data(cart_data)
        
        # 计算删除后的总价格和总数量
        totals = CartUtils.calculate_totals(remaining_items, user_id)
        
        # 返回成功响应
        return jsonify({
            'code': 1,
            'message': '删除已选中商品成功',
            'data': {
                'total_price': totals['total_price'],
                'total_quantity': totals['total_quantity'],
                'selected_total_price': totals['selected_total_price'],
                'selected_total_quantity': totals['selected_total_quantity'],
                'removed_count': removed_count,
                'removed_items': removed_items
            }
        })
        
    except Exception as e:
        print(f"删除已选中商品错误: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'code': 5, 
            'message': f'服务器错误：{str(e)}'
        })

@app.route('/')
def index():
    return "Flask服务器运行中..."

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
    
    
    