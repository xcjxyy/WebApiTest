define(function (require, exports, module) {
    require('jquery');
    require('easyui');
    require('easyuiCN');
    var common= require('commonwidget');
    var uri3 = '../../api/userinfo/GetUsers';
    var uri4 = '../../api/userinfo/PostUser1';
    var _startTime = new Date(Date.parse(new Date()) - 86400000 / 3 - 7 * 86400000).format('yyyy-mm-dd');
    var _endTime = new Date().format('yyyy-mm-dd');// Date.parse(new Date().format('yyyy-mm-dd')) + 86400000 * 2 / 3 - 60;
    $(document).ready(function () {
        common.initToolbar(['add', 'edit', 'initialStorage']);
        //$(tools['add']).bind('click', function () {
        //    if ($(this).hasClass('l-btn-disabled')) {
        //        return;
        //    }
        //    var rowData = {};
        //    rowData.warehouseName = searchAction.getWarehouseName();
        //    rowData.warehouseId = searchAction.getWarehouseId();
        //    rowData.subjectName = searchAction.getSubjectName();
        //    rowData.subjectId = searchAction.getSubjectId();
        //    stockinAction.setRowData(rowData);
        //    stockinAction.setRequestParams(searchAction.getRequestParams());
        //    stockinAction.add({
        //        title: '新增入库单',
        //        contentType: 'application/json',
        //        url: CommonWidget.parseUrl("/inventory/stockin/edit"),
        //        action: 'add'
        //    });
        //});
        $('#startdate').datebox({
            width: 100,
            editable: false,
            value: _startTime,
            required: false,
            onSelect: function (date) {
                _startTime = Date.parse($(this).datebox('getValue')) - 86400000 / 3;
            }
        });

        addrow(0);
        var $inp = $("input[type!=hidden][readonly=false]");
        var nxtIdx = $inp.index();
        $("input:text").keypress(function (e) {
            if (e.which == 13) {
                var inputs = $("body").find(":text"); // 获取表单中的入框"form[name='articleForm']"
                var i = inputs.length;
                var idx = inputs.index(this); // 获取当前焦点输入框所处的位置
                inputs[idx + 1].focus(); // 设置焦点
                inputs[idx + 1].select(); // 选中文字
            }
        });
    });

    function grid_keydown(obj, wantnewrow, rowid, e) {
        var $inp = $("input[type!=hidden]");//将增行按钮也计入，所在光标移入后，触发了按钮事件
        var nxtIdx = $inp.index(obj) + 1;
        //alert(obj.getAttribute("id"));
        //if (obj.getAttribute("id") == "PRODUCT_NAME_" + rowid) {
        //    testD();
        //    obj.focus();
        //    return
        //}
        if (e.which == 13) {
            if ($inp.eq(nxtIdx) != null)
                $inp.eq(nxtIdx).focus();
        }

    }

    function testD() {
        $("#materialsDict-dialog").show();
        $("#materialsDict-dialog").dialog({
            title: '根据供货单位选择物资字典',
            width: 200,
            height: 200,
            modal: true
        });
    }

    function formatItem(item) {
        return item.UserName + '--id:' + item.Id + '--age:' + item.Age;
    }

    function find() {
        var id = $('#prodId').val();
        $.getJSON(uri + '/' + id)
            .done(function (data) {
                $('#product').text(formatItem(data));
            })
            .fail(function (jqXHR, textStatus, err) {
                $('#product').text('Error: ' + err);
            });
    }
    function add() {
        // var user = $('#user-form').serialize();
        var user = { "username": "er", "age": 123, "Items": [{ "Id": 23, "Address": "AA" }, { "Id": 33, "Address": "ttAA" }] }
        $.post(
     uri4,
     //{ username: "YY", Age: 567, Id: 555 },
     user,
    //{
    //    Id: $("#Id").val(),
    //    UserName: $("#UserName").val(),
    //    Age: $("#Age").val()
    //},
    function (data, textStatus) {
        console.log("test" + data);
        alert(data);
        if (data) {
            alert(data + "PPPOK");
            $("#Id").val("");
            $("#UserName").val("");
            $("#Age").val("");
            //location.href = '../view/index.html';
        }
        else { alert('添加失败'); }
    },
    'json')
    };




    function get_lastrowid() {
        var table = document.getElementById('table_details');
        var tbody = table.tBodies[table.tBodies.length - 1];
        var tdlength = table.rows.length;

        var rowid = table.rows[tdlength - 1].cells[0].getAttribute("rowid");
        return rowid;
    }

    var G_COLUMNS = [];
    var table = document.getElementById('table_details');
    var tdlength = table.rows[0].cells.length;
    for (var i = 0; i < tdlength; i++) {
        var columns = eval(table.rows[0].cells[i].getAttribute("columns"));//**** eval()将['A','B'] 字符串转成 A，B数组
        G_COLUMNS.push({ LEN: columns.length, COLS: columns });      //********G_COLUMNS  数组类型  在scm.js中声明   SCM_ADD_EVENT
    };

    //增加行
    var maxrowid = 0;
    function addrow(flag) {
        var str_tr_s = []
        var str_tr = "";

        if (flag > 0) {
            str_tr_s.push(table.innerHTML.replace(/TOP:0px/ig, ""));
            for (var j = 0; j < flag; j++) {
                str_tr = "";
                for (var i = 0; i < tdlength; i++) {
                    var str_col = "";
                    var columns = G_COLUMNS[i].COLS;
                    var text_align = table.rows[0].cells[i].getAttribute("text_align");
                    var newrow = table.rows[0].cells[i].getAttribute("newrow");
                    var isdecimal = table.rows[0].cells[i].getAttribute("decimal");

                    for (var m = 0; m < columns.length; m++) {
                        if (m == columns.length - 1) {
                            switch (columns[m]) {
                                case "GET_DATE":
                                case "USING_DATE":
                                    str_col += '<input id="' + columns[m] + "_" + maxrowid.toString() + '"  onkeydown="grid_keydown(this,\'' + newrow + '\',' + maxrowid + ')" onfocus="this.select();" onblur="grid_checkdate(this)" type="text"  class="grid_input">';
                                    break;
                                default:
                                    str_col += "<input id='" + columns[m] + "_" + maxrowid.toString() + "' onfocus='this.select()'  onkeyup='grid_keydown(this,\"" + newrow + "\"," + maxrowid + ")' type='text'  style='text-align:" + text_align + ";' class='grid_input'>"
                            }

                        }
                        else {
                            str_col += "<input id='" + columns[m] + "_" + maxrowid.toString() + "' type='hidden' >"
                        }
                    }
                    if (i == 0) {
                        str_tr += "<td align='center' style='background-color:#edeef0; color:#000080;font-size:14px;font-weight:bold;' rowid='" + maxrowid.toString() + "'>" + str_col + "</td>";
                    }
                    else {
                        str_tr += "<td>" + str_col + "</td>";
                    }
                }
                str_tr_s.push("<tr onclick='clickrow()'>" + str_tr + "</tr>");
                maxrowid++;
            }
            document.getElementById("div_details").innerHTML = "<table id='table_details' class='table_details'  cellpadding='0' cellspacing='0' style='table-layout: fixed;'>" + str_tr_s.join("") + "</table>";
        }
        else {    //*******  flag=0   -- addrow(0) begin
            var lastrowid = get_lastrowid();
            if ($("#PRODUCT_NAME_" + lastrowid).val() == "") {//*** if 为空不让增加空行
                $("#PRODUCT_NAME_" + lastrowid).focus();
                //return;
            }

            for (var i = 0; i < tdlength; i++) {     //表格cell数
                var str_col = "";
                var columns = G_COLUMNS[i].COLS;                            //***** G_COLUMNS[i]
                var text_align = table.rows[0].cells[i].getAttribute("text_align");
                var newrow = table.rows[0].cells[i].getAttribute("newrow");
                var isdecimal = table.rows[0].cells[i].getAttribute("decimal");
                for (var m = 0; m < columns.length; m++) { // m 1个cell里column 个数
                    if (m == columns.length - 1) {    // 最后的字段名可见
                        switch (columns[m]) {
                            case "GET_DATE":
                            case "USING_DATE":
                                str_col += '<input id="' + columns[m] + "_" + maxrowid.toString() + '"  onkeydown="grid_keydown(this,\'' + newrow + '\',' + maxrowid + ')" onfocus="this.select();" onblur="grid_checkdate(this)" type="text"  class="grid_input">';
                                break;
                                //grid_keydown(this,\"" + newrow + "\"," + maxrowid + ")
                            default:
                                str_col += "<input id='" + columns[m] + "_" + maxrowid.toString() + "' onfocus='this.select()'  onkeydown='grid_keydown(this,\"" + newrow + "\"," + maxrowid + ",event)'  type='text' style='text-align:" + text_align + "'  class='grid_input'>"
                                //console.log(str_col)
                        }
                        //******default:拼出来的标记   <input id='PRODUCT_NAME_1' onfocus='this.select()'   onkeydown='grid_keydown(this,"newrow",1)'  type='text' style='text-align: center '  class='grid_input'>
                    }
                    else {
                        str_col += "<input id='" + columns[m] + "_" + maxrowid.toString() + "' type='hidden' >"//非最后字段名隐藏
                    }
                }
                if (i == 0) {               //****第一列 序号列
                    str_tr += "<td align='left' rowid='" + maxrowid.toString() + "' style='background-color:#edeef0; color:#000080;font-size:14px;font-weight:bold;'>" + str_col + "</td>";
                }
                else {
                    str_tr += "<td>" + str_col + "</td>";
                }
            }
            var tr = insTable(table, "<tr>" + str_tr + "</tr>");
            //set_row_status("edit_status", maxrowid.toString());//***** scm.js
            //console.log("tr--"+tr.innerHTML);
            tr.scrollIntoView();//*****处理滑动条自动在底good
            //绑定事件
            attach_detail_event(maxrowid.toString());              //******绑定
            $("#PRODUCT_NAME_" + maxrowid).focus();
            setrownum(tr);                                         //设置序号值
            selectrow(tr);                                         //序号列颜色字体
        }//----addrow(0) end
        maxrowid++;
        return maxrowid;
    }

    function insTable(tb, str) {
        var o = document.createElement("div")
        var ol;
        o.innerHTML = "<table>" + str + "</table>"
        ol = o.childNodes[0].tBodies[0].rows
        return tb.tBodies[tb.tBodies.length - 1].insertAdjacentElement("beforeEnd", ol[0])
    }

    function setrownum(trobj) {
        if (trobj.rowIndex == 0) return
        trobj.cells[0].innerText = trobj.rowIndex;
    }
    var curRowIndex = -1;
    function selectrow(obj) {
        if (curRowIndex == obj.rowIndex) return;
        var table = document.getElementById('table_details');
        if (curRowIndex != -1) {
            if (table.rows.length > curRowIndex) {
                table.rows[curRowIndex].style.backgroundColor = "Transparent";
                table.rows[curRowIndex].cells[0].style.color = "#000080";
                table.rows[curRowIndex].cells[0].style.fontSize = "14px";
                table.rows[curRowIndex].cells[0].style.fontWeight = "bold";
            }
            else {
            }
        }
        curRowIndex = obj.rowIndex;
        obj.style.backgroundColor = "#F9E3AA";

        table.rows[curRowIndex].cells[0].style.fontWeight = "bold";
        table.rows[curRowIndex].cells[0].style.color = "red";
        table.rows[curRowIndex].cells[0].style.fontSize = "16px";
    }


    function adminMaterialsDictQuery(options) {
        options = options || {};
        options.cache = false;
        options.type = typeof options.cache == 'undefined' ? 'GET' : 'POST';
        var dataList = null;
        // 读取本地缓存数据
        $.ajax({
            type: 'GET',//options.type,
            url: uri3,
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

    function openMaterialsDicDialog(rowid) { //selector, keywords
        var self = this;
        // 打开物资字典对话框
        var thisDialog = $('#materialsDict-dialog');
        var thisTable = $('#dictList');
        var $materialsDialog = $('#dictList');
        //var params = {
        //    keyword: keywords,
        //    page: 1,
        //    rows: 50
        //};
        var tableData = adminMaterialsDictQuery({
            cache: false,
            type: 'GET',
            data: 'params'
        });
        // console.log('>>> tableData:');
        //console.log(tableData);
        //for (var i in tableData.rows) {
        //    var o = (tableData.rows)[i];
        //    o.productNo = o.no;
        //}
        //if (tableData.total == 1) {
        //    var data = (tableData.rows)[0];
        //    $.messager.progress('close');
        //    this._updateEditorData(self._dialogTable, data);
        //    self._supportDblClickCell = true;
        //    return;
        //} else if (tableData.total == 0) {
        //    var message = '查询不到该物资，请确认该物资是否关联到核算科目';
        //    if (tableData.zeroStore) {
        //        message = '该物资库存数量为0';
        //    }
        //    $.messager.progress('close');
        //    CommonWidget.showMsg({
        //        title: '提示信息',
        //        msg: message
        //    }, 'alert');
        //    return false;
        //} else {
        thisDialog.show();
        thisDialog.dialog({
            title: '根据供货单位选择物资字典',
            width: 700,
            height: 500,
            modal: true,
            onResize: function () {
                setTimeout(function () {
                    thisTable.datagrid('resize');
                }, 100);
            },
            buttons: [{
                id: 'btn-save',
                text: '确定',
                iconCls: 'icon-save',
                handler: function () {//********* 多行返回
                    var currentIndex = rowid;
                    var isNeedAppendRow = false;
                    var $appendedRows = thisTable.datagrid('getChecked');//***拿到多选行
                    if ($appendedRows.length == 0) {
                        //alert('FK!');
                        showMsg({
                            title: '提示信息',
                            msg: '请勾选要添加到采购计划的产品！'
                        });
                        return;
                    } else
                        //self.rowAction.getIndex();
                    {//**先增加空行再参照赋值
                        var addrows = $appendedRows.length - (maxrowid - rowid);
                        if (addrows > 0) {
                            for (var i = 0; i < addrows; i++) {
                                addrow(0)
                            }
                        }

                        for (var i = 0; i < $appendedRows.length; i++) {
                            $('#PRODUCT_NAME_' + currentIndex).val($appendedRows[i].UserName);
                            $('#SPEC_NAME_' + currentIndex).val($appendedRows[i].Age);
                            currentIndex++;
                        }
                    }

                    thisDialog.dialog('close');
                    //获取空行
                    //var getBlankRows = function(rowIndex) {
                    //    var dataList = [];
                    //    var rows = $('#inventory-list').datagrid('getRows');
                    //    for (var i = rowIndex; i < rows.length; i++) {
                    //        if (!rows[i].productSpecId) {
                    //            dataList.push(rows[i]);
                    //        }
                    //    }
                    //    return dataList;
                    //};

                    //var rows = $('#inventory-list').datagrid('getRows');
                    //for (var i in $appendedRows) {
                    //    var productName = self._dialogTable.datagrid('getEditor', {
                    //        index: currentIndex,
                    //        field: 'productName'
                    //    });
                    //    $appendedRows[i].productSpecId = $appendedRows[i].id;
                    //    $appendedRows[i].productId = $appendedRows[i].productSpecId;
                    //    $appendedRows[i].productName = $appendedRows[i].productName ? $appendedRows[i].productName : $appendedRows[i].name;
                    //    $appendedRows[i].quantity = 1;
                    //    $appendedRows[i].number = $appendedRows[i].quantity;
                    //    $appendedRows[i].amount = $appendedRows[i].price * $appendedRows[i].quantity;
                    //    $appendedRows[i].moneySum = $appendedRows[i].amount;
                    //    $appendedRows[i].productArea = $appendedRows[i].area;

                    //    var blankRows = getBlankRows(currentIndex);
                    //    if (rows[currentIndex] && rows[currentIndex].productSpecId) {
                    //        if (i > 0) {
                    //            CommonWidget.showMsg({
                    //                title: '提示信息',
                    //                msg: '修改数据，只能选择一条数据！'
                    //            }, 'warning')
                    //            return;
                    //        } else {
                    //            $('#inventory-list').datagrid('updateRow', { index: currentIndex, row: $appendedRows[i] });
                    //        };
                    //    } else {
                    //        if (blankRows.length > 0) {
                    //            $('#inventory-list').datagrid('updateRow', {
                    //                index: $('#inventory-list').datagrid('getRowIndex', blankRows[0]),
                    //                row: $appendedRows[i]
                    //            });
                    //        } else {
                    //            $('#inventory-list').datagrid('appendRow', $appendedRows[i]);
                    //        }
                    //    };
                    //    self.processData('#inventory-list', currentIndex);
                    //    currentIndex++;
                    //}
                    //if (isNeedAppendRow || (!rows[currentIndex])) {
                    //    self.rowAction.addRow();
                    //    self.processData('#inventory-list', self.rowAction.getIndex());
                    //} else {
                    //    if (!rows[currentIndex].productSpecId && rows[currentIndex].editing) {
                    //        var productName = $('#inventory-list').datagrid('getEditor', {
                    //            index: currentIndex,
                    //            field: 'productName'
                    //        });
                    //        $(productName.target).focus();
                    //    }
                    //}
                    //self._supportDblClickCell = true;
                    //self.rowAction.saveAll();
                    thisDialog.dialog('close');
                }
            }, {
                id: 'btn-close',
                text: '关闭',
                iconCls: 'icon-close',
                handler: function () {
                    thisDialog.dialog('close');
                }
            }]
        }).dialog('center');
        thisTable.datagrid({
            //height : 380,                    
            columns: [[
            { field: 'Id', title: 'Id', width: 100, checkbox: true },
            { field: 'UserName', title: '姓名', width: 100 },
            { field: 'Age', title: '年龄', width: 100, align: 'right', width: 100 }
            ]],
            onDblClickRow: function (rowIndex, rowData) {//*********双击单行
                rowData.expire = rowData.expire ? CommonWidget.timestampToDate(rowData.expire) : '';
                self._updateEditorData(self._dialogTable, rowData);
                thisDialog.dialog('close');
            },
            data: tableData
        });
        // }
    }

    //function grid_keydown1(obj, wantnewrow, rowid,event) {
    //    var table = document.getElementById('table_details');
    //    var tdlength = table.rows[0];
    //    var row = obj.parentNode.parentNode;
    //    var objid = obj.id.substr(0, obj.id.lastIndexOf("_"));
    //    var iscombo = obj.combo;
    //    var CURNAME = obj.CURNAME;
    //    var curvalue = obj.value;
    //    var combodiv = document.getElementById("Combo_Content_Div_");


    //    if (event.which == 37)//<-
    //    {
    //        if (iscombo == "true" && combodiv != null) {
    //            return;
    //        }
    //        if (doGetCaretPosition(obj) == 0 || obj.value == getSelectedText()) {
    //            var cell = obj.parentNode;
    //            cell = cell.previousSibling;
    //            while (cell.lastChild == null || cell.lastChild.readOnly == true) {
    //                cell = cell.previousSibling;
    //            }
    //            if (cell != null && cell.getAttribute("rowid") == null) {
    //                cell.lastChild.focus();
    //            }
    //        }
    //    }
    //    else if (event.which == 39)//->
    //    {

    //    }
    //    else if (event.which == 38)//up
    //    {
    //        if (iscombo == "true" && combodiv != null) {
    //            return;
    //        }
    //        if (row.rowIndex > 1) {
    //            var tempid = objid + "_" + table.rows[row.rowIndex - 1].cells[0].getAttribute("rowid");
    //            var obj = document.getElementById(tempid);
    //            if (obj != null) {
    //                obj.focus();
    //                obj.select()
    //            };
    //        }
    //    }
    //    else if (event.which == 40)//down
    //    {
    //        if (iscombo == "true" && combodiv != null) {
    //            return;
    //        }
    //        if (row.nextSibling != null) {
    //            var tempid = objid + "_" + row.nextSibling.cells[0].getAttribute("rowid");
    //            var obj = document.getElementById(tempid);
    //            if (obj != null) {
    //                obj.focus();
    //                obj.select()
    //                return;
    //            };
    //        }
    //        else if (wantnewrow == "down") {
    //            addrow(0);
    //            event.cancelBubble = true;
    //            event.returnValue = false;
    //        }
    //    }
    //    else if (event.which == 13) {

    //        if (iscombo == "true" && combodiv != null) {
    //            return;
    //        }
    //        if (iscombo == "true" && CURNAME != curvalue) {
    //            return;
    //        }
    //        if (wantnewrow == "true" && row.nextSibling == null) {
    //           // addrow(0);
    //            event.cancelBubble = true;
    //            event.returnValue = false;
    //        }

    //    }
    //}

    function attach_detail_event(rowid) {               //**************************** 表格里数量X单价、字段参照
        $("#PRODUCT_NAME_" + rowid).keydown(function () {
            if (!$(this).val() == '') { openMaterialsDicDialog(rowid); } else
            {
                return//alert('opp');
            };

            //$(this).select();

            $('#mobile').val(formularHead.sumAmount())

        });


        $('#SPEC_NAME_' + rowid).change(function () {
            $('#mobile').val(formularHead.flsum('SPEC_NAME'))
        });

        $('#FUND_NAME_' + rowid).blur(function () {
            $('#SPEC_NAME_' + rowid).val($('#FUND_NAME_' + rowid).val() * $('#STANDBY_FLAGNAME_' + rowid).val());
            $('#SPEC_NAME_' + rowid).change();
        })

        $('.grid_input').keydown(function (event) {
            //alert(event.which)
            var obj = this;
            var table = document.getElementById('table_details');
            var tdlength = table.rows[0];
            var row = obj.parentNode.parentNode;
            var objid = obj.id.substr(0, obj.id.lastIndexOf("_"));
            var iscombo = obj.combo;
            var CURNAME = obj.CURNAME;
            var curvalue = obj.value;
            var combodiv = document.getElementById("Combo_Content_Div_");
            if (event.which == 37)//<-
            {
                //if (iscombo == "true" && combodiv != null) {
                //    return;
                //}                 
                if (doGetCaretPosition(obj) == 0) {
                    var cell = obj.parentNode;
                    console.log(cell);
                    cell = cell.previousSibling;
                    while (cell.lastChild == null || cell.lastChild.readOnly == true) {
                        cell = cell.previousSibling;
                    }
                    if (cell != null && cell.getAttribute("rowid") == null) {
                        cell.lastChild.focus();
                    }
                }
            }
            else if (event.which == 39)//->
            {

            }
            else if (event.which == 38)//up
            {
                //if (iscombo == "true" && combodiv != null) {
                //    return;
                //}
                if (row.rowIndex > 1) {
                    var tempid = objid + "_" + table.rows[row.rowIndex - 1].cells[0].getAttribute("rowid");
                    var obj = document.getElementById(tempid);
                    if (obj != null) {
                        obj.focus();
                        obj.select()
                    };
                }
            }
            else if (event.which == 40)//down
            {
                //if (iscombo == "true" && combodiv != null) {
                //    return;
                //}
                if (row.nextSibling != null) {
                    var tempid = objid + "_" + row.nextSibling.cells[0].getAttribute("rowid");
                    var obj = document.getElementById(tempid);
                    if (obj != null) {
                        obj.focus();
                        obj.select()
                        return;
                    };
                }
                //else if (wantnewrow == "down") {
                //    addrow(0);
                //    event.cancelBubble = true;
                //    event.returnValue = false;
                //}
            }
            //else if (event.which == 13) {

            //    if (iscombo == "true" && combodiv != null) {
            //        return;
            //    }
            //    if (iscombo == "true" && CURNAME != curvalue) {
            //        return;
            //    }
            //    if (wantnewrow == "true" && row.nextSibling == null) {
            //       // addrow(0);
            //        event.cancelBubble = true;
            //        event.returnValue = false;
            //    }

            //}
        })
    }      //-------- ---------- attach_detail_event(rowid) 方法结束

    var formularHead = {
        sumAmount: function () {
            var sumamount = 0;
            for (var i = 0; i <= maxrowid; i++) {
                if (!isNaN(parseFloat($("#SPEC_NAME_" + i).val()))) {
                    sumamount = FloatAdd(sumamount, parseFloat($("#SPEC_NAME_" + i).val()));
                }
            }
            return sumamount;
        },
        flsum: function (col) {
            var sum = 0;
            var $col = "#" + col + "_"
            for (var i = 0; i <= maxrowid; i++) {
                if (!isNaN(parseFloat($($col + i).val()))) {
                    sum = FloatAdd(sum, parseFloat($($col + i).val()));
                }
            }
            return sum;
        }
    }

    var formularBody = {
        amount: function () {
            var amount = 0;
            //amount=FloatMul()
        }

    }

    var reference = {

    }










})