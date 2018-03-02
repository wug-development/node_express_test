/**
 * Created by wu on 2018/2/13.
 */

const express = require('express');
const router = express.Router();
const category = require('../models/category');
const content = require('../models/content');

var data = {};

//处理通用数据
router.use(function (req,res,next) {
    data = {
        userInfo:req.userInfo,
        categorys:[],
    };
    category.find().then(function (categorys) {
        data.categorys = categorys;
        next();
    });
});

router.get('/',function(req,res,next){
    data.page=Number(req.query.page||1);
    data.cateid=req.query.cateid || '';
    data.limit=10;
    data.pages=0;

    category.find().then(function(categorys){
        data.categorys = categorys;
        if(data.cateid) {
            return content.where({category:data.cateid}).count();
        }else{
            return content.count();
        }

    }).then(function(count){
        data.count = count;
        data.pages = Math.ceil(count/data.limit);
        data.page = Math.min(data.page,data.pages);
        data.page = Math.max(data.page,1);
        var skip = (data.page-1) * data.limit;
        if(data.cateid){
            // sort 1升序 -1降序
            return content.where({category:data.cateid}).find().sort({_id:-1}).limit(data.limit).skip(skip).populate(['category','user']);
        }else{
            // sort 1升序 -1降序
            return content.find().sort({_id:-1}).limit(data.limit).skip(skip).populate(['category','user']);
        }

    }).then(function(content){
        data.contents = content;
        res.render('main/index',data);
    });
});

router.get('/view',function (req,res) {
    var _cid = req.query.cid || '';
    if(_cid){
        content.findOne({
            _id:_cid
        }).then(function (content) {
            data.content = content;
            content.views++;
            content.save();
            res.render('main/view',data);
        })
    }
});



module.exports = router;

