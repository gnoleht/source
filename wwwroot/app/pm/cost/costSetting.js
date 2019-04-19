//import { debug } from "util";

var costSetting = {
    view: {
        module: 'pm',
        formName: 'cost',
        gridName: 'grvCost',
        entityName: 'PM_Cost',
    },
};
function costInitSetting() {
    costSetting.grid = {
        url: 'api/pm/Cost/Get',
        defaultUrl: 'api/pm/Cost/Get',

        options: {
            rowHeight: 50,
            topPanelHeight: 35,

            showHeaderRow: true,
            headerRowHeight: 0,

            allowOrder: false,
            allowFilter: true,
            allowCustom: true,

            autoHeight: false,
            fullWidthRows: true,
            multiColumnSort: true,

            enableColumnReorder: true,
            enableCellNavigation: true,
            explicitInitialization: true,

            createFooterRow: true,
            showFooterRow: true,
            footerRowHeight: 50
        },

        columns: [
            {
                id: 'name', name: costTranslation.NAME_GRID, field: "name", sortable: true, dataType: "text", width: 300, minWidth: 100, cssClass: 'd-flex align-items-center',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value == null || value == undefined)
                        return value;
                    else {
                        if (dataContext.type == 1) {
                            var productCode = dataContext.productCode != null ? dataContext.productCode.code : (costSetting ? costSetting.options.pid : null);
                            var projectCode = dataContext.projectCode != null ? dataContext.projectCode.code : "";
                            var link = "<a class='link' href='/pm/pjCostDetail?pjid=" + projectCode + "&time=" + dataContext.time;
                            if (dataContext.areaCode != null)
                                link = link + "&area=" + dataContext.areaCode.code;
                            link = link + "'>" + value + "</a>";
                            return link;
                        }
                        return value;
                    }
                }
            },
            {
                id: 'category', name: costTranslation.CATEGORY, field: "category", sortable: true, dataType: "text", width: 150, minWidth: 100, cssClass: 'd-flex align-items-center',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (!value || !costSetting || !costSetting.valuelist || !costSetting.valuelist.category)
                        return value;
                    else {
                        var checkCategoryFilter = costSetting.valuelist.category.filter(function (item) { return item.id === value; });
                        var categoryTemp = "";
                        if (checkCategoryFilter.length > 0)
                            categoryTemp = checkCategoryFilter[0].text;
                        else
                            categoryTemp = value;

                        if (dataContext.type == 1) {
                            var productCode = dataContext.productCode != null ? dataContext.productCode.code : (costSetting ? costSetting.options.pid : null);
                            var projectCode = dataContext.projectCode != null ? dataContext.projectCode.code : "";
                            //return "<a class='link' href='/pm/pjCostDetail?pjid=" + projectCode + "&time=" + dataContext.time + "'>" + categoryTemp + "</a>";
                            var link = "<a class='link' href='/pm/pjCostDetail?pjid=" + projectCode + "&time=" + dataContext.time;
                            if (dataContext.areaCode != null)
                                link = link + "&area=" + dataContext.areaCode.code;
                            link = link + "'>" + value + "</a>";
                            return link;
                        }
                        return categoryTemp;
                    }

                }
            },
            {
                id: 'sum', name: costTranslation.AMOUNT, field: "sum", sortable: true, dataType: "text", width: 200, minWidth: 150, hasTotalCol: true, cssClass: 'd-flex align-items-center',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value != null)
                        return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    else
                        return 0;
                }
            },
            {
                id: 'createdBy', name: costTranslation.CREATED_BY, field: "createdBy", sortable: true, dataType: "text", width: 200, minWidth: 100,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value == null || value == "admin" || costSetting.valuelist == null || costSetting.valuelist.user == null)
                        return "";
                    var createUser = costSetting.valuelist.user.filter(function (item) { return item.id === value; })[0];
                    if (createUser.length == 0)
                        return "";

                    var createDate = moment(dataContext.createdTime).format('DD/MM/YYYY')
                    var createBy = createUser.text;

                    var content = '<span style="width:100%;float:left;line-height:22px"><i class="bowtie-icon bowtie-user" style="width:14px;text-align:center;margin-right:5px"></i>';
                    content += createBy;
                    content += '</span><span style="width:100%;float:left;line-height:22px"><i class="bowtie-icon bowtie-status-waiting" style="margin-right:5px"></i>';
                    content += createDate + '</span>';
                    return content;
                }
            },
            {
                id: "state", name: costTranslation.STATUS, field: "state", width: 140, minWidth: 140, cssClass: 'd-flex align-items-center',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return '<i class=\"fa fa-circle status_' + value + '\"></i>&nbsp;' + capitalizeText(value);
                }
            },
            {
                id: 'modifiedBy', name: costTranslation.APPROVED_BY, field: "modifiedBy", sortable: true, dataType: "text", width: 200, minWidth: 100,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value == null || value == "admin" || costSetting.valuelist == null || costSetting.valuelist.user == null)
                        return "";

                    var createUser = costSetting.valuelist.user.filter(function (item) { return item.id === value; });
                    if (createUser.length == 0)
                        return "";

                    //var date = dataContext.modifiedTime.substring(0, 10).split('-');
                    //var createDate = date[2] + "-" + date[1] + "-" + date[0];
                    var createDate = moment(dataContext.modifiedTime).format('DD/MM/YYYY')
                    var createBy = createUser[0].text;

                    var content = '<span style="width:100%;float:left;line-height:22px"><i class="bowtie-icon bowtie-user" style="width:14px;text-align:center;margin-right:5px"></i>';
                    content += createBy;
                    content += '</span><span style="width:100%;float:left;line-height:22px"><i class="bowtie-icon bowtie-status-waiting" style="margin-right:5px"></i>';
                    content += createDate + '</span>';
                    return content;
                }
            },
            //{ id: 'productId', field: 'productId', name: "pid", width: 600, minWidth: 50, dataType: 'text' },
            //{ id: 'projectId', field: 'projectId', name: "pjid", width: 600, minWidth: 50, dataType: 'text' },
        ],

        updateFooter: function (grid) {
            var gridData = grid.getData().getItems();
            //var i = gridData.length;
            var total = 0;
            $.each(gridData, function (key, value) {
                total += (parseInt(value.sum) || 0);
            });
            var columnElement = grid.getFooterRowColumn("category");
            $(columnElement).html("<div class='text-right' style='font-weight: bold; '>" + costTranslation.TOTAL + ": </div>");
            columnElement = grid.getFooterRowColumn("sum");
            $(columnElement).html('<div style="font-weight: bold;">' + total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' VNĐ' + '</div>');
        },


    };

    costSetting.gridChild = {
        grvDetail: {
            url: '',
            defaultUrl: '',

            options: {
                rowHeight: 50,
                topPanelHeight: 35,

                showHeaderRow: true,
                headerRowHeight: 0,

                createFooterRow: true,
                showFooterRow: true,
                footerRowHeight: 30,

                autoHeight: false,
                fullWidthRows: true,
                multiColumnSort: true,

                enableColumnReorder: true,
                enableCellNavigation: true,
                explicitInitialization: true,
                filterable: false

            },

            columns: [
                { id: 'itemDescription', name: costTranslation.ITEM_DESCRIPTION, field: "itemDescription", sortable: true, dataType: "text", width: 400, minWidth: 50 },
                { id: 'invoiceNo', name: costTranslation.INVOICE_NO, field: "invoiceNo", sortable: true, dataType: "text", width: 150 },
                {
                    id: 'dated', name: costTranslation.CREATED_DATE, field: "dated", sortable: true, dataType: "text", width: 150, formatter: Slick.Formatters.Date
                    //formatter: function (row, cell, value, columnDef, dataContext) {

                    //    if (value == null)
                    //        return '';
                    //    var date = value.substring(0, 10).split('-');
                    //    var createDate = date[2] + "-" + date[1] + "-" + date[0];
                    //    return createDate;
                    //}
                },
                {
                    id: 'price', name: costTranslation.PRICE, field: "price", sortable: true, dataType: "number", width: 100,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return parseInt(value).toLocaleString();
                    }
                },
                { id: 'qty', name: costTranslation.QTY, field: "qty", sortable: true, dataType: "text", width: 100 },
                {
                    id: 'amount', name: costTranslation.AMOUNT, field: "amount", sortable: true, dataType: "number", width: 300, minWidth: 100, hasTotalCol: true,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return parseFloat(dataContext.price * dataContext.qty).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    }
                },
            ],

            updateFooter: function (grid) {
                var gridData = grid.getData().getItems();
                //var i = gridData.length;
                var total = 0;
                $.each(gridData, function (key, value) {
                    if (value.state != 'removed')
                        total += (parseInt(value.price * value.qty) || 0);
                });
                var columnElement = grid.getFooterRowColumn("qty");
                $(columnElement).html("<div class='text-right' style='font-weight: bold; '>" + costTranslation.TOTAL + ": </div>");
                columnElement = grid.getFooterRowColumn("amount");
                $(columnElement).html('<div style="font-weight: bold;">' + total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' VNĐ' + '</div>');

            },
        }
    };

    costSetting.valuelist = {
        test: [
            {
                "id": "demo1",
                "text": "DEMO 1"
            },
            {
                "id": "demo2",
                "text": "DEMO 2"
            }
        ],
        category: [
            {
                "id": "business",
                "text": "Công tác"
            },
            {
                "id": "staff",
                "text": "Chi phí nhân sự"
            },
            {
                "id": "contract",
                "text": "Hợp đồng"
            }
        ],
        state: [
            {
                "id": "new",
                "text": "New",
                "class": "status_new",
                "icon": "fa fa-circle"
            },
            {
                "id": "active",
                "text": "Active",
                "class": "status_active",
                "icon": "fa fa-circle"
            },
            {
                "id": "resolved",
                "text": "Resolved",
                "class": "status_resolved",
                "icon": "fa fa-circle"
            },
            {
                "id": "closed",
                "text": "Closed",
                "class": "status_closed",
                "icon": "fa fa-circle"
            },
            {
                "id": "approved",
                "text": "Approved",
                "class": "state_approved"
            },
            {
                "id": "removed",
                "text": "Removed",
                "class": "status_removed",
                "icon": "fa fa-circle"
            }
        ],
        paymentMethod: [
            {
                "id": "transfer",
                "text": costTranslation.TRANSFER
            },
            {
                "id": "cash",
                "text": costTranslation.CASH
            },
        ],
        user: getDataAsync('api/sys/user/getlist')
    };

    costSetting.options = {
        loadButton: true
    };
    costSetting.required = [
        "name", "beneficiaryName", "state", "reason"
    ];
    costSetting.readonly = [
        "createdBy", "project", "departmentDebit"
    ];
    costSetting.validate = {
        name: { required: true },
        beneficiaryName: { required: true },
        //address: { required: true },
        state: { required: true },
        reason: { required: true },
    }

}
//check