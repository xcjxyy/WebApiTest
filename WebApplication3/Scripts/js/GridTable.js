
define(
    function (require, exports, module) {
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
                //console.log(self.$mainDialog);
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
                            tableOperation.addRow();
                        }
                    }]
                }
                    );
                for (i = 0; i < 3; i++) { tableOperation.addRow(); }

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
                status: this.$statusSelect.combobox('getValue')
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
            var requestData = { userid: 43 };//this.getRequestParams();

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
                //url:uri,
                columns: [tableColumns],
                singleSelect: true,
                method: 'GET',
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
        },
    };

    var G_COLUMNS = [];
    var table = $('#table_details')[0]; //document.getElementById('table_details'); //// jquery对象与dom对象
    var tdLen = table.rows[0].cells.length;

    for (var i = 0; i < tdLen; i++) {
        var columns = eval(table.rows[0].cells[i].getAttribute("columns"));//**** eval()将['A','B'] 字符串转成 A，B数组
        G_COLUMNS.push({ LEN: columns.length, COLS: columns });      //********G_COLUMNS  数组类型  在scm.js中声明   SCM_ADD_EVENT
    };

    function get_lastrowid1() {
        var rowsLen = table.rows.length;
        var rowid = table.rows[rowsLen - 1].cells[0].getAttribute("rowid");
        //console.log('---', rowsLen, rowid)
        return rowsLen;
    };

    function get_lastrowid() {
        var table = document.getElementById('table_details');
        var tbody = table.tBodies[table.tBodies.length - 1];
        var tdlength = table.rows.length;

        var rowid = table.rows[tdlength - 1].cells[0].getAttribute("rowid");
        return rowid;
    }

    var tableOperation = {
        addRow: function () {
            var _tr = "";
            var insertTable = function (tb, str) {
                var o = document.createElement("div")
                var ol;
                o.innerHTML = "<table>" + str + "</table>"
                ol = o.childNodes[0].tBodies[0].rows
                return tb.tBodies[tb.tBodies.length - 1].insertAdjacentElement("beforeEnd", ol[0])
            };
            //*******  flag=0   -- addrow(0) begin
            //var lastrowid = get_lastrowid();                
            var curRowIndex1 = get_lastrowid();//table.rows.length;
            var curRowIndex = table.rows.length;
            console.log(curRowIndex, curRowIndex1)
            console.log($("#PRODUCT_NAME_" + curRowIndex),$("#PRODUCT_NAME_" + curRowIndex).val())
            if (($("#PRODUCT_NAME_" + (curRowIndex)).val() == "" || $("#PRODUCT_NAME_" + (curRowIndex)).val() == undefined)) {//*** if 为空不让增加空行
                $("#PRODUCT_NAME_" + curRowIndex).focus();
                return;
            }
            for (var i = 0; i < tdLen; i++) {     //表格cell数
                var _td = "";
                var columns = G_COLUMNS[i].COLS;                            //***** G_COLUMNS[i]
                var text_align = table.rows[0].cells[i].getAttribute("text_align");
                var newrow = table.rows[0].cells[i].getAttribute("newrow");
                var isdecimal = table.rows[0].cells[i].getAttribute("decimal");
                for (var m = 0; m < columns.length; m++) {
                    if (m == columns.length - 1) {    // 最后的字段名可见
                        _td += "<input id='" + columns[m] + "_" + curRowIndex + "  type='text' style='text-align:" + text_align + "'  class='grid_input'>"
                    }
                    else {
                        _td += "<input id='" + columns[m] + "_" + curRowIndex + "' type='hidden' >"//非最后字段名隐藏
                    }
                }
                if (i == 0) {               //****第一列 序号列 rowid
                    _tr += "<td align='left' rowid='" + curRowIndex + "' style='background-color:#edeef0; color:#000080;font-size:14px;font-weight:bold;'>" + _td + "</td>";
                }
                else {
                    _tr += "<td>" + _td + "</td>";
                }
            }
            var tr = insertTable(table, "<tr>" + _tr + "</tr>");
            //set_row_status("edit_status", maxRowid.toString());//***** scm.js
            tr.scrollIntoView();//*****处理滑动条自动在底good
            //attach_detail_event(maxRowid.toString());              //******绑定
            $(tr).click(function () {
                clickrow();
            })
            $("#PRODUCT_NAME_" + curRowIndex).focus();
            //setRownum(tr);  
            //if (tr.rowIndex == 0) { return; }
            tr.cells[0].innerText = curRowIndex;    //设置序号值
            selectRow(tr);                                         //序号列颜色字体
            // maxRowid++;
            // return maxRowid;
        }
    }

    var curRowIndex = -1;
    function selectRow(obj) {
        //console.log(obj.rowIndex)
        if (curRowIndex == obj.rowIndex) return;
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

    function clickrow() {
        var obj = event.srcElement;
        while (obj.tagName != "TR") {
            obj = obj.parentNode;
            if (obj == null)
                break;
        }
        if (obj) {
            selectRow(obj)
        }
    }
    function attach_detail_event(rowid) {               //**********表格里数量X单价、字段参照
        $("#PRODUCT_NAME_" + rowid).keydown(function () {
            if (!$(this).val() == '') { openMaterialsDicDialog(rowid); } else
            {
                return//alert('opp');
            };
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
                if (row.nextSibling != null) {
                    var tempid = objid + "_" + row.nextSibling.cells[0].getAttribute("rowid");
                    var obj = document.getElementById(tempid);
                    if (obj != null) {
                        obj.focus();
                        obj.select()
                        return;
                    };
                }
            }
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