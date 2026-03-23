var express = require('express');
const { readFile } = require('fs');
const UserController = require('../controllers/UserController');
var router = express.Router();
//引入multer
const multer  = require('multer')
const upload = multer({ dest: 'public/uploads/' })


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
/**
 * 
 * @api {post} /api/user 添加用户
 * @apiName addUser
 * @apiGroup usergroup
 * @apiVersion  1.0.0
 * 
 * 
 * @apiParam  {String} username 用户名
 * @apiParam  {String} password 密码
 * @apiParam  {String} age 年龄
 * @apiParam  {String} avatar 头像
 * 
 * *返回的结果
 * @apiSuccess (200) Number} ok 标识成功字段
 * 
 * *传参的例子
 * @apiParamExample  {type} Request-Example:
 * {
 *     username : "kerwin",
 *     password : "123",
 *     age : 100,
 *     username : File,
 * }
 * 
 * 
 * @apiSuccessExample {type} Success-Response:
 * {
 *     ok : 1
 * }
 * 
 * 
 */
//相应前端的post请求-增加用户
router.post("/user",upload.single("avatar"),UserController.addUser)
//动态路由, 获取id -更新用户
router.put("/user/:myid",UserController.updateUser)
//删除用户
router.delete("/user/:id",UserController.deleteUser)
//获取用户列表
router.get("/user",UserController.getUser)


//登录校验

router.post("/login",UserController.login)
router.get("/logout",UserController.logout)

module.exports = router;
