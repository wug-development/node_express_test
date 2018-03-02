/**
 * Created by wu on 2018/2/13.
 */

const mongoose = require('mongoose');

//分类表结构
module.exports = new mongoose.Schema({
    //分类名称
    name: String
});

