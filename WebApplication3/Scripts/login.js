//var a=(function(a){a={b:123};return {b:a.b};})(a); alert(a.b)
//var a = { b: 123 }; alert(a.b)
define(function (require, exports, module) {

    require('jquery');
    require('cookie');
    require('easyui');
    require('easyuiCN');
    var Common = require('common');//exports.model时需要用变量来接

    var loginJs = {
        _init: function () {
            var user = JSON.parse($.cookie("loginInfo"));

            $('#loginNo').validatebox({
                required: true,
                missingMessage: '请输入登录帐号',
                invalidMessage: '登录帐号不得为空'
            });

            $('#passwd').validatebox({
                required: false,
                validType: 'length[1,30]',
                missingMessage: '请输入登录密码',
                invalidMessage: '登录密码不得为空'
            });

            if (!$('#loginNo').validatebox('isValid')) {
                $('#loginNo').focus();
            } else if (!$('#passwd').validatebox('isValid')) {
                $('#passwd').focus();
            }

            var submitLoginForm = function () {
                if (!$('#loginNo').validatebox('isValid')) {
                    $('#loginNo').focus();
                } else if (!$('#passwd').validatebox('isValid')) {
                    $('#passwd').focus();
                } else {
                    $.ajax({
                        url: '../api/userinfo/Login',
                        type: 'Get',
                        data: $('#login-form').serialize(),
                        //data:JSON.stringify
                        beforeSend: function () {
                            $.messager.progress({
                                text: '正在登录中...'
                            });
                        },
                        success: function (data, response, status) {
                            $.messager.progress('close');
                            if (data.success === true) {
                                var d = data.data;
                                $.cookie('loginNo', $('#loginNo').val());                                
                                var loginInfo = {};
                                loginInfo = d;
                                loginInfo.name = d.username;                               
                                $.cookie('loginInfo', JSON.stringify(loginInfo));
                                $.cookie('SessionKey',d.SessionKey)
                               location.href = $('#login-form').attr('action');
                            } else {
                                Common.showMsg({
                                    title: '提示信息55',
                                    msg: '用户名或密码不正确，请重新输入！'
                                }, 'warning', function () {
                                    $('#passwd').select();
                                });
                            }
                        }
                    });
                    return false;
                }
                return false;
            };

            $('#user_login').bind('click', function (event) {
                submitLoginForm();
            });
        }
    };

    $(document).ready(function () {
        loginJs._init();
    })
});
