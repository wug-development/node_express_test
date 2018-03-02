/**
 * Created by wu on 2018/2/13.
 */

const mongoose = require('mongoose');

//内容表结构
module.exports = new mongoose.Schema({
    //关联字段 - 分类ID
    category:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref:"category"
    },
    //分类名称
    title: String,

    //关联字段 - 用户ID
    user:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref:"user"
    },
    //添加时间
    addTime:{
        type:Date,
        default:new Date()
    },
    //点击量
    views:{
        type:Number,
        default:0
    },

    //简介
    description:{
        type:String,
        default:''
    },
    //内容
    content:{
        type:String,
        default:''
    },
    //评论内容
    comments:{
        type:Array,
        default:[]
    }
});
