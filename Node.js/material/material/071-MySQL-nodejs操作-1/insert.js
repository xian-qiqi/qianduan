/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */
const express = require("express")
const app = express()
const mysql2 = require("mysql2")


app.get("/", async(req,res) =>{
    //创建连接池，进行操作
    const config = getDBConfig()
    const promisePool = mysql2.createPool(config).promise()
    var name = "xiaoming"

    // var users = await promisePool.query(`insert into students (name,score,gender,class_id) values (?,?,?,?)`, ["xian",100,0,3]) 

    // var users = await promisePool.query(`update students set create_time  = ? where name = "xian"`, [new Date()]) 

    var users = await promisePool.query(`delete from students where id = ?`, [4]) 

    console.log(users[0])

    res.send({
        ok:1,
        data: users[0]
    })
})
    
app.listen(3000)

function getDBConfig(){
    return {
        host:"127.0.0.1",
        port:3306,
        user:"root",
        password:"pjq123",
        database:"qianduan",
        connectionLimit:1
    }
}

