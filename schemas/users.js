/**
 * Created by wu on 2018/2/13.
 */

const mongoose = require('mongoose');

//表结构
module.exports = new mongoose.Schema({
    username: String,
    password: String,
    //是否管理员
    isAdmin:{
        type: Boolean,
        default: false
    }
});





