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

    var stockinQuery = {
        init: function () {
            this.cacheDom();
           this.initToolbar();
          //  this.bindEvents();
           this.initDatagrid('#mainGrid');
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

            $(this.tools['edit']).bind('click', function () {
                editrow(2)
            }
                
                )
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

        /**
		 * 初始化表格
		 */
        initDatagrid: function (selector) {
            var self = this;
            var tableColumns = [];
            tableColumns.push({
                field: 'UserName',
                title: '入库单号',
                width: 160,
                editor: 'text'
                //formatter: CommonWidget.columnFormatTitle
            });
            tableColumns.push({
                field: 'sex',
                title: '核算科目',
                width: 110,
                editor: 'text'
            });
            tableColumns.push({
                field: 'Age',
                title: '入库人员',
                width: 90,
                editor: 'text'
            });
            tableColumns.push({
                field: 'inTime',
                title: '入库日期',
                width: 120,
                formatter: CommonWidget.columnFormatDate
            });
            tableColumns.push(
            {
                field: 'action', title: 'Action', width: 70, align: 'center',
                formatter: function (value, row, index) {
                    if (row.editing) {
                        var s = '<a href="#" onclick="saverow(this)">Save</a> ';
                        var c = '<a href="#" onclick="cancelrow(this)">Cancel</a>';
                        return s + c;
                    } else {
                        var e = '<a href="#" onclick="editrow(this)">Edit</a> ';
                        var d = '<a href="#" onclick="deleterow(this)">Delete</a>';
                        return e + d;
                    }
                }
            });

            //this.$tableId
            $(selector).datagrid({
                url: '../api/userinfo/GetUsers0',
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
                    self.editrow3(rowIndex);
                },
                onBeforeEdit: function (index, row) {
                    $(selector).datagrid('refreshRow', index);
                    //row.editing = true;
                  //  updateActions(index);
                },
                onAfterEdit: function (index, row) {
                    $(selector).datagrid('refreshRow', index);
                   // row.editing = false;
                 //   updateActions(index);
                },
                onCancelEdit: function (index, row) {
                    $(selector).datagrid('refreshRow', index);
                    //row.editing = false;
                //    updateActions(index);
                }
            });
                 
           // setTimeout($(selector).datagrid('beginEdit', 2), 5000);
            //self.editrow3(1);
        },

        editrow3:function(r) {
                this.$tableId.datagrid('beginEdit', r);
}
    };

    var addRow = function (selector) {
        var lastIndex = 0;
        /*
         * if (this.editCount > 0) { $.messager.alert('警告', '当前还有' +
         * this.editCount + '记录正在编辑，不能增加记录。'); return; }
         */
        // var addIndex = $('#InventoryList').datagrid('getRows').length
        // + 1;
        //console.log(this.selector)
        selector.datagrid('appendRow', {});

        lastIndex = selector.datagrid('getRows') && selector.datagrid('getRows').length - 1;
        //this.index = lastIndex;
        //this.editRow(this.index);
        //console.log('>>>增加行后，editcount值为：' + this.getEditCount());
    };

    $(document).ready(function (e) {
        stockinQuery.init();


    });
});