define(function (require, exports, module) {
    require('jquery');
    require('cookie');
    require('easyui');
    require('easyuiCN');
    var common = require('common');

    var $lastInp = null;//最后一个input对象
    function enterKeyTest() {
        var $inp = $('#mainDialog :input:text[type!=hidden][readonly!=true]');
            $inp.bind('keyup', function (e) {
            var key = e.which;
            if (key == 13) {
                e.preventDefault();
                var nxtIdx = $inp.index(this) + 1;
                //$().index()取得jq对象数组中的下标
                if ($inp.index(this)===$inp.index($lastInp)) {
                    mainForm.btnEvent.rowAdd(function (){ // rowAdd里传入回调函数 实现末尾cell回车增行后光标切入新行第一个cell
                        var $inp = $('#mainDialog :input:text[type!=hidden][readonly!=true]');         
                        var nxtIdx = $inp.index($lastInp) + 1;
                        $($inp[nxtIdx]).focus()
                    });
                }
                $($inp[nxtIdx]).focus()
            }
        })
        $lastInp = $('#mainDialog :input:text[type!=hidden][readonly!=true]:last')
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
    var $formMain = $('#mainForm');
    var $referDialog = $('#referDialog');
    var $tableIdMain = $('#mainGrid');
    var curEditRowIndex = undefined;//???
    var lastRowIndex = undefined;
    var selectRowIndex = undefined;
    var selectRowIndexB = undefined;
    var selectRowIndexBs = [];
    var selectRows = [];
    var $tableIdForm = $('#formGrid');
    var $referGrid = $('#referGrid');
    var $amountSum = $('#amountSum');
    //主页面
    var mainPage = {
        bindEvents: function () {
            $('#add').bind('click', function () {
                $('#mainDialog').show();
                $('#mainDialog').dialog({
                    title: 'title',
                    modal: true,
                    // maximized: true,
                    contentType: 'application/json',
                    buttons: [{
                        id: 'btn-addRow',
                        text: '增加行',
                        iconCls: 'icon-add',
                        handler: function () {
                            mainForm.btnEvent.rowAdd();
                        }
                    }, {
                        id: 'btn-delRow',
                        text: '删除行',
                        iconCls: 'icon-del',
                        handler: function () {
                            mainForm.btnEvent.rowDel();
                        }
                    },
                    {
                        id: 'btn-save',
                        text: '保存',
                        // iconCls: 'icon-add',
                        handler: function () {
                            mainForm.btnEvent.formSave();
                        }
                    }]
                });

                mainForm.formGridInit();
                $("#mainDialog :input:text[type!='hidden']:first").focus();
                
            })
            $('#insert').bind('click', function () {
                //insertRow方法在头部增加
                //$('#mainGrid').datagrid('insertRow', { index: 0, row: {}});
                //$('#mainGrid').datagrid('beginEdit', 0);
                //appendRow方法在尾部增加
                $tableIdMain.datagrid('appendRow', {});
                var lastIndex = $('#mainGrid').datagrid('getRows').length - 1;
                $tableIdMain.datagrid('beginEdit', lastIndex);

            });
            $('#edit').bind('click', function () {
                console.log(selectRowIndex);
                if (selectRowIndex) {
                    $('#mainGrid').datagrid('beginEdit', selectRowIndex);
                    //selectRowIndex = undefined;
                }

            });
            $('#save').bind('click', function () {
                var rows = $tableIdMain.datagrid('getRows');
                for (var i = 0; i < rows.length; i++) {
                    var _userName = $tableIdMain.datagrid('getEditor', {
                        index: i,
                        field: 'UserName'
                    });
                    console.log($(_userName.target).val())  //target编辑器返回的jQuery对象
                }

                //$tableIdMain.datagrid('acceptChanges');  //grid本次所有行的编辑全部保存
                $tableIdMain.datagrid('endEdit', selectRowIndex)
            });
            $('#redo').bind('click', function () {
                $tableIdMain.datagrid('rejectChanges');
            });
        },
        init: function () {
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
                title: '入库单号',
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
                title: '核算科目',
                width: 110,
                editor: 'text',
                sortable: true,
                align: 'center'
            });
            tableColumns.push({
                field: 'Age',
                title: '入库人员',
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


            $tableIdMain.datagrid({
                title: '用户列表',
              //  url: '../api/userinfo/GetUsers0',
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
    var mainForm = {
        girdEditor: function (rowIndex) {
            this.price = $tableIdForm.datagrid('getEditor', {
                index: rowIndex,
                field: 'price'
            });
            this.num = $tableIdForm.datagrid('getEditor', {
                index: rowIndex,
                field: 'num'
            });
            this.amount = $tableIdForm.datagrid('getEditor', {
                index: rowIndex,
                field: 'amount'
            });
            this.productName = $tableIdForm.datagrid('getEditor', {
                index: rowIndex,
                field: 'productName'
            });
        },
        //抽出的表体公式？？？
        gridGS: function (rowIndex) {
            var that = this;
            (function(){
                var _amount = Number($(that.num.target).val() * $(that.price.target).val());
                $(that.amount.target).val(_amount);
            })();

        },
        gridGS0: function (rowIndex) {
            var price = $tableIdForm.datagrid('getEditor', {
                index: rowIndex,
                field: 'price'
            });
            var num = $tableIdForm.datagrid('getEditor', {
                index: rowIndex,
                field: 'num'
            });
            var amount = $tableIdForm.datagrid('getEditor', {
                index: rowIndex,
                field: 'amount'
            });
            (function () {
                var _amount = Number($(num.target).val() * $(price.target).val());
                $(amount.target).val(_amount);
            })();

        },
        //表头求和公式
        headProcessData: function () {
            var rows = $tableIdForm.datagrid('getRows') && $tableIdForm.datagrid('getRows').length;
            var _amountSum = 0, a = 0;
            var amount = [];
            for (var i = 0; i < rows; i++) {
                amount[i] = $tableIdForm.datagrid('getEditor', {
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
            enterKeyTest();//input回车tab事件

            var that = this;
            var productName = $tableIdForm.datagrid('getEditor', {
                index: rowIndex,
                field: 'productName'
            });
            //var price = $tableIdForm.datagrid('getEditor', {
            //    index: rowIndex,
            //    field: 'price'
            //});
            //var num = $tableIdForm.datagrid('getEditor', {
            //    index: rowIndex,
            //    field: 'num'
            //});
            //var amount = $tableIdForm.datagrid('getEditor', {
            //    index: rowIndex,
            //    field: 'amount'
            //});
            //var amountEvent = function () {
            //    var _amount = Number($(num.target).val() * $(price.target).val());
            //    $(amount.target).val(_amount);

            //};
            //var amountSumEvent = function () {
            //    var rows = $tableIdForm.datagrid('getRows') && $tableIdForm.datagrid('getRows').length;
            //    var _amountSum = 0, a = 0;
            //    var amount = [];
            //    for (var i = 0; i < rows; i++) {
            //        amount[i] = $tableIdForm.datagrid('getEditor', {
            //            index: i,
            //            field: 'amount'
            //        });
            //        a = parseFloat($(amount[i].target).val())
            //        if (!isNaN(a)) {
            //            _amountSum = common.math.FloatAdd(_amountSum, a);
            //        }                    
            //    }
            //    $amountSum.text(_amountSum);
            //};

            $(that.num.target).bind('blur', function () { mainForm.gridGS(rowIndex); mainForm.headProcessData() });
            $(that.price.target).bind('blur', function () { mainForm.gridGS(rowIndex); mainForm.headProcessData() });//input propertychange

            $(productName.target).bind('keydown', function (e) {
                var param = this.value;
                var key = e.which;
                $(this).bind('change', function () {//！！！嵌套change事件 参照返回值回车不触发弹窗
                    var self = this;
                    if (key == 13) {
                        e.preventDefault();
                        mainForm.referGrid.formGrid(param, rowIndex, self)//绑定参照
                    }
                })
            })

                       },

        girdProcessData0: function (rowIndex) {
            enterKeyTest();//input回车tab事件
            var productName = $tableIdForm.datagrid('getEditor', {
                index: rowIndex,
                field: 'productName'
            });
            var price = $tableIdForm.datagrid('getEditor', {
                index: rowIndex,
                field: 'price'
            });
            var num = $tableIdForm.datagrid('getEditor', {
                index: rowIndex,
                field: 'num'
            });
            var amount = $tableIdForm.datagrid('getEditor', {
                index: rowIndex,
                field: 'amount'
            });
            var amountEvent = function () {
                var _amount = Number($(num.target).val() * $(price.target).val());
                $(amount.target).val(_amount);

            };
            var amountSumEvent = function () {
                var rows = $tableIdForm.datagrid('getRows') && $tableIdForm.datagrid('getRows').length;
                var _amountSum = 0, a = 0;
                var amount = [];
                for (var i = 0; i < rows; i++) {
                    amount[i] = $tableIdForm.datagrid('getEditor', {
                        index: i,
                        field: 'amount'
                    });
                    a = parseFloat($(amount[i].target).val())
                    if (!isNaN(a)) {
                        _amountSum = common.math.FloatAdd(_amountSum, a);
                    }                    
                }
                $amountSum.text(_amountSum);
            };

            $(num.target).bind('blur', function () { amountEvent(rowIndex); mainForm.headProcessData() });
            $(price.target).bind('blur', function () { amountEvent(rowIndex); mainForm.headProcessData() });//input propertychange

            $(productName.target).bind('keydown', function (e) {
                var param = this.value;
                var key = e.which;
                $(this).bind('change', function () {//！！！嵌套change事件 参照返回值回车不触发弹窗
                    var self = this;
                    if (key == 13) {
                        e.preventDefault();
                        mainForm.referGrid.formGrid(param, rowIndex, self)//绑定参照
                    }
                })
            })

        },

        formGridInit: function () {
            $formMain.form('clear');
            var tableColumns = [];
            tableColumns.push({
                field: 'id',
                // checkbox: true,
                title: 'ID',
                width: 20,
                align: 'center'
            });
            tableColumns.push({
                field: 'productName',
                title: '品名',
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
                field: 'price',
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

            $tableIdForm.datagrid({
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

 
            $tableIdForm.datagrid('loadData', {
                total: 0,
                rows: []
            });
            //表体显示第一行        
            for (var i = 0; i < 1; i++) {
                this.btnEvent.rowAdd();
            };

        },

        btnEvent: {
            rowAdd: function (callback) {
                $tableIdForm.datagrid('appendRow', {});
                var lastIndex = $tableIdForm.datagrid('getRows').length - 1;
                lastRowIndex = lastIndex;
                console.log('after-append lastRowIndex', lastRowIndex)
                $tableIdForm.datagrid('beginEdit', lastIndex);
                mainForm.girdProcessData(lastIndex); //行金额计算公式事件  
                callback && callback();//钩子 1动态加行后 回车进入新行首格 2参照返回值后进行赋值！！！
                //enterKeyTest();//input回车tab事件
                
             
            },
            rowDel: function () {                
                console.log(selectRowIndexBs);
                var r=null;
                for (var i = 0; i < selectRows.length; i++) {
                    r=$tableIdForm.datagrid('getRowIndex', selectRows[i])
                    $tableIdForm.datagrid('deleteRow', r);
                    mainForm.headProcessData();//行删除时 减少表头和
                }                     
            },
            formSave: function () {
                $tableIdForm.datagrid('acceptChanges');
                var rows = $tableIdForm.datagrid('getRows');
                console.log(rows)
            },
            formEdit: function () { }
        },
        referGrid: {
            //参照弹窗 及行返回值逻辑
            formGrid: function (param, currowIndex, selector, callback) {
                var dataList = referQueryData(param);
                $referDialog.show();
                $referDialog.dialog({
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
                            var $appendedRows = $referGrid.datagrid('getChecked');//***拿到多选行
                            if ($appendedRows.length == 0) {
                                return;
                            } else {
                                for (var i in $appendedRows) {
                                    $appendedRows[i].productName = $appendedRows[i].UserName;
                                    $appendedRows[i].quantity = 1;
                                    $appendedRows[i].number = $appendedRows[i].Age;
                                    $appendedRows[i].price = 100;

                                    if (i == 0) {
                                        var productName = $tableIdForm.datagrid('getEditor', {
                                            index: currentIndex,
                                            field: 'productName'
                                        });
                                        var price = $tableIdForm.datagrid('getEditor', {
                                            index: currentIndex,
                                            field: 'price'
                                        });
                                        var num = $tableIdForm.datagrid('getEditor', {
                                            index: currentIndex,
                                            field: 'num'
                                        });
                                        //$(productName.target).val($appendedRows[i].UserName);
                                        //$(price.target).val($appendedRows[i].Age);
                                        //$(num.target).val(1);
                                        //返回值后 触发公式
                                        //mainForm.girdEditor(currentIndex)
                                        $(mainForm.productName.target).val($appendedRows[i].UserName);
                                        $(mainForm.price.target).val($appendedRows[i].Age);
                                        $(mainForm.num.target).val(1);
                                        mainForm.gridGS(currentIndex);
                                        mainForm.headProcessData();
                                    }
                                    else {
                                        var rowindex = lastRowIndex + 1;//回调函数载入时读取，此时还未增行故行号要加1
                                        //增加行后回调
                                        mainForm.btnEvent.rowAdd(function () {
                                            var productName = $tableIdForm.datagrid('getEditor', {
                                                index: rowindex,
                                                field: 'productName'
                                            });
                                            var price = $tableIdForm.datagrid('getEditor', {
                                                index: rowindex,
                                                field: 'price'
                                            });
                                            var num = $tableIdForm.datagrid('getEditor', {
                                                index: rowindex,
                                                field: 'num'
                                            });
                                            $(mainForm.productName.target).val($appendedRows[i].UserName);
                                            $(mainForm.price.target).val($appendedRows[i].Age);
                                            $(mainForm.num.target).val(1);
                                           // mainForm.girdProcessData0(rowindex);
                                            //mainForm.girdEditor(rowindex)
                                            mainForm.gridGS(rowindex);
                                            mainForm.headProcessData();

                                        });

                                    }
                                }
                            }
                            $referDialog.dialog('close');
                            $(selector).focus();
                            $(selector).select();
                           
                        }                        
                    }]
                });
                $referGrid.datagrid({
                    //height : 380,                    
                    columns: [[
                    { field: 'Id', title: 'Id', width: 100, checkbox: true },
                    { field: 'UserName', title: '姓名', width: 100 },
                    { field: 'Age', title: '年龄', width: 100, align: 'right', width: 100 }
                    ]],
                    onDblClickRow: function (rowIndex, rowData) {//*********双击单行
                        //rowData.expire = rowData.expire ? CommonWidget.timestampToDate(rowData.expire) : '';
                        //self._updateEditorData(self._dialogTable, rowData);
                        $referDialog.dialog('close');
                    },
                    data: dataList
                });

            }
        }

    };
    //程序入口
    mainPage.init();
})




function getSelectRow(selector) {//网上查 点击取得行索引，有问题
    var rowIndex = $(selector).parents('.datagrid-row').attr('datagrid-row-index');
    console.log('FKFK', rowIndex)
    return rowIndex;
}
function getRowIndex(target) {
    var tr = $(target).closest("tr.datagrid-row");
    return paseInt(tr.attr("datagrid-row-index"));

}