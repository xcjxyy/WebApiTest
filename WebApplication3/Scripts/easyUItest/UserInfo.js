define(function (require, exports, module) {
    require('jquery');
    require('cookie');
    require('easyui');
    require('easyuiCN');
    var common = require('common');

    var $lastInp = null;//最后一个input对象
    function enterKey() {
        var $inp = $('#dialogMain :input:text[type!="hidden"][readonly!="readonly"]');
            $inp.bind('keyup', function (e) {
            var key = e.which;
            if (key == 13) {
                e.preventDefault();
                var nxtIdx = $inp.index(this) + 1;
                //$().index()取得jq对象数组中的下标
                if ($inp.index(this) === $inp.index($lastInp)) {
                    PageDetail.btnEvent.rowAdd(function () { // rowAdd里传入回调函数 实现末尾cell回车增行后光标切入新行第一个cell
                        var $inp = $('#dialogMain :input:text[type!="hidden"][readonly!="readonly"]');
                        var nxtIdx = $inp.index($lastInp) + 1;
                        $($inp[nxtIdx]).focus()
                    });
                }
                $($inp[nxtIdx]).focus()
            }
        })
            $lastInp = $('#dialogMain :input:text[type!="hidden"][readonly!="readonly"]:last')
    }

    function bindChange() {
        var $inp = $('#dialogMain :input:text[type!="hidden"][readonly!="readonly"]');
        $inp.bind('change', function (e) {
            e.preventDefault();
            $('#btn-save').linkbutton('enable')
            }
        )
    }

    function referQueryData(options) {
        options = options || {};
        options.cache = false;
        options.method = typeof options.cache == 'undefined' ? 'GET' : 'POST';
        var dataList = null;
        // 读取本地缓存数据
        $.ajax({
            method: 'GET',
            url:  '../api/userinfo/GetUsers0',
            dataType: "json",
            data: options.data,
            async: false,
            success: function (data) {
                //if (response.success === true) {
                dataList = data;
                ////} else {
                //    dataList = [];
                //}
            },
            error: function () { alert("!!CommonWidget.handleError"); }
        });
        return dataList;
    }
    /**dom对象命名  pageList pageDetail form   dialog  grid  btn  inp  combo  date   icon  img
    */

    var $formMain = $('#formMain');
    var $dialogRefer = $('#dialogRefer');
    var $gridMain = $('#gridMain');
    var curEditRowIndex = undefined;//???
    var lastRowIndex = undefined;
    var selectRowIndex = undefined;
    var selectRowIndexB = undefined;
    var selectRowIndexBs = [];
    var selectRows = [];
    var $gridDetail = $('#gridDetail');
    var $gridRefer = $('#gridRefer');
    var $amountSum = $('#amountSum');
    var $dateCondition = $('#dateCondition');
    var $selectStatus = $('#selectStatus');
    var $buzType = $('#buzType');

    var $UserName = $('#UserName');
    var $Age=$('#Age')
    //主页面
    var PageMain = {
        bindEvents: function () {
            $('#add').bind('click', function () {
                $('#dialogMain').show();
                $('#dialogMain').dialog({
                    title: 'title',
                    modal: true,
                    maximizable:true,
                    //maximized: true,
                    contentType: 'application/json',
                    buttons: [{
                        id: 'btn-addRow',
                        text: '增加行',
                        iconCls: 'icon-add',
                        handler: function () {
                            PageDetail.btnEvent.rowAdd();
                        }
                    }, {
                        id: 'btn-delRow',
                        text: '删除行',
                        iconCls: 'icon-del',
                        handler: function () {
                            PageDetail.btnEvent.rowDel();
                        }
                    },
                    {
                        id: 'btn-save',
                        text: '保存',
                        // iconCls: 'icon-add',
                        handler: function () {
                            PageDetail.btnEvent.formSave();
                        }
                    }]
                });

                PageDetail.init();
                $("#dialogMain :input:text[type!='hidden'][readonly!='readonly']:first").focus();

            });
            $('#insert').bind('click', function () {
                //insertRow方法在头部增加
                //$('#gridMain').datagrid('insertRow', { index: 0, row: {}});
                //$('#gridMain').datagrid('beginEdit', 0);
                //appendRow方法在尾部增加
                //$gridMain.datagrid('appendRow', {});
                //var lastIndex = $('#gridMain').datagrid('getRows').length - 1;
                //$gridMain.datagrid('beginEdit', lastIndex);
                alert("GETIIIII")
                $.ajax({
                    method: 'GET',
                    url: '../api/userinfo/GetUsers2?id=109',
                    dataType: "json",
                    //data: options.data,
                    async: false,
                    success: function (data) {
                        //if (response.success === true) {
                        //dataList = data;
                        ////} else {
                        //    dataList = [];
                        //}
                    },
                    error: function () { alert("!!CommonWidget.handleError"); }
                });

            });
            $('#edit').bind('click', function () {
                console.log(selectRowIndex);
                if (selectRowIndex) {
                    $('#gridMain').datagrid('beginEdit', selectRowIndex);
                    //selectRowIndex = undefined;
                }

            });
            $('#save').bind('click', function () {
                var rows = $gridMain.datagrid('getRows');
                for (var i = 0; i < rows.length; i++) {
                    var _userName = $gridMain.datagrid('getEditor', {
                        index: i,
                        field: 'UserName'
                    });
                    console.log($(_userName.target).val())  //target编辑器返回的jQuery对象
                }

                //$gridMain.datagrid('acceptChanges');  //grid本次所有行的编辑全部保存
                $gridMain.datagrid('endEdit', selectRowIndex)
            });
            $('#redo').bind('click', function () {
                $gridMain.datagrid('rejectChanges');
            });
        },
        init: function () {
            var _date=new Date().format('yyyy-mm-dd');
            $dateCondition.datebox({
                width: 100,
                editable: true,
                required: true,
                value:_date,
            });

            $selectStatus.combobox({
                width: 100,
                textField: 'name',
                valueField: 'id',
                required: true
            });
            var data = [{ name: "制单", id: "0" }, { name: "审核", id: "1" }];
            $selectStatus.combobox('loadData', data);

            var tableColumns = [];
            tableColumns.push({
                field: 'id',
                checkbox: true,
                title: 'ID',
                width: 20,
                align: 'center'
            });
            tableColumns.push({
                field: 'UserName',
                title: '用户姓名',
                width: 160,
                editor: 'text',
                //sortOrder: 'ASC',
                sortable: true,
                sorter: function (a, b) {
                    console.log(a, b);
                    if (a > b) { return 1; } else { return -1; }    //前台排序
                }
                , align: 'center'
            });
            tableColumns.push({
                field: 'sex',
                title: '性别',
                width: 110,
                editor: 'text',
                sortable: true,
                align: 'center'
            });
            tableColumns.push({
                field: 'Age',
                title: '年龄',
                width: 90,
                editor: 'text',
                sortable: true
                , align: 'center'
            });
            tableColumns.push({
                field: 'inTime',
                title: '入库日期',
                width: 120,
                editor: 'text',
                sortable: true
                // formatter: CommonWidget.columnFormatDate
                , align: 'center'
            });


            $gridMain.datagrid({
                title: '用户列表',
               //url: '../api/userinfo/GetUsers0',
                loadMsg: 'Please Wait...',
                toolbar: '#tB',
                method: 'GET',
                width: 900,
                height: 550,
                columns: [tableColumns],
                iconCls: 'icon-search',
                pagination: true,
                pageSize: 5,
                pageList: [5, 10, 100],
                ctrlSelect: true,
                checkOnSelect: true,
                selectOnCheck: true,
                rownumbers: true,
                stortName: 'UserName',
                //sortOrder:'ASC',
                //multiSort:true
                remoteSort: false,
               
                onClickRow: function (rowIndex, rowData) {
                    if (selectRowIndex != undefined) {
                        $tableId.datagrid('endEdit', selectRowIndex)  //上一行结束edit
                    }
                    if (selectRowIndex == undefined) {
                        $tableId.datagrid('beginEdit', rowIndex);//选中行开始edit  记住当前行
                        selectRowIndex = rowIndex;
                    }
                }
                 , onAfterEdit: function (index, row) {
                     selectRowIndex = undefined;//结束edit 置空当前行
                 }
            });

            this.bindEvents();
        },
    };
    //单据窗口
    var PageDetail = {
        girdEditorInit: function () {
            this.CardPrice = [];
            this.num = [];
            this.amount = [];
            this.CardName = [];
        },
        girdEditor: function (rowIndex) {
            this.CardPrice[rowIndex] = $gridDetail.datagrid('getEditor', {
                index: rowIndex,
                field: 'CardPrice'
            });
            this.num[rowIndex] = $gridDetail.datagrid('getEditor', {
                index: rowIndex,
                field: 'num'
            });
            this.amount[rowIndex] = $gridDetail.datagrid('getEditor', {
                index: rowIndex,
                field: 'amount'
            });
            this.CardName[rowIndex] = $gridDetail.datagrid('getEditor', {
                index: rowIndex,
                field: 'CardName'
            });
        },
        //抽出的表体公式？？？
        gridGS: function (rowIndex) {
            var that = this;
            (function(){
                var _amount = Number($(that.num[rowIndex].target).val() * $(that.CardPrice[rowIndex].target).val());
                $(that.amount[rowIndex].target).val(_amount);
            })();

        },

        //表头求和公式
        headProcessData: function () {
            var rows = $gridDetail.datagrid('getRows') && $gridDetail.datagrid('getRows').length;
            var _amountSum = 0, a = 0;
            var amount = [];
            for (var i = 0; i < rows; i++) {
                amount[i] = $gridDetail.datagrid('getEditor', {
                    index: i,
                    field: 'amount'
                });
                a = parseFloat($(amount[i].target).val())
                if (!isNaN(a)) {
                    _amountSum = common.math.FloatAdd(_amountSum, a);
                }
            }
            $amountSum.text(_amountSum);
        },
        //单价*数量=金额   行格绑定公式计算、参照事件
        girdProcessData: function (rowIndex) {
            this.girdEditor(rowIndex);
            enterKey();//input回车tab事件

            var that = this;
            $(that.num[rowIndex].target).bind('blur', function () { that.gridGS(rowIndex); that.headProcessData() });
            $(that.CardPrice[rowIndex].target).bind('blur', function () { that.gridGS(rowIndex); that.headProcessData() });//input propertychange
            $(that.CardName[rowIndex].target).bind('keydown', function (e) {
                var param = this.value;
                var key = e.which;
                $(this).bind('change', function () {//！！！嵌套change事件 参照返回值回车不触发弹窗
                    var self = this;
                    if (key == 13) {
                        e.preventDefault();
                        PageDetail.gridRefer.formGrid(param, rowIndex, self)//绑定参照
                    }
                })
            })

                       },

        init: function () {
            $formMain.form('clear');
            var _startTime = new Date().format('yyyy-mm-dd')
            $('#inTime').datebox({
                width: 100,
                editable: true,
                value: _startTime,
                required: false,
                //onSelect: function (date) {
                //    _startTime = Date.parse($(this).datebox('getValue')) - 86400000 / 3;
                //}
            });
            $buzType.combobox({
                width: 100,
                textField: 'name',
                valueField: 'id',
                required: true
            });
            var data = [{ name: "制单", id: "0" }, { name: "审核", id: "1" }];
            $buzType.combobox('loadData', data);

            var tableColumns = [];
            tableColumns.push({
                field: 'Id',
                // checkbox: true,
                title: 'ID',
                width: 20,
                align: 'center'
            });
            tableColumns.push({
                field: 'CardName',
                title: '卡名',
                width: 160,
                editor: 'text',
            });

            tableColumns.push({
                field: 'inTime',
                title: '入库日期',
                width: 120,
                editor: 'text',
                sortable: true
            });
            tableColumns.push({
                field: 'CardPrice',
                title: '单价',
                width: 120,
                editor: 'text'
             , align: 'right'
            });
            tableColumns.push({
                field: 'num',
                title: '数量',
                width: 120,
                editor: 'text'
             , align: 'right'
            });
            tableColumns.push({
                field: 'amount',
                title: '金额',
                width: 120,
                editor: 'text'
              , align: 'right'
            });

            $gridDetail.datagrid({
                method: 'GET',
                width: 900,
                height: 150,
                columns: [tableColumns],
                ctrlSelect: true,
               checkOnSelect: false,
                selectOnCheck: false,
                rownumbers: true,
                onClickCell: function (rowIndex, field, value) { console.log('cell', rowIndex) },
                onClickRow: function (rowIndex, rowData) {
                    console.log('onlick',rowIndex);
                    selectRowIndexB = rowIndex;
                    selectRowIndexBs = [];
                    selectRows = [];
                    selectRows = $(this).datagrid('getSelections');
                    for (var i = 0; i < selectRows.length ; i++) {
                        selectRowIndexBs.push($(this).datagrid('getRowIndex', selectRows[i]));
                    };
                }, onBeforeEdit: function (rowIndex, rowData) {
                    console.log('before',rowIndex);
                    selectRowIndexB = rowIndex;
                },onBeforeEdit: function (rowIndex, rowData) {
                console.log('begin',rowIndex);
                    selectRowIndexB = rowIndex;
            }
                 , onAfterEdit: function (index, row) {
                 }
            });

 
            $gridDetail.datagrid('loadData', {
                total: 0,
                rows: []
            });
            //声明单元格数组
            this.girdEditorInit();
            //表体显示第一行        
            for (var i = 0; i < 1; i++) {
                this.btnEvent.rowAdd();
            };

        },

        btnEvent: {
            rowAdd: function (callback) {
                $gridDetail.datagrid('appendRow', {});
                var lastIndex = $gridDetail.datagrid('getRows').length - 1;
                lastRowIndex = lastIndex;
                console.log('after-append lastRowIndex', lastRowIndex)
                $gridDetail.datagrid('beginEdit', lastIndex);
                PageDetail.girdProcessData(lastIndex); //行金额计算公式事件  
                callback && callback();//钩子 1动态加行后 回车进入新行首格 2参照返回值后进行赋值！！！
                //enterKeyTest();//input回车tab事件  迁入 girdProcessData  方法中执行                       
            },
            rowDel: function () {                
                console.log(selectRowIndexBs);
                var r=null;
                for (var i = 0; i < selectRows.length; i++) {
                    r=$gridDetail.datagrid('getRowIndex', selectRows[i])
                    $gridDetail.datagrid('deleteRow', r);
                    PageDetail.headProcessData();//行删除时 减少表头和
                }                     
            },
            formSave: function () {
                var flag = false;
                var UserInfo = {
                    UserName: $UserName.val(),
                    Age: $Age.val(),
                    Id: $('#Id').val()
                };
                console.log('<<<',UserInfo.Id);
                if (UserInfo.Id == null || UserInfo.Id=="") {
                    UserInfo.Id = 0;
                }
                $gridDetail.datagrid('acceptChanges');
                var rows = $gridDetail.datagrid('getRows');
                var Cards = [];
                for (var i in rows) {
                    var o = rows[i];
                    var data = null;
                    data = {
                        CardName: rows[i].CardName,
                        CardPrice: rows[i].CardPrice,

                    };
                    Cards.push(data);
                }
                UserInfo.Cards = Cards;
                if (flag == true) {
                    console.log('重复提交');
                    return
                } else {
                    $.ajax({
                        type: 'POST',
                        url: '../api/userinfo/userInfoEdit',
                        contentType: "application/json",
                        dataType: "json",
                        data: JSON.stringify(UserInfo),
                        async: false,
                        success: function (response) {
                            if (response.success === true) {
                                $('#Id').val(response.data.Id);

                                $gridDetail.datagrid('loadData',response.data.Cards)
                                flag = true;
                                $('#btn-save').linkbutton('disable');
                                //$('#btn-update').linkbutton('enable');
                                for (var i = 0; i < rows.length; i++) {
                                    $gridDetail.datagrid('beginEdit', i);
                                }
                                enterKey();
                                bindChange();
                                $lastInp.focus();

                            }
                        },
                        error: function () { alert("!!CommonWidget.handleError"); }
                    });


                }
            },
            formEdit: function () { }
        },
        gridRefer: {
            //参照弹窗 及行返回值逻辑
            formGrid: function (param, currowIndex, selector, callback) {
                var dataList = referQueryData(param);
                $dialogRefer.show();
                $dialogRefer.dialog({
                    title: 'refer',
                    width: 700,
                    height: 500,
                    modal: true,
                    buttons: [
                    {
                        id: 'btn-save',
                        text: '确定',
                        handler: function () {                           
                            var currentIndex = currowIndex;
                            var $appendedRows = $gridRefer.datagrid('getChecked');//***拿到多选行
                            if ($appendedRows.length == 0) {
                                return;
                            } else {
                                for (var i in $appendedRows) {
                                    $appendedRows[i].CardName = $appendedRows[i].UserName;
                                    $appendedRows[i].quantity = 1;
                                    $appendedRows[i].number = $appendedRows[i].Age;
                                    $appendedRows[i].CardPrice = 100;

                                    if (i == 0) {
                                        //返回值后 触发公式
                                        $(PageDetail.CardName[currentIndex].target).val($appendedRows[i].UserName);
                                        $(PageDetail.CardPrice[currentIndex].target).val($appendedRows[i].Age);
                                        $(PageDetail.num[currentIndex].target).val(1);
                                        PageDetail.gridGS(currentIndex);
                                        PageDetail.headProcessData();
                                    }
                                    else {
                                        var rowindex = lastRowIndex + 1;//回调函数载入时读取，此时还未增行故行号要加1
                                        //增加行后回调
                                        PageDetail.btnEvent.rowAdd(function () {
                                            console.log('PageDetail.CardName.target', $(PageDetail.CardName.target))
                                            $(PageDetail.CardName[rowindex].target).val($appendedRows[i].UserName);
                                            $(PageDetail.CardPrice[rowindex].target).val($appendedRows[i].Age);
                                            $(PageDetail.num[rowindex].target).val(1);

                                            PageDetail.gridGS(rowindex);
                                            PageDetail.headProcessData();

                                        });

                                    }
                                }
                            }
                            $dialogRefer.dialog('close');
                            //$(selector).focus();
                            //$(selector).select();
                            $(PageDetail.CardName[lastRowIndex].target).focus();
                            $(PageDetail.CardName[lastRowIndex].target).select();
                           
                        }                        
                    }]
                });
                $gridRefer.datagrid({
                    //height : 380,                    
                    columns: [[
                    { field: 'Id', title: 'Id', width: 100, checkbox: true },
                    { field: 'UserName', title: '姓名', width: 100 },
                    { field: 'Age', title: '年龄', width: 100, align: 'right', width: 100 }
                    ]],
                    onDblClickRow: function (rowIndex, rowData) {//*********双击单行
                        //rowData.expire = rowData.expire ? CommonWidget.timestampToDate(rowData.expire) : '';
                        //self._updateEditorData(self._dialogTable, rowData);
                        $dialogRefer.dialog('close');
                    },
                    data: dataList
                });

            }
        }

    };
    //程序入口
    PageMain.init();
})


