from flask import Flask, request, jsonify
import datetime
import os

app = Flask(__name__)

# 模拟用户数据
users = {
    'admin': {'password': 'admin123', 'id': 1, 'nickname': '干锋教育', 'createTime': 1622087544072},
    'user': {'password': 'user123', 'id': 2, 'nickname': '普通用户', 'createTime': 1622187544072}
}

@app.route('/test/third.json', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        # 处理预检请求
        return jsonify({'status': 'ok'}), 200
    
    # 根据内容类型获取数据
    if request.content_type and 'application/json' in request.content_type:
        data = request.get_json()
        username = data.get('username') if data else None
        password = data.get('password') if data else None
    else:
        # 表单数据
        username = request.form.get('username')
        password = request.form.get('password')
    
    print(f'登录尝试: 用户名: {username}')
    
    # 检查用户名和密码
    if not username or not password:
        return jsonify({
            'code': 0,
            'message': '登录失败，用户名或者密码不对！',
            'tips': '你给我的用户名和密码不太对哦，仔细检查一下有没有空格之类的错误！'
        })
    
    if username in users and users[username]['password'] == password:
        # 登录成功 - 返回图一的格式
        user_data = users[username]
        return jsonify({
            'code': 1,
            'message': '恭喜你，登录成功了！^ ^',
            'tips': '登录有效期是 1.00 个小时，你的登录状态会在 1.00 个小时后自动注销',
            'token': 'eyJhbGcioiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjM2MDYxMjAxLCJleHAiOjE2MzYwNjQ4MDF9.ULX45VE99CjAIXA0BqJYDhcxlQM7Vj6brv4zPAMkcIQ',
            'user': {
                'msg': "这是你目前登录的账户的信息，哄，给你 -_- !",
                'id': user_data['id'],
                'username': username,
                'nickname': user_data['nickname'],
                'createTime': user_data['createTime']
            }
        })
    else:
        # 登录失败 - 返回图二的格式
        return jsonify({
            'code': 0,
            'message': '登录失败，用户名或者密码不对！',
            'tips': '你给我的用户名和密码不太对哦，仔细检查一下有没有空格之类的错误！'
        })

@app.after_request
def after_request(response):
    # 添加CORS头，允许跨域请求
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

if __name__ == '__main__':
    print('=' * 60)
    print('登录服务器启动成功!')
    print('服务器运行在: http://localhost:8000')
    print('登录接口: POST http://localhost:8000/test/third.json')  #5.07所需
    print('')
    print('可用测试账户:')
    print('  - 用户名: admin, 密码: admin123')
    print('  - 用户名: user, 密码: user123')
    print('')
    print('请保持此窗口运行，然后在浏览器中打开 5.07-0login.html 文件进行测试')
    print('=' * 60)
    app.run(host='0.0.0.0', port=8000, debug=True)