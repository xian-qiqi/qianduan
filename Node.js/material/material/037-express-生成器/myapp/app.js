// !使用npx express-generator myapp --view=ejs  命令生成框架  ， 需要自己下载依赖npm i

var createError = require('http-errors');
var express = require('express');
var path = require('path');

// *中间件
// *cookie前端后端都可以设置，后端需要读取前端传来的cookie，cookie-parser即解析cookie
// *如何读取cookie---查看routes里面的users.jsvar cookieParser = require('cookie-parser');

var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
// *path.join(__dirname, 'views'): 构建完整的目录路径
// __dirname 表示当前文件所在的目录的绝对路径
// path.join() 用于安全地拼接路径 ,常用于/ 和 \
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ?记录并在总端返回相关信息
app.use(logger('dev'));

// *中间件，用于自动解析传入的 HTTP 请求体数据。
// *解析 JSON 格式的请求体，将 JSON 字符串转换为 JavaScript 对象
app.use(express.json());
// *解析 URL-encoded 格式的请求体，解析username=kerwin&password=1234为JavaScript 对象
app.use(express.urlencoded({ extended: false }));

// *注册中间件
app.use(cookieParser());

// *将public文件夹注册成静态资源文件
app.use(express.static(path.join(__dirname, 'public')));

// ?路由级别中间件
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');  // ?在view文件夹下面的error.ejs里面
});

module.exports = app;

// *使用node-dev ./bin/www启动服务器
// * 或者npm start启动（修改）package.json里面的
// "scripts": {
//     "start": "node-dev ./bin/www"    
//   },
