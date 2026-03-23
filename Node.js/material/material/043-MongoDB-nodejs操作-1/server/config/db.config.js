//npm i mongoose
const mongoose = require("mongoose")
//连接数据库
// ! ./mongod.exe --dbpath=F:/qian/data/db
mongoose.connect("mongodb://127.0.0.1:27017/xian_project")

//插入集合和数据，数据库xian_project自动创建