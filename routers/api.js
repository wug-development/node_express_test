/**
 * Created by wu on 2018/2/13.
 */

const express = require('express');
const router = express.Router();
const user = require('../models/user.js');

var responseData;
router.use(function(req,res,next){
   responseData = {
       code : 0,
       message : ''
   };
    next();
});

router.post('/user/register',function(req,res,next){
    //res.send('api - user');
    console.log(req.body);

    var uname = req.body.username;
    var upass = req.body.password;
    var repass = req.body.repassword;
    if(uname == ''){
        responseData.code=2;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }else if(upass == ''){
        responseData.code=3;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }else if(upass != repass){
        responseData.code=4;
        responseData.message = '两次密码不一致';
        res.json(responseData);
        return;
    }else{
        user.findOne({
            username : uname
        }).then(function(userInfo){
            console.log(userInfo);
            if(userInfo){
                responseData.code=0;
                responseData.message = '用户名已被注册！~';
                res.json(responseData);
                return;
            }else{
                var u = new user({
                    username:uname,
                    password:upass
                });
                return u.save();
            }
        }).then(function(newUserinfo){
            console.log(newUserinfo);
            responseData.code=1;
            responseData.message = '注册成功！~';
            res.json(responseData);
        });
    }
});

router.post('/user/login',function(req,res,next){
    //res.send('api - user');
    console.log(req.body);

    var uname = req.body.username;
    var upass = req.body.password;
    if(uname == ''){
        responseData.code=2;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }else if(upass == ''){
        responseData.code=3;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }else{
        user.findOne({
            username : uname,
            password : upass
        }).then(function(userInfo){
            console.log(userInfo);
            if(userInfo){
                responseData.code=1;
                responseData.message = '登录成功！~';
                responseData.data ={
                    _id : userInfo._id,
                    _uname : userInfo.username
                };
                res.cookie('userinfo',JSON.stringify(responseData.data));
                res.json(responseData);
                return;
            }else{
                responseData.code=0;
                responseData.message = '用户名密码错误！~';
                res.json(responseData);
                return;
            }
        })
    }
});

module.exports = router;
