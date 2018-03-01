/**
 * Created by wu on 2018/2/13.
 */

const express = require('express');
const router = express.Router();

router.use(function (req,res,next) {
    if(req.userInfo && !req.userInfo.isAdmin){
        res.send('对不起，只有管理员才可以进入后台！~');
        return;
    }
    next();
});

router.get('/',function(req,res,next){
    res.send('欢迎进入管理后台！~');
});

module.exports = router;

