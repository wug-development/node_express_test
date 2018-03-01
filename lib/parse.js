//./lib/parse.js
const signature = require('cookie-signature');

exports.signedCookies = function(obj, secret){
    var cookies = Object.keys(obj);    //获取obj对象的property
    var dec;
    var key;
    var ret = Object.create(null);  //创建返回对象
    var val;

    for (var i = 0; i < cookies.length; i++) {
        key = cookies[i];
        val = obj[key];
        dec = exports.signedCookie(val, secret);

        //判断是否是去掉签名后的value，如果是保存该值到ret中同时删除obj中的相应property
        if (val !== dec) {
            ret[key] = dec;
            delete obj[key];
        }
    }
    return ret;
};

exports.signedCookie = function(str, secret){
    //判断是否添加了签名，如果添加了签名则去掉签名，否则返回原字符串
    return str.substr(0, 2) === 's:'
        ? signature.unsign(str.slice(2), secret)
        : str;
};