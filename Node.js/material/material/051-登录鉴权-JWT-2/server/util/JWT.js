/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */
const jwt = require("jsonwebtoken")
const secret = "kerwin-anydata"
const JWT = {
    // 生成token
    generate(value,expires){
        return jwt.sign(value,secret,{expiresIn:expires})
        // 要加密数据，密钥，过期时间
    },
    // 校验token,解密token
    verify(token){
        // 没过期，返回初始信息
        try {
            return jwt.verify(token,secret)
        } catch (error) {  // 过期
            return false
        }
    }
}

module.exports = JWT