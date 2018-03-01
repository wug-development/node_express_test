/**
 * Created by wu on 2018/2/13.
 */

const express = require('express');
const router = express.Router();

router.get('/',function(req,res,next){
    console.log(req.userinfo);
    res.render('main/index',{
        userinfo:req.userinfo
    });
});

module.exports = router;

