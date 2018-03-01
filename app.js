/**
 * Created by wu on 2018/2/13.
 * 应用程序的启动（入口）
 * 用户发送http请求 -> url -> 解析路由 -> 找到匹配的规则 -> 执行指定的绑定函数，返回对应内容到客户端
 * -> 静态 -> 直接读取指定目录（/public）下的文件，返回给用户
 * -> 动态 -> 处理业务逻辑，加载模板，解析模板 -> 返回数据给用户
 */

//加载express模块
const express = require('express');
//加载模板处理模块
const swig = require('swig');
//加载数据库模块
const mongoose = require('mongoose');
//加载bodyParser
const bodyParser = require('body-parser');
//加载cookie
const cookie = require('cookie');
const cookieParser = require('cookie-parser');
const cParse = require('./lib/parse');

//创建APP应用
const app = express();

const user = require('./models/user');

//设置静态文件托管
app.use('/public',express.static(__dirname + '/public'));

//定义但却应用所使用的模板引擎
//第一个参数:模板
app.engine('html',swig.renderFile);
//设置模板存放目录
app.set('views','./views');
//注册所使用的模板引擎
app.set('view engine','html');
//bodyParser设置
app.use(bodyParser.urlencoded({ extended:true }));

app.use(cookieParser('wuguang'));

//设置cookie
app.use((req, res, next)=>{
    req.userinfo = {};
    var _cookieContent = req.cookies.userinfo;
    if(_cookieContent){
        try {
            req.userInfo = JSON.parse(_cookieContent);
            user.findById(req.userInfo._id).then((userInfo)=>{
                req.userInfo.isAdmin = Boolean( userInfo.isAdmin );
                next();
            });
        } catch (error) {
            next();
        }
    }else{
        next();
    }
});

/*app.get('/',function(req,res,next){
    /!*
    * 读取views目录下的指定文件，解析并返回给客户端
    * 第一个参数：模板文件，相对于views目录来
    * 第二个参数：传递给模板使用的数据
    * *!/
    res.render('index');
});

app.get('/main.css',function(req,res,next){
    res.setHeader('content-type','text/css');
    res.send('body {background:red;}');
});*/
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));

mongoose.connect('mongodb://localhost:27017/blog',function(err){
    if(err){
        console.log('000');
    }else{
        app.listen('8888');
    }
});

//删除缓存
swig.setDefaults({cache:false});






