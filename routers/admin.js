/**
 * Created by wu on 2018/2/13.
 */

const express = require('express');
const router = express.Router();
const user = require('../models/user');
const category = require('../models/category');
const content = require('../models/content');

router.use(function (req,res,next) {
    if(req.userInfo && !req.userInfo.isAdmin){
        res.send('对不起，只有管理员才可以进入后台！~');
        return;
    }else if(!req.userInfo){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'请登录！~',
            url:'/'
        });
        return;
    }else{
        next();
    }
    next();
});

//首页
router.get('/',function(req,res,next){
    res.render('admin/index',{
        userInfo: req.userInfo
    });
});

//用户管理
router.get('/user',function(req,res,next){
    const limit = 10;
    var page = Number(req.query.page || 1);
    var skip = (page-1) * limit;
    var pages = 0;

    user.count().then(function(dcount){

        pages = Math.ceil(dcount/limit);
        page = Math.min(page,pages);
        page = Math.max(page,1);
        skip = (page-1) * limit;

        user.find().limit(limit).skip(skip).then(function (users) {
            res.render('admin/user_index',{
                userInfo: req.userInfo,
                users:users,
                limit:limit,
                dataCount:dcount,
                page:page,
                pages:pages
            });
        });
    });
});

//分类管理
router.get('/category',function(req,res){
    const limit = 10;
    var page = Number(req.query.page || 1);
    var skip = (page-1) * limit;
    var pages = 0;

    category.count().then(function(dcount){

        pages = Math.ceil(dcount/limit);
        page = Math.min(page,pages);
        page = Math.max(page,1);
        skip = (page-1) * limit;

        // sort 1升序 -1降序
        category.find().sort({_id:-1}).limit(limit).skip(skip).then(function (categorys) {
            res.render('admin/category_index',{
                userInfo: req.userInfo,
                categorys:categorys,
                limit:limit,
                dataCount:dcount,
                page:page,
                pages:pages
            });
        });
    });
});


//分类添加
router.get('/category/add',function(req,res){
    res.render('admin/category_add',{
        userInfo: req.userInfo
    })
});

router.post('/category/add',function(req,res){
    var _name = req.body.txt_name || '';
    if(_name == ""){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'名称不能为空！~'
        });
    }else{
        category.findOne({
            name:_name
        }).then(function(result){
            if(result){
                res.render('admin/error',{
                    userInfo:req.userInfo,
                    message:'分类已存在！~'
                });
                return Promise.reject();
            }else{
                return new category({
                    name:_name
                }).save();
            }
        }).then(function(){
            res.render('admin/success',{
                userInfo:req.userInfo,
                message:'保存成功！~',
                url:'/admin/category'
            });
        });
    }
});

router.get('/category/edit',function (req,res) {
    var _id = req.query.id || '';

    if(_id){
        category.findOne({
            _id:_id
        }).then(function (category) {
            if(category){
                res.render('admin/category_edit',{
                    userInfo:req.userInfo,
                    category:category
                });
            }else{
                res.render('admin/error',{
                    userInfo:req.userInfo,
                    message:'分类不存在！~'
                });
            }
        });
    }else{
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'分类不存在1！~'
        });
    }
});
//修改分类
router.post('/category/edit',function(req,res){
    var _name = req.body.txt_name || '';
    if(_name == ""){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'名称不能为空！~'
        });
    }else{
        var _id = req.query.id || '';

        if(_id){
            category.findOne({
                _id:_id
            }).then(function (result) {
                if(result){
                    if(result.name == _name){
                        res.render('admin/success',{
                            userInfo:req.userInfo,
                            message:'保存成功！~',
                            url:'/admin/category'
                        });
                        return Promise.reject();
                    }else{
                        return category.findOne({
                            _id : {$ne: _id},
                            name: _name
                        });
                    }
                }else{
                    res.render('admin/error',{
                        userInfo:req.userInfo,
                        message:'分类不存在！~'
                    });
                    return Promise.reject();
                }
            }).then(function (sameCategory) {
                if(sameCategory){
                    res.render('admin/error',{
                        userInfo:req.userInfo,
                        message:'数据库中已存在同名分类！~'
                    });
                    return Promise.reject();
                }else{
                    return category.update({
                        _id : _id
                    },{
                        name:_name
                    });
                }
            }).then(function () {
                res.render('admin/success',{
                    userInfo:req.userInfo,
                    message:'保存成功！~',
                    url:'/admin/category'
                });
                return Promise.reject();
            });
        }else{
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类不存在1！~'
            });
        }
    }
});
//分类删除
router.get('/category/del',function (req,res) {
    _id = req.query.id || "";
    if(_id){
        category.findOne({
            _id:_id
        }).then(function(result){
            if(result){
                return category.remove({
                    _id:_id
                });
            }else{
                res.render('admin/error',{
                    userInfo:req.userInfo,
                    message:'该分类不存在！~'
                });
                return Promise.reject();
            }
        }).then(function () {
            res.render('admin/success',{
                userInfo:req.userInfo,
                message:'删除成功！',
                url:'/admin/category'
            });
        });
    }else{
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'该分类不存在！~'
        });
    }
});

//内容管理
router.get('/content',function (req,res) {
    const limit = 10;
    var page = Number(req.query.page || 1);
    var skip = (page-1) * limit;
    var pages = 0;

    content.count().then(function(dcount){

        pages = Math.ceil(dcount/limit);
        page = Math.min(page,pages);
        page = Math.max(page,1);
        skip = (page-1) * limit;

        // sort 1升序 -1降序
        content.find().sort({_id:-1}).limit(limit).skip(skip).populate(['category','user']).then(function (contents) {
            res.render('admin/content_index',{
                userInfo: req.userInfo,
                contents:contents,
                limit:limit,
                dataCount:dcount,
                page:page,
                pages:pages
            });
        });
    });

});


//内容添加
router.get('/content/add',function (req,res) {
    category.find().then(function (result) {
        res.render('admin/content_add',{
            userInfo:req.userInfo,
            categorys:result
        })
    });


});

//内容保存
router.post('/content/add',function (req,res) {
    var _cid = req.body.ddl_category || '';
    if(_cid){
        new content({
            category:_cid,
            title:req.body.txt_title,
            user:req.userInfo._id,
            description:req.body.txt_description,
            content:req.body.txt_content
        }).save().then(function(result){
            res.render('admin/success',{
                userInfo:req.userInfo,
                message:'保存成功！~',
                url:'/admin/content'
            });
            return;
        });
    }else{
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'内容分类不能为空'
        });
        return;
    }
});

//显示内容修改页面
router.get('/content/edit',function (req,res) {
    var _id = req.query.id || '';

    if(_id){
        content.findOne({
            _id:_id
        }).then(function (result) {
            if(result){
                category.find().then(function (categorys) {
                    res.render('admin/content_edit',{
                        userInfo:req.userInfo,
                        content:result,
                        categorys:categorys
                    });
                });
            }else{
                res.render('admin/error',{
                    userInfo:req.userInfo,
                    message:'指定内容不存在！~'
                });
            }
        });
    }else{
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'指定内容不存在！~'
        });
    }
});

//修改内容
router.post('/content/edit',function(req,res){
    var _name = req.body.txt_title || '';
    if(_name == ""){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'标题不能为空！~'
        });
    }else{
        var _id = req.query.id || '';

        if(_id){
            content.findOne({
                _id:_id
            }).then(function (result) {
                if(result){
                    return content.update({
                        _id : _id
                    },{
                        category:req.body.ddl_category,
                        title:_name,
                        description:req.body.txt_description,
                        content:req.body.txt_content
                    });
                }else{
                    res.render('admin/error',{
                        userInfo:req.userInfo,
                        message:'内容不存在！~'
                    });
                    return Promise.reject();
                }
            }).then(function () {
                res.render('admin/success',{
                    userInfo:req.userInfo,
                    message:'保存成功！~',
                    url:'/admin/content'
                });
                return Promise.reject();
            });
        }else{
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'内容不存在1！~'
            });
        }
    }
});
//内容删除
router.get('/content/del',function (req,res) {
    var _id = req.query.id || "";
    if(_id){
        content.findOne({
            _id:_id
        }).then(function(result){
            if(result){
                return content.remove({
                    _id:_id
                });
            }else{
                res.render('admin/error',{
                    userInfo:req.userInfo,
                    message:'该内容不存在！~'
                });
                return Promise.reject();
            }
        }).then(function () {
            res.render('admin/success',{
                userInfo:req.userInfo,
                message:'删除成功！',
                url:'/admin/content'
            });
        });
    }else{
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'该内容不存在！~'
        });
    }
});

module.exports = router;

