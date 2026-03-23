# 修改购物车商品选中状态接口
@app.route('/test/select.json', methods=['POST'])
def update_cart_selection():
    """
    修改购物车商品选中状态
    请求参数: 
        id - 用户ID
        goodsId - 商品ID
    """
    try:
        # 获取请求数据 - 支持表单数据格式
        if request.content_type and 'application/json' in request.content_type:
            # 如果是JSON格式
            data = request.get_json()
        else:
            # 如果是表单格式
            data = request.form
            
        user_id = data.get('id')
        goods_id = data.get('goodsId')
        
        # 去除可能的空格
        if goods_id:
            goods_id = goods_id.strip()
        if user_id:
            user_id = user_id.strip()
        
        print(f"修改选中状态 - 用户ID: '{user_id}', 商品ID: '{goods_id}'")
        print(f"购物车文件路径: {CART_PATH}")
        print(f"文件是否存在: {os.path.exists(CART_PATH)}")
        
        if not user_id or not goods_id:
            return jsonify({
                'code': 5,
                'message': '缺少必要参数: id 或 goodsId'
            })
        
        # 检查购物车数据文件是否存在
        if not os.path.exists(CART_PATH):
            print("购物车数据文件不存在")
            return jsonify({
                'code': 5,
                'message': '购物车数据不存在'
            })
        
        # 读取购物车数据
        with open(CART_PATH, 'r', encoding='utf-8') as f:
            cart_data = json.load(f)
        
        cart_items = cart_data.get('cart_items', [])
        item_found = False
        
        print(f"购物车中的商品总数: {len(cart_items)}")
        
        # 查找并更新对应商品的选中状态
        for item in cart_items:
            # 调试输出每个商品的信息
            item_user_id = str(item.get('user_id', '')).strip()
            item_goods_id = str(item.get('goods_id', '')).strip()
            
            print(f"检查商品: 用户ID='{item_user_id}', 商品ID='{item_goods_id}', 商品名称={item.get('name')}")
            
            # 匹配用户ID和商品ID（都去除空格比较）
            user_match = item_user_id == str(user_id)
            goods_match = item_goods_id == str(goods_id)
            
            if user_match and goods_match:
                # 切换选中状态
                current_select = item.get('is_select', False)
                item['is_select'] = not current_select
                item_found = True
                print(f"找到并修改商品选中状态: {item.get('name')} -> {item['is_select']}")
                break
        
        if not item_found:
            print(f"未找到匹配的商品 - 用户ID: '{user_id}', 商品ID: '{goods_id}'")
            print("购物车中的所有商品:")
            for i, item in enumerate(cart_items):
                print(f"商品{i+1}: 用户ID='{item.get('user_id')}', 商品ID='{item.get('goods_id')}', 名称='{item.get('name')}', 选中状态={item.get('is_select', False)}")
            return jsonify({
                'code': 5,
                'message': '未找到对应的购物车商品'
            })
        
        # 保存更新后的购物车数据
        cart_data['cart_items'] = cart_items
        with open(CART_PATH, 'w', encoding='utf-8') as f:
            json.dump(cart_data, f, ensure_ascii=False, indent=2)
        
        print("购物车数据保存成功")
        
        # 返回成功响应
        return jsonify({
            'code': 1,
            'message': '修改购买信息成功'
        })
        
    except Exception as e:
        print(f"修改选中状态错误: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'code': 5, 
            'message': f'服务器错误：{str(e)}'
        })


# 修改购物车商品数量接口
@app.route('/test/number.json', methods=['POST'])
def update_cart_quantity():
    """
    修改购物车商品数量
    请求参数: 
        id - 用户ID
        goodsId - 商品ID
        number - 新的商品数量
    """
    try:
        # 获取请求数据 - 支持表单数据格式
        if request.content_type and 'application/json' in request.content_type:
            data = request.get_json()
        else:
            data = request.form
            
        user_id = data.get('id')
        goods_id = data.get('goodsId')
        new_quantity = data.get('number')
        
        # 去除可能的空格
        if goods_id:
            goods_id = goods_id.strip()
        if user_id:
            user_id = user_id.strip()
        
        print(f"修改商品数量 - 用户ID: '{user_id}', 商品ID: '{goods_id}', 新数量: '{new_quantity}'")
        
        if not user_id or not goods_id or not new_quantity:
            return jsonify({
                'code': 5,
                'message': '缺少必要参数: id, goodsId 或 number'
            })
        
        # 验证数量是否为有效数字
        try:
            new_quantity = int(new_quantity)
            if new_quantity < 1:
                return jsonify({
                    'code': 5,
                    'message': '商品数量不能小于1'
                })
        except ValueError:
            return jsonify({
                'code': 5,
                'message': '商品数量必须是有效数字'
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
        item_found = False
        
        # 查找并更新对应商品的数量
        for item in cart_items:
            item_user_id = str(item.get('user_id', '')).strip()
            item_goods_id = str(item.get('goods_id', '')).strip()
            
            if item_user_id == str(user_id) and item_goods_id == str(goods_id):
                # 更新商品数量
                old_quantity = item.get('quantity', 1)
                item['quantity'] = new_quantity
                item['cart_number'] = new_quantity
                item_found = True
                print(f"修改商品数量: {item.get('name')} {old_quantity} -> {new_quantity}")
                break
        
        if not item_found:
            return jsonify({
                'code': 5,
                'message': '未找到对应的购物车商品'
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
            if str(item.get('user_id', '')).strip() == str(user_id):
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
            'message': '修改商品数量成功',
            'data': {
                'total_price': round(total_price, 2),
                'total_quantity': total_quantity,
                'selected_total_price': round(selected_total_price, 2),
                'selected_total_quantity': selected_total_quantity,
                'updated_goods': {
                    'goods_id': goods_id,
                    'new_quantity': new_quantity
                }
            }
        })
        
    except Exception as e:
        print(f"修改商品数量错误: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'code': 5, 
            'message': f'服务器错误：{str(e)}'
        })


# 删除购物车商品接口
@app.route('/test/remove.json', methods=['GET'])
def remove_cart_item():
    """
    删除购物车商品
    请求参数: 
        id - 用户ID
        goodsId - 商品ID
    """
    try:
        # 获取请求参数
        user_id = request.args.get('id')
        goods_id = request.args.get('goodsId')
        
        # 去除可能的空格
        if goods_id:
            goods_id = goods_id.strip()
        if user_id:
            user_id = user_id.strip()
        
        print(f"删除商品 - 用户ID: '{user_id}', 商品ID: '{goods_id}'")
        
        if not user_id or not goods_id:
            return jsonify({
                'code': 5,
                'message': '缺少必要参数: id 或 goodsId'
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
        item_found = False
        removed_item = None
        
        # 查找并删除对应的商品
        new_cart_items = []
        for item in cart_items:
            item_user_id = str(item.get('user_id', '')).strip()
            item_goods_id = str(item.get('goods_id', '')).strip()
            
            if item_user_id == str(user_id) and item_goods_id == str(goods_id):
                # 找到要删除的商品，跳过不添加到新列表
                item_found = True
                removed_item = item
                print(f"删除商品: {item.get('name')}")
            else:
                # 保留其他商品
                new_cart_items.append(item)
        
        if not item_found:
            return jsonify({
                'code': 5,
                'message': '未找到对应的购物车商品'
            })
        
        # 保存更新后的购物车数据
        cart_data['cart_items'] = new_cart_items
        with open(CART_PATH, 'w', encoding='utf-8') as f:
            json.dump(cart_data, f, ensure_ascii=False, indent=2)
        
        # 计算删除后的总价格和总数量
        total_price = 0
        total_quantity = 0
        selected_total_price = 0
        selected_total_quantity = 0
        
        for item in new_cart_items:
            if str(item.get('user_id', '')).strip() == str(user_id):
                quantity = item.get('quantity', 0)
                price = float(item.get('current_price', 0))
                is_selected = item.get('is_select', False)
                
                total_price += price * quantity
                total_quantity += quantity
                
                if is_selected:
                    selected_total_price += price * quantity
                    selected_total_quantity += quantity
        
        # 返回成功响应，包含删除后的汇总数据
        return jsonify({
            'code': 1,
            'message': '删除商品成功',
            'data': {
                'total_price': round(total_price, 2),
                'total_quantity': total_quantity,
                'selected_total_price': round(selected_total_price, 2),
                'selected_total_quantity': selected_total_quantity,
                'removed_goods': {
                    'goods_id': goods_id,
                    'name': removed_item.get('name') if removed_item else ''
                }
            }
        })
        
    except Exception as e:
        print(f"删除商品错误: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'code': 5, 
            'message': f'服务器错误：{str(e)}'
        })