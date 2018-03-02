/**
 * Created by wu on 2018/2/13.
 */

const mongoose = require('mongoose');

//表结构
module.exports = new mongoose.Schema({
    username: String,//用户名
    password: String,//密码
    //是否管理员
    isAdmin:{
        type: Boolean,
        default: false
    }
});





