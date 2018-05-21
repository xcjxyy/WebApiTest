define(function (require, exports, module) {

    var CommonWidget =
        //(function (Common) {
        //    Common = 
        {
            initToolbar: function (actions) {
                var returnArr = [];
                var tools = [];
                // 根据用户角色获取操作权限
                // var toolArr = CommonWidget.operatingAuthority();
                if (actions instanceof Array) {
                    for (var i in actions) {
                        var o = actions[i];
                        // 按钮是否禁用
                        var buttonDisabled = false;
                        tools[o] = $('#btn-' + o);
                        //if (toolArr[o] && toolArr[o].componentId) {
                        //    buttonDisabled = false;
                        //}
                        $(tools[o]).linkbutton({
                            disabled: buttonDisabled
                        });
                        returnArr[o] = $(tools[o]);
                    }
                }
                return returnArr;
            },
            
            showMsg: function (options, type) {
                    options = options || {};
                    options.title = options.title || '提示';
                    options.msg = options.msg || '未知错误';
                    options.position = options.position || 'center';
                    options.showType = options.showType || 'slide';
                    // slide|show|fade|null
                    options.timeout = options.timeout || 3000;
                    // miniseconds 默认:3000 , 0不关闭
                    options.height = options.height || 100;
                    // 消息提示类型,默认info
                    type = type || 'info';
                    switch (options.position) {
                        case 'topLeft':
                        case 'topleft':
                        case 'top-left':
                        case 'leftTop':
                        case 'left-top':
                        case 'lefttop':
                            options.style = {
                                right: '',
                                left: 0,
                                top: document.body.scrollTop + document.documentElement.scrollTop,
                                bottom: ''
                            };
                            break;
                        case 'topCenter':
                        case 'topcenter':
                        case 'top-center':
                        case 'centerTop':
                        case 'centertop':
                        case 'center-top':
                            options.style = {
                                right: '',
                                top: document.body.scrollTop + document.documentElement.scrollTop,
                                bottom: ''
                            };
                            break;
                        case 'topRight':
                        case 'topright':
                        case 'top-right':
                        case 'rightTop':
                        case 'righttop':
                        case 'right-top':
                            options.style = {
                                left: '',
                                right: 0,
                                top: document.body.scrollTop + document.documentElement.scrollTop,
                                bottom: ''
                            };
                            break;
                        case 'centerLeft':
                        case 'center-left':
                        case 'centerleft':
                        case 'leftCenter':
                        case 'leftcenter':
                        case 'left-center':
                            options.style = {
                                left: 0,
                                right: '',
                                bottom: ''
                            };
                            break;
                        case 'centerRight':
                        case 'centerright':
                        case 'center-right':
                        case 'rightCenter':
                        case 'rightcenter':
                        case 'right-center':
                            options.style = {
                                left: '',
                                right: 0,
                                bottom: ''
                            };
                            break;
                        case 'center':
                            options.style = {
                                right: '',
                                bottom: ''
                            };
                            break;
                        case 'bottomLeft':
                        case 'bottomleft':
                        case 'bottom-left':
                        case 'leftBottom':
                        case 'leftbottom':
                        case 'left-bottom':
                            options.style = {
                                left: 0,
                                right: '',
                                top: '',
                                bottom: -document.body.scrollTop - document.documentElement.scrollTop
                            };
                            break;
                        case 'bottomCenter':
                        case 'bottomcenter':
                        case 'bottom-center':
                        case 'centerBottom':
                        case 'centerbottom':
                        case 'center-bottom':
                            options.style = {
                                right: '',
                                top: '',
                                bottom: -document.body.scrollTop - document.documentElement.scrollTop
                            };
                            break;
                        case 'bottomRight':
                        case 'bottomright':
                        case 'bottom-right':
                        case 'rightBottom':
                        case 'rightbottom':
                        case 'right-bottom':
                            // easyui默认位置
                            break;
                        default:
                            options.style = {
                                right: '',
                                bottom: ''
                            };
                    }
                    //alert("I am ")
                    delete(options.position);

                    // 消息类型, info | success | error | alert
                    if (type == 'info') {
                        $.messager.show(options);
                    } else {
                        $.messager.alert(options.title, options.msg, 'info');
                    }
            },
            config: function () {
                var currentScreen;
                var config = {
                    webPath: "/ystone", // 网站路;
                    pathType: 0, // 默认为0 0：动态 1 伪静态 2index.jsp式的伪静态
                    dataPath: '/ystone/data/', // CDN JSON
                    jsPath: '/ystone/statics/js/', // CDN JS
                    cssPath: '/ystone/statics/css/', // CDN CSS
                    imgPath: '/ystone/statics/images/', // CDN img
                    cookieDomain: '', // Cookie 作用域
                    cookiePath: '/ystone', // Cookie 作用路径
                    dataSuffix: '.json', // 返回数据的后缀，与pathType有关
                    debug: false, // 调试默认开启
                    datebox: {
                        interval: 7, // 两个日期之间的时间间隔
                    },
                    page: {
                        isPagination: false, // 是否分页
                        pageSize: 15, // 每页显示
                        pageList: [15, 50, 100, 200],
                        pageNumber: 1
                        // 起始页
                    }
                };
                if (screen.width >= 1920) {
                    $('body').addClass('wide-screen');
                    currentScreen = 'wide';
                } else if (screen.width <= 1700 && screen.width > 1200) { // 1280  1366
                    $('body').addClass('normal-screen');
                    currentScreen = 'normal';
                } else if (screen.width <= 1200) { // 1280
                    $('body').addClass('narrow-screen');
                    currentScreen = 'narrow';
                }
                if (currentScreen == 'narrow') {
                    config.Dialog = {
                        width: 800,
                        height: 492,
                        message: "内容加载中..."
                    };
                } else if (currentScreen == 'normal') {
                    config.Dialog = {
                        width: 1040,
                        height: 492,
                        message: "内容加载中..."
                    };
                } else {
                    config.Dialog = {
                        width: 1080,
                        height: 492,
                        message: "内容加载中..."
                    };
                }
                config.currentScreen = currentScreen;
                return config;
            },


            extendEasyui: function () {

                var configWidget = CommonWidget.config();

                //只显示年月算法
                $.extend($.fn.combobox.methods, {
                    yearandmonth: function (jq) {
                        return jq.each(function () {
                            var obj = $(this).combobox();
                            var date = new Date();
                            var year = date.getFullYear();
                            var month = date.getMonth() + 1;
                            var table = $('<table>');
                            var tr1 = $('<tr class="tr1">');
                            var tr1td1 = $('<td>', {
                                text: '-',
                                click: function () {
                                    var y = $(this).next().html();
                                    y = parseInt(y) - 1;
                                    $(this).next().html(y);
                                }
                            });
                            tr1td1.appendTo(tr1);
                            var tr1td2 = $('<td>', {
                                text: year
                            }).appendTo(tr1);

                            var tr1td3 = $('<td>', {
                                text: '+',
                                click: function () {
                                    var y = $(this).prev().html();
                                    y = parseInt(y) + 1;
                                    $(this).prev().html(y);
                                }
                            }).appendTo(tr1);
                            tr1.appendTo(table);

                            var n = 1;
                            for (var i = 1; i <= 4; i++) {
                                var tr = $('<tr>');
                                for (var m = 1; m <= 3; m++) {
                                    var td = $('<td>', {
                                        text: n,
                                        click: function () {
                                            var yyyy = $(table).find("tr:first>td:eq(1)").html();
                                            var cell = $(this).html();
                                            var v = yyyy + '-' + (cell.length < 2 ? '0' + cell : cell);
                                            obj.combobox('setValue', v).combobox('hidePanel');

                                        }
                                    });
                                    if (n == month) {
                                        td.addClass('tdbackground');
                                    }
                                    td.appendTo(tr);
                                    n++;
                                }
                                tr.appendTo(table);
                            }
                            var h2 = $('<h2>', {
                                text: '清除',
                                click: function () {
                                    obj.combobox('setValue', '').combobox('hidePanel');
                                }
                            }).appendTo(table);
                            table.addClass('mytable cursor');
                            table.find('td').hover(function () {
                                $(this).addClass('tdbackground');
                            }, function () {
                                $(this).removeClass('tdbackground');
                            });
                            table.appendTo(obj.combobox("panel"));

                        });
                    }
                });

                /**
                 * 选中行号
                 */
                $.extend(
                    $.fn.datagrid.methods, {
                        getRowNum: function (jq) {
                            var opts = $.data(jq[0], "datagrid").options;
                            var array = new Array();
                            opts.finder.getTr(jq[0], "", "selected", 1).each(function () {
                                array.push($(this).find("td.datagrid-td-rownumber").text());
                            });
                            return array;
                            // .join(",");
                        },
                        /*
                         * getEditorRowIndexs: function (jq) { var opts =
                         * $.data(jq[0], "datagrid").options; var array =
                         * new Array(); opts.finder.getTr(jq[0], "",
                         * "selected", 1).each(function () {
                         * array.push($(this).find("td.datagrid-td-rownumber").text());
                         * }); return array; //.join(","); },
                         */
                        keyCtr: function (jq) {
                            return jq.each(function () {
                                var grid = $(this);
                                grid.datagrid('getPanel').panel('panel').attr('tabindex', 1).bind('keydown', function (e) {
                                    switch (e.keyCode) {
                                        case 38:
                                            // up
                                            var selected = grid.datagrid('getSelected');
                                            if (selected) {
                                                var index = grid.datagrid('getRowIndex', selected);
                                                grid.datagrid('selectRow', index - 1);
                                            } else {
                                                var rows = grid.datagrid('getRows');
                                                grid.datagrid('selectRow', rows.length - 1);
                                            }
                                            break;
                                        case 40:
                                            // down
                                            var selected = grid.datagrid('getSelected');
                                            if (selected) {
                                                var index = grid.datagrid('getRowIndex', selected);
                                                grid.datagrid('selectRow', index + 1);
                                            } else {
                                                grid.datagrid('selectRow', 0);
                                            }
                                            break;
                                    }
                                });
                            });
                        }
                    });

                // 支持ESC关闭对话框
                $.extend($.fn.dialog.methods, {
                    supportEsc: function (jq) {
                        return jq.each(function () {
                            var self = $(this);
                            $(document).keydown(function (event) {
                                if (event.keyCode == 27 || event.which === 27) {
                                    self.dialog('close');
                                }
                            });
                        });
                    }
                });

                /**
                 * dialog继承添加保存和取消按钮
                 * 用法:$('#ele').dialog('show',dialog_options,save_func,save_url);
                 */
                $.extend($.fn.dialog.methods, {
                    show: function (jq, options) {
                        var _initDialogButtons = function () {
                            var buttons = [];
                            var save = {
                                text: '保存',
                                iconCls: 'icon-edit-new',
                                handler: function () {
                                    CommonWidget.AJAX.getAjaxData({
                                        url: options.url,
                                        data: $(options.target).serialize()
                                    }, eval(options.func));
                                }
                            },
                                cancel = {
                                    text: '取消',
                                    iconCls: 'icon-redo',
                                    handler: function () {
                                        $(options.target).dialog('close');
                                    }
                                };

                            buttons.push(save);
                            buttons.push(cancel);

                            return buttons;
                        };

                        options = options || {};
                        options.title = options.title || {};
                        options.width = options.width || 600;
                        options.closed = options.closed || false;
                        options.cache = options.cache || false;
                        options.modal = options.modal || true;
                        options.iconCls = options.iconCls || '';
                        options.buttons = options.buttons || _initDialogButtons();

                        $(options.target).dialog(options);
                    }
                });

                /**
                 * 自定义验证规则
                 * 
                 * @date 2016/03/08 <input class="easyui-validatebox"
                 *       data-options="validType:'minLength[5]'">
                 */
                $.extend(
                    $.fn.validatebox.defaults.rules, {
                        // 中文验证
                        zh: {
                            validator: function (value, param) {
                                return /^[\u4e00-\u9fa5]+$/.test(value);
                            },
                            message: "请输入中文"
                        },
                        // 英文
                        en: {
                            validator: function (value, param) {
                                return /^[A-Za-z]+$/.test(value);
                            },
                            message: "请输入英文"
                        },
                        // 数字
                        number: {
                            validator: function (value, param) {
                                return /^\d+$/.test(value);
                            },
                            message: "请输入数字"
                        },
                        date: {
                            validator: function (value, param) {
                                return /^(\d{4})-(\d{2})-(\d{2})$/.test(value);
                            },
                            message: "请输入正确的日期（示例：2017-05-12）"
                        },
                        // 数字字母或下划线
                        zh_en_: {
                            validator: function (value, param) {
                                return /^[a-zA-Z0-9_]+$/.test(value);
                            },
                            message: "请输入数字字母或下划线"
                        },
                        // 电话号码验证
                        tel: {
                            validator: function (value, param) {
                                return /^(?:(?:0\d{2,3})-)?(?:\d{7,8})(-(?:\d{3,}))?$/
                                    .test(value);
                            },
                            message: "请输入正确电话（示例：0571-45678912）"
                        },
                        // 手机号码验证
                        mobile: {
                            validator: function (value, param) {
                                return /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/
                                    .test(value);
                            },
                            message: "请输入正确手机号（11位）"
                        },
                        // 电话验证
                        mobileAndTel: {
                            validator: function (value, param) {
                                return /(^([0\+]\d{2,3})\d{3,4}\-\d{3,8}$)|(^([0\+]\d{2,3})\d{3,4}\d{3,8}$)|(^([0\+]\d{2,3}){0,1}13\d{9}$)|(^\d{3,4}\d{3,8}$)|(^\d{3,4}\-\d{3,8}$)/
                                    .test(value);
                            },
                            message: "请输入正确电话"
                        },
                        // QQ验证
                        qq: {
                            validator: function (value, param) {
                                return /^[1-9]\d{4,11}$/.test(value);
                            },
                            message: "请输入正确的QQ号码"
                        },
                        // 邮编验证
                        zip: {
                            validator: function (value, param) {
                                return /^[0-9]{6}$/.test(value);
                            },
                            message: "请输入正确的邮编"
                        },
                        // Email、Url 本身已包含

                        // 身份证验证
                        idcard: {
                            validator: function (value, param) {
                                return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
                                    .test(value);
                            },
                            message: '请输入正确的身份证号'
                        },
                        // 密码验证
                        equals: {
                            validator: function (value, param) {
                                return value == $(param[0]).val();
                            },
                            message: '两次输入不一致'
                        }

                        // 异步验证
                        // remote['param[0]','param[1]','param[2]']
                        // remote: {
                        // validator: function(value, param) {
                        // var postdata = {};
                        // postdata[param[1]] = value;
                        // var m_result = $.ajax({
                        // type: "POST", //http请求方式
                        // url: param[0], //服务器段url地址
                        // data: postdata, //发送给服务器段的数据
                        // dataType: "json", //数据格式
                        // async: false
                        // }).responseText;
                        // if (m_result == "False") {
                        // $.fn.validatebox.defaults.rules.remote.message =
                        // param[2];
                        // return false;
                        // } else {
                        // return true;
                        // }
                        // },
                        // message: '已存在'
                        // }
                    });

                /**
                 * datagrid获取选中的行号,返回array 用法:$('#dd').datagrid('getSelectedRow');
                 * ==> [1,2,3]
                 */
                $.extend($.fn.datagrid.methods, {

                    getEditingRowIndexs: function (jq) {
                        var rows = $.data(jq[0], "datagrid").panel.find('.datagrid-row-editing');
                        var indexs = [];
                        rows.each(function (i, row) {
                            var index = row.sectionRowIndex;
                            if (indexs.indexOf(index) == -1) {
                                indexs.push(index);
                            }
                        });
                        return indexs;
                    },

                    getSelectedRow: function (jq) {
                        var opts = $.data(jq[0], "datagrid").options;
                        var array = new Array();
                        opts.finder.getTr(jq[0], "", "selected", 1).each(
                            function () {
                                array.push($(this).find("td.datagrid-td-rownumber").text());
                            });
                        return array;
                    },
                    dragTable: function (jq, callback) {
                        return jq.each(function () {
                            var target = this;
                            var cells = $(this).datagrid('getPanel').find('div.datagrid-header td[field]');
                            cells.draggable({
                                revert: true,
                                cursor: 'pointer',
                                edge: 5,
                                proxy: function (source) {
                                    var p = $('<div class="tree-node-proxy tree-dnd-no" style="position:absolute;border:1px solid #ff0000"/>').appendTo('body');
                                    p.html($(source).text());
                                    p.hide();
                                    return p;
                                },
                                onBeforeDrag: function (e) {
                                    e.data.startLeft = $(this).offset().left;
                                    e.data.startTop = $(this).offset().top;
                                },
                                onStartDrag: function () {
                                    $(this).draggable('proxy').css({
                                        left: -10000,
                                        top: -10000
                                    });
                                },
                                onDrag: function (e) {
                                    $(this).draggable('proxy').show().css({
                                        left: e.pageX + 15,
                                        top: e.pageY + 15
                                    });
                                    return false;
                                }
                            }).droppable({
                                accept: 'td[field]',
                                onDragOver: function (e, source) {
                                    $(source).draggable('proxy').removeClass('tree-dnd-no').addClass('tree-dnd-yes');
                                    $(this).css('border-left', '1px solid #ff0000');
                                },
                                onDragLeave: function (e, source) {
                                    $(source).draggable('proxy').removeClass('tree-dnd-yes').addClass('tree-dnd-no');
                                    $(this).css('border-left', 0);
                                },
                                onDrop: function (e, source) {
                                    $(this).css('border-left', 0);
                                    var fromField = $(source).attr('field');
                                    var toField = $(this).attr('field');
                                    setTimeout(function () {
                                        moveField(fromField, toField);
                                        $(target).datagrid();
                                        $(target).datagrid('dragTable', callback);
                                        var tableColumns = $(target).datagrid('options').columns;
                                        callback && callback(tableColumns[0]);
                                    }, 0);
                                }
                            });

                            // move field to another location
                            function moveField(from, to) {
                                var columns = $(target).datagrid('options').columns;
                                var cc = columns[0];
                                var c = _remove(from);
                                if (c) {
                                    _insert(to, c);
                                }

                                function _remove(field) {
                                    for (var i = 0; i < cc.length; i++) {
                                        if (cc[i].field == field) {
                                            var c = cc[i];
                                            cc.splice(i, 1);
                                            return c;
                                        }
                                    }
                                    return null;
                                }

                                function _insert(field, c) {
                                    var newcc = [];
                                    for (var i = 0; i < cc.length; i++) {
                                        if (cc[i].field == field) {
                                            newcc.push(c);
                                        }
                                        newcc.push(cc[i]);
                                    }
                                    columns[0] = newcc;
                                }
                            }
                        });
                    }
                });

                //修改combobox默认属性
                $.fn.combobox.defaults.valueField = 'id';
                $.fn.combobox.defaults.textField = 'name';
                $.fn.combobox.defaults.width = 100;

                $.fn.datebox.defaults.width = 100;
                $.fn.datebox.defaults.editable = false;


                /*
                // 默认不可编辑
                $.fn.combobox.defaults.editable = false;
    
                // 默认显示最大化按钮
                $.fn.dialog.defaults.maximizable = true;
                // 默认支持ESC关闭对话框窗口
                $.fn.dialog.defaults.supportESC = true;
                // 默认允许改变所又对话框的窗口大小
                $.fn.dialog.defaults.resizable = true;
                //
                $.fn.dialog.defaults.modal = true;
                $.fn.dialog.defaults.width = config.Dialog.width;
                $.fn.dialog.defaults.height = config.Dialog.height;
    
                $.fn.datagrid.defaults.border = false;
                $.fn.datagrid.defaults.pageNumber = config.page.pageNumber;
                $.fn.datagrid.defaults.pageSize = config.page.pageSize;
                $.fn.datagrid.defaults.pageList = config.page.pageList;
                */
                // 数据加载失败
                $.fn.datagrid.defaults.onLoadError = CommonWidget.handleError;
                $.fn.combobox.defaults.onLoadError = CommonWidget.handleError;
                $.fn.panel.defaults.onLoadError = CommonWidget.handleError;
                $.fn.tree.defaults.onLoadError = CommonWidget.handleError;
                $.fn.treegrid.defaults.onLoadError = CommonWidget.handleError;
                $.fn.form.defaults.onLoadError = CommonWidget.handleError;

                // Extend the default Number object with a formatMoney() method:
                // usage: someVar.formatMoney(decimalPlaces, symbol,
                // thousandsSeparator, decimalSeparator)
                // defaults: (2, "$", ",", ".")
                Number.prototype.formatMoney = function (places, symbol, thousand, decimal) {
                    places = !isNaN(places = Math.abs(places)) ? places : 2;
                    symbol = symbol !== undefined ? symbol : "￥";
                    //thousand = thousand || ",";
                    thousand = thousand !== undefined ? thousand : ",";
                    decimal = decimal || ".";
                    var number = this,
                        negative = number < 0 ? "-" : "",
                        i = parseInt(
                            number = Math.abs(+number || 0).toFixed(places), 10) + "",
                        j = (j = i.length) > 3 ? j % 3 : 0;
                    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j)
                        .replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
                };

                Number.prototype.toHexString = function () {
                    var val = "";
                    var str = this.toFixed(2);
                    for (var i = 0; i < str.length; i++) {
                        val += str.charCodeAt(i).toString(16);
                    }
                    return val;
                };
                /**
                 * 扩展Date对象，为Date增加转化为指定格式的String 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q)
                 * 可以用 1-2 个占位符， 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 例子：
                 * (new Date()).format("yyyy-mm-dd hh:mm:ss.S") ==> 2006-07-02
                 * 08:09:04.423 (new Date()).format("yyyy-m-d h:m:s.S") ==> 2006-7-2
                 * 8:9:4.18
                 * 
                 * @param fmt
                 * @returns {*}
                 * @constructor
                 */
                Date.prototype.format = function (fmt) {
                    var o = {
                        "m+": this.getMonth() + 1,
                        // 月份
                        "d+": this.getDate(),
                        // 日
                        "h+": this.getHours(),
                        // 小时
                        "i+": this.getMinutes(),
                        // 分
                        "s+": this.getSeconds(),
                        // 秒
                        "q+": Math.floor((this.getMonth() + 3) / 3),
                        // 季度
                        S: this.getMilliseconds()
                    };
                    if (/(y+)/.test(fmt)) {
                        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
                            .substr(4 - RegExp.$1.length));
                    }
                    for (var k in o) {
                        if (new RegExp("(" + k + ")").test(fmt)) {
                            fmt = fmt.replace(RegExp.$1,
                                RegExp.$1.length == 1 ? o[k] : ("00" + o[k])
                                .substr(("" + o[k]).length));
                        }
                    }
                    return fmt;
                };

                $.extend($.fn.tabs.methods, {
                    allTabs: function (jq) {
                        var tabs = $(jq).tabs('tabs');
                        var all = [];
                        all = $.map(tabs, function (n, i) {
                            return $(n).panel('options');
                        });
                        return all;
                    },
                    closeCurrent: function (jq) { // 关闭当前
                        var currentTab = $(jq).tabs('getSelected'),
                            currentTabIndex = $(
                                jq).tabs('getTabIndex', currentTab);
                        $(jq).tabs('close', currentTabIndex);
                    },
                    closeAll: function (jq) { // 关闭全部
                        var tabs = $(jq).tabs('allTabs');
                        $.each(tabs, function (i, n) {
                            if (n.title != '欢迎使用') {
                                $(jq).tabs('close', n.title);
                            }
                        });
                    },
                    closeOther: function (jq) { // 关闭除当前标签页外的tab页
                        var tabs = $(jq).tabs('allTabs');
                        var currentTab = $(jq).tabs('getSelected'),
                            currentTabIndex = $(
                                jq).tabs('getTabIndex', currentTab);

                        $.each(tabs, function (i, n) {
                            if (currentTabIndex != i) {
                                if (n.title != '欢迎使用') {
                                    $(jq).tabs('close', n.title);
                                }
                            }
                        });
                    },
                    closeLeft: function (jq) { // 关闭当前页左侧tab页
                        var tabs = $(jq).tabs('allTabs');
                        var currentTab = $(jq).tabs('getSelected'),
                            currentTabIndex = $(
                                jq).tabs('getTabIndex', currentTab);
                        var i = currentTabIndex - 1;

                        while (i > -1) {
                            if (tabs[i].title != '欢迎使用') {
                                $(jq).tabs('close', tabs[i].title);
                            }
                            i--;
                        }
                    },
                    closeRight: function (jq) { // // 关闭当前页右侧tab页
                        var tabs = $(jq).tabs('allTabs');
                        var currentTab = $(jq).tabs('getSelected'),
                            currentTabIndex = $(
                                jq).tabs('getTabIndex', currentTab);
                        var i = currentTabIndex + 1,
                            len = tabs.length;
                        while (i < len) {
                            if (tabs[i].title != '欢迎使用') {
                                $(jq).tabs('close', tabs[i].title);
                            }
                            i++;
                        }
                    }
                });
            },
            datagridLoadFilter: function (response, callback) {
                if (response.success) {
                    var data = response.data;
                    var total = 0;
                    var newData = {};
                    if (data && data.rows) {
                        newData = data.rows;
                        total = data.total;
                    } else {
                        newData = data;
                        total = newData.length;
                    }
                    if (callback && typeof callback == 'function') {
                        var cb = callback(newData);
                        // alert('callback1')
                        console.log('>>> callback');
                        console.log({
                            rows: cb,
                            total: cb.length
                        });
                        // alert('callback2')
                    } else {
                        return {
                            rows: newData,
                            total: total
                        };
                    }
                } else {
                    CommonWidget.showMsg({
                        title: '警告信息',
                        msg: response.message
                    }, 'warning');
                    return {
                        total: 0,
                        rows: []
                    };
                }
                return data;
            }
            , math: {
                FloatSub:function(arg1, arg2) {
                    var r1, r2, m, n;
                    try {
                        r1 = arg1.toString().split(".")[1].length
                    } catch (e) {
                        r1 = 0
                    }
                    try {
                        r2 = arg2.toString().split(".")[1].length
                    } catch (e) {
                        r2 = 0
                    }
                    m = Math.pow(10, Math.max(r1, r2));
                    //动态控制精度长度
                    n = (r1 >= r2) ? r1 : r2;
                    return ((arg1 * m - arg2 * m) / m).toFixed(n);
                },
                    FloatAdd:function(arg1, arg2) {
    var r1, r2, m;
    try {
        r1 = arg1.toString().split(".")[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split(".")[1].length
    } catch (e) {
        r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    return (arg1 * m + arg2 * m) / m
}

            }

        };
    module.exports = CommonWidget;
    //    return {initToolbar:Common.initToolbar}
    //}
    //)(Common);

    function FloatAdd(arg1, arg2) {
        var r1, r2, m;
        try {
            r1 = arg1.toString().split(".")[1].length
        } catch (e) {
            r1 = 0
        }
        try {
            r2 = arg2.toString().split(".")[1].length
        } catch (e) {
            r2 = 0
        }
        m = Math.pow(10, Math.max(r1, r2))
        return (arg1 * m + arg2 * m) / m
    }
    //浮点数减法运算
    function FloatSub(arg1, arg2) {
        var r1, r2, m, n;
        try {
            r1 = arg1.toString().split(".")[1].length
        } catch (e) {
            r1 = 0
        }
        try {
            r2 = arg2.toString().split(".")[1].length
        } catch (e) {
            r2 = 0
        }
        m = Math.pow(10, Math.max(r1, r2));
        //动态控制精度长度
        n = (r1 >= r2) ? r1 : r2;
        return ((arg1 * m - arg2 * m) / m).toFixed(n);
    }
    //浮点数乘法运算
    function FloatMul(arg1, arg2) {
        var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
        try {
            m += s1.split(".")[1].length
        } catch (e) {
        }
        try {
            m += s2.split(".")[1].length
        } catch (e) {
        }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
    }
    //浮点数除法运算
    function FloatDiv(arg1, arg2) {
        var t1 = 0, t2 = 0, r1, r2;
        try {
            t1 = arg1.toString().split(".")[1].length
        } catch (e) {
        }
        try {
            t2 = arg2.toString().split(".")[1].length
        } catch (e) {
        }
        with (Math) {
            r1 = Number(arg1.toString().replace(".", ""))
            r2 = Number(arg2.toString().replace(".", ""))
            return (r1 / r2) * pow(10, t2 - t1);
        }
    }


    //日期控件--start

    Date.prototype.format = function (fmt) {
        var o = {
            "m+": this.getMonth() + 1,
            // 月份
            "d+": this.getDate(),
            // 日
            "h+": this.getHours(),
            // 小时
            "i+": this.getMinutes(),
            // 分
            "s+": this.getSeconds(),
            // 秒
            "q+": Math.floor((this.getMonth() + 3) / 3),
            // 季度
            S: this.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1,
                    RegExp.$1.length == 1 ? o[k] : ("00" + o[k])
                    .substr(("" + o[k]).length));
            }
        }
        return fmt;
    };
    //日期控件--end

   


    

    //获取光标在输入框中的位置
    function doGetCaretPosition(oField) {
        // Initialize
        var iCaretPos = 0;
        // IE Support
        if (document.selection) {
            // Set focus on the element
            oField.focus();
            // To get cursor position, get empty selection range
            var oSel = document.selection.createRange();
            // Move selection start to 0 position
            oSel.moveStart('character', -oField.value.length);
            // The caret position is selection length
            iCaretPos = oSel.text.length;
        }
            // Firefox support
        else if (oField.selectionStart || oField.selectionStart == '0')
            iCaretPos = oField.selectionStart;
        // Return results
        return (iCaretPos);
    }

    function getSelectedText() {
        if (window.getSelection) {
            // This technique is the most likely to be standardized.
            // getSelection() returns a Selection object, which we do not document.
            return window.getSelection().toString();
        } else if (document.getSelection) {
            // This is an older, simpler technique that returns a string
            return document.getSelection();
        } else if (document.selection) {
            // This is the IE-specific technique.     // We do not document the IE selection property or TextRange objects.
            return document.selection.createRange().text;
        }
    }
    
})