/*
* 武广2018-03-01
* 首页登录注册功能
* */
// project util.js
$(function(){

    // 登录注册切换
    $('.j_userTab span').on('click',function(){
        var _index = $(this).index();
        $(this).addClass('user_cur').siblings().removeClass('user_cur');
        $('.user_login,.user_register').hide();
        if( _index==0 ){
            $('.user_login').css('display','inline-block');
            $('.user_register').hide();
        }else{
            $('.user_login').hide();
            $('.user_register').css('display','inline-block');
        }
    });

    // 登录校验
    var reg = /^[^<>"'$\|?~*&@(){}]*$/;
    var $login = $('#login');
    var $register = $('#register');
    $('.user_login_btn').on('click',function(){
        if( $login.find('.user_input').eq(0).find('input').val().trim() == '' ){
            $login.find('.user_err span').text('用户名不能为空').show();
            return false;
        }
        if( !reg.test($login.find('.user_input').eq(0).find('input').val().trim()) ){
            $login.find('.user_err span').text('用户名不能含有特殊字符').show();
            return false;
        }
        if( $login.find('.user_input').eq(1).find('input').val().trim() == '' ){
            $login.find('.user_err span').text('密码不能为空').show();
            return false;
        }
        if( !reg.test($login.find('.user_input').eq(1).find('input').val().trim()) ){
            $login.find('.user_err span').text('密码不能含有特殊字符').show();
            return false;
        }
        $login.find('.user_err span').text('').hide();

        $.ajax({
            type:'post',
            url:'/api/user/login',
            data:{
                username:$('#txt_uname').val(),
                password:$('#txt_upass').val()
            },
            dataType:'json',
            success:function(res){
                console.log(res);
                if(res.code == 1){
                    $login.find('.user_err span').text(res.message).show();
                    /*setTimeout(function(){
                        $('.user_login').css('display','inline-block');
                        $('.user_register').hide();
                    },3000);*/
                    window.location.href = window.location.href;

                }else{
                    $login.find('.user_err span').text(res.message).show();
                }
            }
        });
    });

    $('.user_register_btn').on('click',function(){
        if( $register.find('.user_input').eq(0).find('input').val().trim() == '' ){
            $register.find('.user_err span').text('用户名不能为空').show();
            return false;
        }
        if( !reg.test($register.find('.user_input').eq(0).find('input').val().trim()) ){
            $register.find('.user_err span').text('用户名不能含有特殊字符').show();
            return false;
        }
        if( $register.find('.user_input').eq(1).find('input').val().trim() == '' ){
            $register.find('.user_err span').text('密码不能为空').show();
            return false;
        }
        if( !reg.test($register.find('.user_input').eq(1).find('input').val().trim()) ){
            $register.find('.user_err span').text('密码不能含有特殊字符').show();
            return false;
        }
        if( $register.find('.user_input').eq(1).find('input').val().trim() != 
            $register.find('.user_input').eq(2).find('input').val().trim()
        ){
            $register.find('.user_err span').text('两次输入的密码不一致').show();
            return false;
        }
        $register.find('.user_err span').text('').hide();


        $.ajax({
            type:'post',
            url:'/api/user/register',
            data:{
                username:$('input[name=txt_uname]').val(),
                password:$('input[name=txt_upass]').val(),
                repassword:$('input[name=txt_eupass]').val()
            },
            dataType:'json',
            success:function(res){
                if(res.code == 1){
                    $register.find('.user_err span').text(res.message).show();
                    window.location.href = window.location.href;
                }else{
                    $register.find('.user_err span').text(res.message).show();
                }
            }
        });
    });

    //退出登录
    $('#loginOut').on('click',function(){
        $.ajax({
            type:'get',
            url:'/api/user/loginOut',
            dataType:'json',
            success:function(res){
                if(res.code == 1){
                    window.location.href = window.location.href;
                }else{
                    $register.find('.user_err span').text(res.message).show();
                }
            }
        });
    });
});