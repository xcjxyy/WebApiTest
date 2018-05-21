//define(function (require, exports, module) {
//    alert('gridtabel');
//    require('jquery');
//    require('easyui');
//    require('easyuiCN');

    //var uri3 = '../../api/userinfo/GetUsers';
    //var uri4 = '../../api/userinfo/PostUser1';
    //var _startTime = new Date(Date.parse(new Date()) - 86400000 / 3 - 7* 86400000).format('yyyy-mm-dd');
    //var _endTime = new Date().format('yyyy-mm-dd');
    //var tools = ['add', 'edit', 'delete', 'audit'];
    //$(document).ready(function () {
               
    //    initToolbar(tools);
    //    initDatagrid();


    //    $('#startdate').datebox({    
    //        width: 100,
    //        editable: false,
    //        value: _startTime,
    //        required: false,
    //        onSelect: function(date) {
    //            _startTime = Date.parse($(this).datebox('getValue')) - 86400000 / 3;
    //        }
    //    }); 
      
    //});

    //var tableColumns=[
    //        { field: 'Id', title: 'Id', width: 100 },
    //        { field: 'UserName', title: '姓名', width: 100 },
    //        { field: 'Age', title: '年龄', width: 100, align: 'right', width: 100 }
    //];

    //function initDatagrid() {
    //    $('#mainGrid').datagrid({
    //        // url: uri3,
    //        columns: [tableColumns],
    //        //queryParams: requestData,
    //        rowStyler: function (index, row) {
    //            // 冲红行显示红色
    //            if (row.red) {
    //                if (row.cancelledDate > 0) {
    //                    return 'color: red!important; text-decoration: line-through;';
    //                }
    //                return 'color: red;';
    //            }
    //            if (row.cancelledDate > 0) {
    //                return 'color: gray!important; text-decoration: line-through;';
    //            }
    //        },
    //        //singleSelect: true,
    //        ctrlSelect:true,
    //        method:'GET',
    //        //type: 'GET',
    //        fit: true,
    //        fitColumns: false,
    //        striped: true,
    //        rownumbers: true,
    //        //toolbar: '#test-tool',
    //        pagination: true,
    //        //loadFilter: CommonWidget.datagridLoadFilter,
    //        // 双击显示
    //        onDblClickRow: function (rowIndex, rowData) {
    //            var pageUrl = '/pages/stockManage/materialsStorage/materialsStorage_view.jsp?_t=' + (new Date()).getTime();

    //            rowData.warehouseName = self.searchAction.getWarehouseName();
    //            rowData.subjectName = self.searchAction.getSubjectName();
    //            self._supportDblClickCell = false;
    //            self.setRowData(rowData);
    //            self.view({
    //                title: '查看入库单',
    //                action: 'view',
    //                pageUrl: pageUrl,
    //                editable: false
    //            });
    //        }
    //    })
    //};

   
    //});

    //$('#search-keywords').searchbox({
    //    width: 200,
    //    height: 20,
    //    prompt: 'this._prompt',
    //    searcher: function (value, name) {
    //        var warehouseId = "warehouseSelect.combobox('getValue')";
    //        var params = {
    //            keyword: value,
    //            start: self._startTime,
    //            end: self._endTime,
    //            subjectId: subjectSelect.combobox('getValue'),
    //            warehouseId: warehouseSelect.combobox('getValue')
    //        };
    //        var start = $('#startTime').datebox('getValue');
    //        var end = $('#endTime').datebox('getValue');
    //        if (!start) {
    //            CommonWidget.showMsg({
    //                title: '提示信息',
    //                msg: '开始时间不能为空！'
    //            }, 'warning');
    //            return;
    //        };
    //        if (!end) {
    //            CommonWidget.showMsg({
    //                title: '提示信息',
    //                msg: '结束时间不能为空！'
    //            }, 'warning');
    //            return;
    //        };
    //        if (!statusSelect.is(':hidden')) {
    //            params.status = statusSelect.combobox('getValue');
    //        }
    //        if (warehouseId) {
    //            self.setRequestParams(params);
    //            self.doSearch(value, name);
    //        } else {
    //            CommonWidget.showMsg({
    //                title: '提示信息',
    //                msg: '仓库没有被设定'
    //            }, 'warning');
    //            return;
    //        };
    //    }
    //});
//})

define(function (require, exports, module) {
    require('jquery');
    require('cookie');
    require('easyui');
    require('easyuiCN');

   

    var SessionKey = $.cookie('SessionKey');
    
    var CommonWidget = require('commonwidget');
    var config = 'CommonWidget.config()'; // 配置

    CommonWidget.extendEasyui(); // 继承easyui
    // 定义变量
    var searchAction = null;
    var invoiceRedAction = null;
    var rowAction = null;

    var uri = '../api/userinfo/GetUsers0'//?SessionKey=';//datagrid不能在ajax中beforeSend设置xhr的header 故在请求地址尾部+查询参数
    var uri3 = uri + SessionKey;
   // uri3.append(SessionKey);
    //alert(uri3);
    /**
	 * 入库单查询
	 */
    var stockinQuery = {
        init: function () {
            this.cacheDom();
            this.initToolbar();
            this.bindEvents();
            this.initDatagrid();
        },

        cacheDom: function () {
            this.$btnAdd = $('#btn-add');
            this.$btnEdit = $('#btn-edit');
            this.$tableId = $('#mainGrid');
            this.$warehouseSelect = $('#warehouseSelect');
            this.$subjectSelect = $('#subjectSelect');
            this.$statusSelect = $('#statusSelect');
            this.$startTime = $('#startTime');
            this.$endTime = $('#endTime');
            this.$keywords = $('#search-keywords');
            this.$mainDialog = $('#mainDialog');
        },
        /**
		 * 初始化工具栏
		 */
        initToolbar: function () {
            this.searchPrompt = '请输入入库单号或物资来源单位名称';
            //linkbutton处理
            this.tools = CommonWidget.initToolbar(['add', 'edit', 'delete', 'audit']);
           
            // 时间选择
            var lastWeekDate = new Date();
            lastWeekDate.setDate(lastWeekDate.getDate() - 17);
            this.$startTime.datebox({
                width: 100,
                editable: false,
                value: lastWeekDate.format('yyyy-mm-dd')
            });
            this.$endTime.datebox({
                width: 100,
                editable: false,
                value: new Date().format('yyyy-mm-dd')
            });
            // 搜索操作
            this.$keywords.searchbox({
                width: 340,
                height: 24,
                prompt: this.searchPrompt,
                searcher: this.searchHandler.bind(this)
            });
            //初始化按钮后触发 查询
            //setTimeout(this.doSearch.bind(this), 300);
        },
        /**
		 * 绑定事件
		 */
        bindEvents: function () {
            var self = this;
            // 新增
            $(this.tools['add']).bind('click', function () {
                console.log(self.$mainDialog);
                self.$mainDialog.show();
                self.$mainDialog.dialog({
                    title: 'title',
                    modal: true,
                    maximized: true,
                    contentType: 'application/json',
                    //url : CommonWidget.parseUrl("/inventory/stockOut/edit"),
                    buttons: [{
                        id: 'btn-addRow',
                        text: '增加行',
                        iconCls: 'icon-add',
                        handler: function () {
                            addrow(0)
                        }
                    }]
                }
                    );

                addrow(0);
            });
        },
        /**
		 * 请求参数
		 */
        getRequestParams: function () {
            var params = {
                keyword: this.$keywords.searchbox('getValue'),
                start: Date.parse(this.$startTime.datebox('getValue')) - 86400000 / 3,
                end: Date.parse(this.$endTime.datebox('getValue')) + 86400000 * 2 / 3 - 60,
                subjectId: this.$subjectSelect.combobox('getValue'),
                warehouseId: this.$warehouseSelect.combobox('getValue'),
                status:this.$statusSelect.combobox('getValue')
            }
            return params;
        },
        /**
		 * 搜索处理
		 * @param  {string} value 关键词
		 * @param  {string} name  关键词name属性值
		 */
        searchHandler: function (value, name) {
            var params = this.getRequestParams();
            // 验证搜索条件
            if (!params.start) {
                CommonWidget.showMsg({
                    title: '提示信息',
                    msg: '开始时间不能为空！'
                }, 'warning');
                return;
            }
            if (!params.end) {
                CommonWidget.showMsg({
                    title: '提示信息',
                    msg: '结束时间不能为空！'
                }, 'warning');
                return;
            }
            if (!params.warehouseId) {
                CommonWidget.showMsg({
                    title: '提示信息',
                    msg: '仓库没有被设定'
                }, 'warning');
                return;
            }
            this.doSearch(value, name);
        },

        doSearch: function () {
            $.messager.progress();
            var requestData = {userid:43};//this.getRequestParams();

            var opts = this.$tableId.datagrid('options');  //得到datagrid的属性参数对象
            if (opts.url == null) {
                opts.url = uri3;// CommonWidget.parseUrl('/inventory/stockin/query');
            }

            this.$tableId.datagrid('load', requestData);
            $.messager.progress('close');
        },
        /**
		 * 初始化表格
		 */
        initDatagrid: function () {
            var self = this;
            var tableColumns = [];
            tableColumns.push({
                field: 'UserName',
                title: '入库单号',
                width: 160,
                //formatter: CommonWidget.columnFormatTitle
            });
            tableColumns.push({
                field: 'sex',
                title: '核算科目',
                width: 110
            });
            tableColumns.push({
                field: 'Age',
                title: '入库人员',
                width: 90
            });
            tableColumns.push({
                field: 'inTime',
                title: '入库日期',
                width: 120,
                formatter: CommonWidget.columnFormatDate
            });

            this.$tableId.datagrid({
                url:uri,
                columns: [tableColumns],               
                singleSelect: true,
                type: 'GET',
                fit: true,
                fitColumns: true,
                striped: true,
                rownumbers: false,
                pagination: false,
                //loadFilter: CommonWidget.datagridLoadFilter,//loadFilter属性可以对返回的data进行整形和过滤
                // 双击显示
                onDblClickRow: function (rowIndex, rowData) {

                }
            });
        }
    };

    var G_COLUMNS = [];
    var table = document.getElementById('table_details');
    var tdlength = table.rows[0].cells.length;
    for (var i = 0; i < tdlength; i++) {
        var columns = eval(table.rows[0].cells[i].getAttribute("columns"));//**** eval()将['A','B'] 字符串转成 A，B数组
        G_COLUMNS.push({ LEN: columns.length, COLS: columns });      //********G_COLUMNS  数组类型  在scm.js中声明   SCM_ADD_EVENT
    };

    //增加行
    var maxrowid = 0;

    function get_lastrowid() {
        var table = document.getElementById('table_details');
        var tbody = table.tBodies[table.tBodies.length - 1];
        var tdlength = table.rows.length;
        var rowid = table.rows[tdlength - 1].cells[0].getAttribute("rowid");
        return rowid;
    }

    function addrow(flag) {
        var str_tr_s = []
        var str_tr = "";
          //*******  flag=0   -- addrow(0) begin
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
        //----addrow(0) end
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


    $(document).ready(function (e) {
        stockinQuery.init();


    });
});

//初始化明细数据  打开单据 绑定明细表的内容
//function Init_Detail_Data() {
//    var objs = GS_BILLS;

//    var table = document.getElementById('table_details');
//    var tbody = table.tBodies[table.tBodies.length - 1];
//    var tr = document.createElement("tr");

//    var tdlength = table.rows[0].cells.length;

//    addrow(objs.length);
//    table = document.getElementById('table_details');

//    var m = 0
//    for (var i = 1; i <= objs.length; i++) {
//        var rowid = table.rows[i].cells[0].getAttribute("rowid");
//        attach_detail_event(rowid);
//        table.rows[i].cells[0].innerHTML = i.toString();
//        for (key in objs[m]) {
//            if (objs[m][key] == null || (objs[m][key] == "" && objs[m][key] != "0")) continue;
//            if (key.substr(key.length - 4) == "DATE") {
//                $("#" + key + "_" + rowid.toString()).val(ndateFormatter(objs[m][key], "yyyy-MM-dd"));
//            }
//            else {
//                $("#" + key + "_" + rowid.toString()).val(objs[m][key]);
//            }
//            if (key == "INVOICE_NO") {
//                $("#" + key + "_" + rowid.toString()).attr("title", objs[m]["INVOICE_NO_AMOUNT"]);
//            }

//            if (key == "SPEC_NAME" || key == "PRODUCE_NAME" || key == "PLACE_NAME" || key == "BRAND_NAME" || key == "PRODUCT_NAME" || key == "OUT_DEPT_NAME") {

//                var obj = document.getElementById(key + "_" + rowid.toString());
//                if (obj != null) {
//                    obj.CURNAME = objs[m][key];
//                }
//            }
//        }
//        m++;
//    }

//}