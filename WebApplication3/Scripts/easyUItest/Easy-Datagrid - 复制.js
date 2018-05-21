window.define(function (require, exports, module) {
    require('jquery');
    require('cookie');
    require('easyui');
    require('easyuiCN');
    var $tableId = $('#mainGrid');
    var selectRowIndex = undefined;
    var $formTableId = $('#formGrid');

    var formProcessData = function () {
        var rowIndex = $formTableId.datagrid('getRows') && $formTableId.datagrid('getRows').length - 1;;
        var price = $formTableId.datagrid('getEditor', {
            index: rowIndex,
            field: 'price'
        });
        var num = $formTableId.datagrid('getEditor', {
            index: rowIndex,
            field: 'num'
        });
        var moneySum = $formTableId.datagrid('getEditor', {
            index: rowIndex,
            field: 'moneySum'
        });
        var amountEvent = function () {
            $(moneySum.target).val(Number($(num.target).val() * $(price.target).val()));
        };
        $(num.target).bind('keyup', amountEvent);
        $(price.target).bind('keyup', amountEvent);

    }
    var bindEvents = function () {
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
                        $formTableId.datagrid('appendRow', {});
                        var lastIndex = $formTableId.datagrid('getRows').length - 1;
                        $formTableId.datagrid('beginEdit', lastIndex);
                        formProcessData();
                    }
                }, {
                    id: 'btn-save',
                    text: '保存',
                    // iconCls: 'icon-add',
                    handler: function () {
                        $formTableId.datagrid('acceptChanges');
                        var rows = $formTableId.datagrid('getRows');
                        console.log(rows)
                    }
                }]
            });
            formGridInit();
        })
        $('#insert').bind('click', function () {
            //insertRow方法在头部增加
            //$('#mainGrid').datagrid('insertRow', { index: 0, row: {}});
            //$('#mainGrid').datagrid('beginEdit', 0);
            //appendRow方法在尾部增加
            $tableId.datagrid('appendRow', {});
            var lastIndex = $('#mainGrid').datagrid('getRows').length - 1;
            $tableId.datagrid('beginEdit', lastIndex);

        });
        $('#edit').bind('click', function () {
            console.log(selectRowIndex);
            if (selectRowIndex) {
                $('#mainGrid').datagrid('beginEdit', selectRowIndex);
                //selectRowIndex = undefined;
            }

        });

        $('#save').bind('click', function () {
            var rows = $tableId.datagrid('getRows');
            for (var i = 0; i < rows.length; i++) {
                var _userName = $tableId.datagrid('getEditor', {
                    index: i,
                    field: 'UserName'
                });
                console.log($(_userName.target).val())  //target编辑器返回的jQuery对象
            }

            //$tableId.datagrid('acceptChanges');  //grid本次所有行的编辑全部保存
            $tableId.datagrid('endEdit', selectRowIndex)

            // console.log($tableId.datagrid('getRows'))

        });
        $('#redo').bind('click', function () {
            $tableId.datagrid('rejectChanges');
        });
    }

    bindEvents();

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


    $tableId.datagrid({
        title: '用户列表',
        url: '../api/userinfo/GetUsers0',
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

    //for (var i = 0; i < 50; i++) {
    //    $tableId.datagrid('appendRow', {});
    //    var lastIndex = $tableId.datagrid('getRows') && $tableId.datagrid('getRows').length - 1;
    //    //$tableId.datagrid('beginEdit', lastIndex);
    //    selectRowIndex = lastIndex;
    //}


    function formGridInit() {
        var tableColumns = [];
        tableColumns.push({
            field: 'id',
            // checkbox: true,
            title: 'ID',
            width: 20,
            align: 'center'
        });
        tableColumns.push({
            field: 'UserName',
            title: '入库单号',
            width: 160,
            editor: 'text',
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
            field: 'moneySum',
            title: '金额',
            width: 120,
            editor: 'text'
          , align: 'right'
        });

        $formTableId.datagrid({
            method: 'GET',
            width: 900,
            height: 150,
            columns: [tableColumns],
            ctrlSelect: true,
            checkOnSelect: true,
            selectOnCheck: true,
            rownumbers: true,
            onClickRow: function (rowIndex, rowData) {
            }
             , onAfterEdit: function (index, row) {
             }
        });

        for (var i = 0; i < 1; i++) {
            $formTableId.datagrid('appendRow', {});
            $formTableId.datagrid('beginEdit', i);
            //selectRowIndex = i;
            formProcessData()
        }
    }

})


/*
    var $inp = $('#mainDialog :input:text[type!=hidden][readonly!=true]');
    $inp.each(function (index, data) {
        $(this).bind('keydown', function (e) {
            var key = e.which;
            if (key == 13) {
                e.preventDefault();
                $($inp[index+1]).focus()
            }
        })
    })

    function enterKeyTest0() {
        return
        var inpLast = $inp.length;

        for (var i = 0; i < inpLast; i++) {
            $($inp[i]).bind('keydown', function (e) {
                console.log('<<<enterKeyTest0', $inp[i])
                var key = e.which;
                if (key == 13) {
                    e.preventDefault();
                    var nxtIdx = $inp.index(this) + 1;
                    //if (i == inpLast - 1) {
                    //    mainForm.btnEvent.rowAdd();
                    //}
                    $($inp[i+1]).focus()
                }
            })
        }
    }
    enterKeyTest0();

    function enterKeyTest() {
        return;
        var $inp0 = $inp;
         $inp = $('#mainDialog :input:text[type!=hidden][readonly!=true]')
         //console.log($inp0,$inp)
         var inpLast0 = $inp0.length;
         var inpLast = $inp.length;
         for (var i = inpLast0; i < inpLast; i++) {
             console.log('<<<enterKeyTest', $inp[i])
             $($inp[i]).bind('keydown', function (e) {
                 var key = e.which;
                 if (key == 13) {
                     e.preventDefault();
                     //var nxtIdx = $inp.index(this) + 1;
                     if (i == inpLast-1) {
                         mainForm.btnEvent.rowAdd();
                     }
                     $($inp[i+1]).focus()
                 }
             })
         }
    }

     function enterkey0() {
        var $inp = $('#mainDialog :input:text[type!=hidden][readonly!=true]')
        console.log($inp)
        var inpLast = $inp.length;
        $inp.bind('keydown', function (e) {
            var key = e.which;
            if (key == 13) {
                e.preventDefault();
                var nxtIdx = $inp.index(this) + 1;
                console.log('!!!!',$($inp[nxtIdx]))//表格最后一行时，对象是空，所以会二个回车才能进入下一行
                if (nxtIdx === inpLast) {
                    mainForm.btnEvent.rowAdd();
                }
                $($inp[nxtIdx]).focus()          
            }
        })
    }

    */

