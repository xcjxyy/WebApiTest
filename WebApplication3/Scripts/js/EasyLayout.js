define(function (require, exports, module) {
    require('jquery');
    require('cookie');
    require('easyui');
    require('easyuiCN');
    var common = require('common');


    var initMenus = [{ componentName: "L1-1", parentId: "application", id: "application.applicationManage", url: null, componentId: "applicationManage", permision: false, index: 1, type: "1" },  // permision: false, index: 1, type: "1"  无用
                     { componentName: "L1-2", parentId: "application", id: "application.packageManage", url: null, componentId: "packageManage", "permision": false, index: 1, type: "1" },
                     { componentName: "L2-4公共套餐", parentId: "application.packageManage", id: "application.packageManage.package", url: "InputTable.html", componentId: "package", permision: false, index: 1, type: "2" },
                     { componentName: "L2-1我的请领单", parentId: "application.applicationManage", id: "application.applicationManage.applicationOrder", url: "GridTable.html", componentId: "applicationOrder", permision: false, index: 3, type: "2" },
                     { componentName: "L2-5科室套餐", parentId: "application.packageManage", id: "application.packageManage.packageForDept", url: "InputTable.html", componentId: "packageForDept", permision: false, index: 2, type: "2" },
                     { componentName: "L2-2请领车", parentId: "application.applicationManage", id: "application.applicationManage.applicationCart", url: "InputTable.html", componentId: "applicationCart", permision: false, index: 2, type: "2" },
                     { componentName: "L2-3我要请领", parentId: "application.applicationManage", id: "application.applicationManage.toApply", url: "InputTable.html", componentId: "toApply", permision: false, index: 1, type: "2" }
    ];


    $('#body').layout();
    $('#body').layout('expand', 'west');
   // $('#body').layout('panel', 'west').panel('setTitle', 'HAHA');

    //---菜单模块开始
    //过程函数 将单层菜单数组jsons 递归转成有子数组层级的json
    function _createMenu(jsons, parentid) {
        var gc = function (parentid) {
            var cn = [];
            for (var i = 0; i < jsons.length; i++) {
                var n = jsons[i];
                if (n.parentId == parentid) {
                    n.menuid = n.id;
                    n.icon = 'icon-sys';
                    n.menuname = n.componentName;
                    if (!n.url) {
                    n.url = "";//"configWidget.webPath" + "/pages/admin/" + n.componentId + "/" + n.componentId + ".jsp";
                    } else {
                        n.url = n.url;
                    }
                    n.menus = gc(n.id); //**递归menus为n子数组if(n.parentId == parentid)即调用 并遍历整个jsons
                    cn.push(n);
                }
            }
            return cn;
        };
        return gc(parentid);

    };
    
    var $sideMenu = $('#nav-aside');
    $sideMenu.remove();
    $sideMenu = $('<div id="nav-aside"></div>');
    $sideMenu.appendTo('#sidebar');    //#sidebar  west区域id
    $sideMenu.accordion({
        fit: true,
        border: false,
        selected: false,
        onSelect: function () {
        }
    });

    var menus = _createMenu(initMenus, 'application');

    $.each(menus, function (i, n) {
        var menuList = [];
        menuList.push('<ul class="navlist">');
        $.each(n.menus, function (j, o) {
            menuList.push('<li>');
            menuList.push('<div>');
            menuList.push('<a ref="' + o.menuid + '" href="javascript:void(0)" rel="' + o.url + '">');
            menuList.push('<span class="icon ' + o.icon + '" > </span>');
            menuList.push('<span class="nav">' + o.menuname + '</span>');
            menuList.push('</a>');
            menuList.push('</div>');
            menuList.push('</li>');
        });
        menuList.push('</ul>');
        var menulist = menuList.join('');

        $sideMenu.accordion('add', {
            title: n.menuname + 'xcj',// n.menuname  一级菜单名
            content: menulist,        // n.menus     二级菜单
            border: false,
            //selected: true,
            iconCls: 'icon ' + n.icon
        });
    });

    //打开第一个一级菜单
    $sideMenu.accordion('select', 0);


    var sidebar = {};
    setTimeout(function () {
        sidebar.lists = $('.navlist li div');
        sidebar.links = $('.navlist li a');
        //二级菜单click事件
        sidebar.links.click(function (e) {
            e.preventDefault();
            $.messager.progress({
                text: '内容加载中...'
            });
            sidebar.lists.removeClass('selected');
            $(this).parent().addClass('selected');

            //打开Tab选项卡
            var url = $(this).attr("rel");

            var tabTitle = $(this).children('.nav').text();
            //$('#viewFramework-tabs').tab();
            if (url) {                                       //***************************  在tab content打开页面
                if ($('#viewFramework-tabs').tabs('exists', tabTitle)) {
                    $('#viewFramework-tabs').tabs('select', tabTitle);
                } else {
                    $('#viewFramework-tabs').tabs('add', {
                        title: tabTitle,
                        //iconCls : node.iconCls,
                        closable: true,
                        content: _createFrame(url)
                    });
                }
            }
            $.messager.progress('close');
            return false;
        }).hover(function () {
            $(this).parent().addClass("hover");
        }, function () {
            $(this).parent().removeClass("hover");
        });
    }, 500);
    //---菜单模块结束


    function _createFrame(url) {
        var s = '<iframe name="mainFrame" scrolling="auto" frameborder="0"  src="' + url + '?_=' + (new Date()).valueOf() + '" style="width:100%;height:100%; border: 0 none;"></iframe>';
        return s;
    }

    $('#viewFramework-tabs').tabs({//***出现tab前要有   欢迎使用 tab
        fit: true,
        border: true,
        hasContextMenu: true
    });
    //$('#viewFramework-tabs').tabs('add', {
    //    //fit: true,
    //    title: 'sohu',
    //    content: _createFrame('index.html'),
    //    closable: true
    //});
    //$('#viewFramework-tabs').tabs('add', {
    //    //fit: true,
    //    title: 'New Tab',
    //    content: _createFrame('www.sohu.com'),
    //    closable: true,
    //    tools: [{
    //        iconCls: 'icon-mini-refresh',
    //        handler: function () {
    //            alert('refresh');
    //        }
    //    }]
    //});
    
    var logout = function () {
        //CommonWidget.widgetUserCheckLogin();
        var user = JSON.parse($.cookie("loginInfo")) || {};
        // 获取登录信息
        user.name = user.name || user.loginNo;
        $('#login-name').text(user.name);
        var deptName = user.currentDept ? user.currentDept.name : '';
        var roleName = user.currentRole ? user.currentRole.name : '';
        $('#role-name').text(
            deptName + (deptName != '' && roleName != '' ? '-' : '') + roleName);
        // 注销
        $('#logout').bind('click', function (e) {
            $.messager.confirm("确认提示", '您确认要退出系统？', function (b) {
                if (b) {
                    e.preventDefault();
                    $.ajax({
                        type: "GET",
                        url: '../api/userinfo/Logout',    // '/admin/logout'后台清除session对象
                        dataType: "json",
                        success: function (responseData) {
                            if (responseData.success) {
                                // 提示退出成功
                                common.showMsg({
                                    title: '提示信息common',
                                    msg: '你已退出系统，2秒后将自动跳转至登录页面',
                                    timeout: 0,
                                    showType: 'show',
                                    style: {
                                        right: '',
                                        bottom: ''
                                    }
                                });
                                setTimeout(function () {
                                    location.href = 'login.html';
                                }, 2000);
                            } else {
                                common.showMsg({
                                    title: '提示信息',
                                    msg: '退出失败！'
                                }, 'warning');
                            }
                        },
                        error: common.handleError
                    });
                }
            });
        });
    };
    logout();
    $(window).resize();




})