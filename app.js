var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');
var http = require('http');

var uploadRouter = require("./routes/upload");
console.log(uploadRouter);
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

uploadRouter(app);


app.use(function (req, res, next) { console.log('Time:',Date.now()); next();});  
app.use('/user/:id', function (req, res, next){console.log('Request Type:', req.method); next();}); 
app.use(favicon(__dirname + '/favicon.ico'));
app.set('port',process.env.PORT || 3000); // 设置端口为3000 
app.get('/',function (req,res) { // 设置首页的路由 用 '/' 表示 
	res.sendfile('index.html'); })
app.get('/user/:id',function (req,res) { // 设置首页的路由 用 '/' 表示 
	res.send('user ') })

app.get('/about',function (req,res) { //设置about页面的路由 用 '/about' 表示 
	res.send('the node course') })
app.use(function (req,res,next) { // 设置404页面 
	res.status(404); res.send('404 - Not Found') }) 
const server = app.listen(app.get('port'),"localhost",function () { // 监听端口如果有用户进入页面发送请求我们输出以下语句 
	//console.log('express started on port 3000');
	host = server.address().address
    port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
})

// catch 404 and forward to error handler


module.exports = app;
