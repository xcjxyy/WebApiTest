
//注销
widgetUserLogout: function() {
    CommonWidget.widgetUserCheckLogin();
    var user = JSON.parse($.cookie("loginInfo")) || {};

    // 获取登录信息
    user.name = user.name || user.loginNo;
    $('#login-name').text(user.name);
    var deptName = user.currentDept ? user.currentDept.name : '';
    var roleName = user.currentRole ? user.currentRole.name : '';
    $('#role-name').text(
        deptName + (deptName != '' && roleName != '' ? '-' : '') + roleName);
    // 注销
    $('#logout').bind('click',function(e) {
        $.messager.confirm("确认提示", '您确认要退出系统？', function(b) {
            if (b) {
                e.preventDefault();
                $.ajax({
                    type: "GET",
                    url: CommonWidget.parseUrl('/admin/logout'),
                    dataType: "json",
                    success: function(responseData) {
                        if (responseData.success) {
                            // 提示退出成功
                            $.messager.show({
                                title: '提示信息',
                                msg: '你已退出系统，2秒后将自动跳转至登录页面',
                                timeout: 0,
                                showType: 'show',
                                style: {
                                    right: '',
                                    bottom: ''
                                }
                            });
                            setTimeout(function() {
                                location.href = 'login.jsp';
                            }, 2000);
                        } else {
                            CommonWidget.showMsg({
                                title: '提示信息',
                                msg: '退出失败！'
                            }, 'warning');
                        }
                    },
                    error: CommonWidget.handleError
                });
            }
        });
    });

    window.console = window.console || (function() {
        var c = {};
        c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function() {};
        return c;
    })();
    $('#body').layout();
    setTimeout(function() {
        $('.form-horizontal, .dialog-view, #copyright, .welcome-note').css({
            "visibility": "visible"
        });
    }, 1000);
},

//角色切换
buttons: [{
    text: '切换',
    iconCls: 'icon-ok',
    handler: function() {
        var roleId = $('#roleId').combobox('getValue');
        role.changeRole(roleId, function(responseData) {           //changeRole方法
            $.messager.progress('close');
            // Cookie中保存当前科室和角色
            user.currentDeptId = $('#deptId').combobox('getValue');
            user.currentRole = $('#roleId').combobox('getValue');
            user.currentRoleId = $('#roleId').combobox('getValue');
            user.currentRoleName = $('#roleId').combobox('getText');
            user.deptId = $('#deptId').combobox('getValue');
            user.deptName = $('#deptId').combobox('getText');
            $.cookie('loginInfo', JSON.stringify(responseData));
            $('#change-user-dialog').dialog('close');
            $.messager.show({
                title: '提示信息',
                msg: '切换成功，2秒后将重新加载页面！',
                timeout: 2000,
                showType: 'show',
                style: {
                    right: '',
                    bottom: ''
                }
            });
            setTimeout(function() {
                location.href = 'index.jsp';
            }, 2000);
        });
    }
}]

/**
	 * 切换登录用户的当前角色
	 * 
	 * @param {string} id 角色ID（必填）
	 * @param {Function} callback 回调函数
	 */
e.changeRole = function (id, callback) {
    request.getData('/admin/role/changeRole/' + id, function (t) {
        callback && callback(t.data);
    });
};

//转换Url
parseUrl: function(url) {
    var configWidget = CommonWidget.config();
    if (config.pathType == 1) {
        var arr = url.split('/');
        url = config.dataPath;
        var parameter = '';
        for (var i = 2, len = arr.length; i < len; i++) {
            if (arr[i]) {
                if (i < 4) {
                    url += arr[i] + '_';
                } else if (i == 4) {
                    parameter += "&parentid=" + arr[i];
                }

            }
        }
        url = url.substr(0, (url.length - 1));
        url += config.dataSuffix;
        if (parameter) {
            parameter = "?" + parameter.substr(1);
            url += parameter;
        }
    } else {
        url = config.webPath + url;
    }
    return url;
},
