const mongoose = require("mongoose")

const Schema = mongoose.Schema
//限制类型
const UserType = {
    username:String,
    password:String,
    age:Number
}
//下面命令会创建mongdb的user集合
const UserModel = mongoose.model("user",new Schema(UserType))
// 模型user 将会对应 users 集合, 
module.exports = UserModel