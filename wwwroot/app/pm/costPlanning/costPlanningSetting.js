//check
var costPlanningSetting = {
    view: {
        module: 'pm',
        formName: 'costPlanning',
        gridName: 'grvCostPlanning',

    }
};
function costPlanningInitSetting() {
    costPlanningSetting.grid = {
        url: 'api/pm/planDetail/getCostPlanning',
        defaultUrl: '',
        options: {
            rowHeight: 40,
            topPanelHeight: 35,

            showHeaderRow: true,
            headerRowHeight: 0,

            allowOrder: true,
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
                id: 'id', field: 'id', sortable: false, name: "", width: 30, minWidth: 30, maxWidth: 30, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return '';
                }
            },
            {
                id: "description", field: "description", name: costPlanningTranslation.DESCRIPTION, dataType: 'text', width: 100, minWidth: 200, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value != null)
                        if (dataContext.category == "nhansu")
                            return '<div class="link">' + value + '</div>'
                        else
                            return value;
                    else
                        return 0;
                }
            },
            {
                id: "paymentDate", field: "paymentDate", name: costPlanningTranslation.PAYMENTDATE, dataType: 'datetime', width: 200, minWidth: 200, sortable: false, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.category == "nhansu")
                        return "<div class='link'>" + costPlanningTranslation.MONTHLY + "</div>"
                    if (value != null)
                        return moment(value).format("l");
                    return "";
                }
            },
            {
                id: 'category', field: 'category', name: costPlanningTranslation.CATEGORY, width: 200, dataType: 'select', listName: 'categoryFull', dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value != null) {
                        if (costPlanningSetting && costPlanningSetting.valuelist && costPlanningSetting.valuelist.categoryFull) {
                            if (dataContext.category == "nhansu") {
                                var thisText = costPlanningSetting.valuelist.categoryFull.filter(function (item) { return item.id === value; })[0];
                                if ((typeof (thisText) !== "undefined")) {
                                    return "<div class='link'>" + thisText.text + "</div>"
                                }
                                else { return "!exist category" };
                            }
                            else {
                                var thisText = costPlanningSetting.valuelist.categoryFull.filter(function (item) { return item.id === value; })[0];
                                if ((typeof (thisText) !== "undefined")) {
                                    return thisText.text
                                }
                                else { return "!exist category" };
                            }
                        }
                        else
                            return value;
                    }
                    else
                        return 0;
                }
            },
            {
                id: 'qty', field: 'qty', name: costPlanningTranslation.QTY, dataType: 'number', sortable: true, width: 200, minWidth: 50, hasBorder: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value != null && costPlanningSetting && costPlanningSetting.valuelist && costPlanningSetting.valuelist.unit) {
                        var thisText = costPlanningSetting.valuelist.unit.filter(function (item) { return item.id === dataContext.unit; })[0];
                        if ((typeof (thisText) !== "undefined")) {
                            return accounting.formatNumber(value) + " " + thisText.text;
                        }
                        else { return value };
                    }
                    else
                        return 0;
                }
            },
            {
                id: 'price', field: 'price', name: costPlanningTranslation.PRICE, dataType: 'number', sortable: true, width: 200, minWidth: 50, hasTotalText: true, hasBorder: true,
                formatter: Slick.Formatters.Money
            },

            { id: 'currency', field: 'currency', name: costPlanningTranslation.CURRENCY, dataType: 'text', width: 200 },
            {
                id: 'total', field: 'total', name: costPlanningTranslation.TOTAL, dataType: 'text', sortable: true, width: 200, minWidth: 50, hasTotalText: true, hasTotalCol: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value != null)
                        return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    else
                        return 0;
                }
            },
            {
                id: 'percentOfTotal', field: 'percentOfTotal', dataType: 'text', name: costPlanningTranslation.PERCENTOFTOTAL, width: 200, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value != null) {
                        if (costPlanningSetting.sum == 0)
                            return 0;
                        var tempCalc = dataContext.total / costPlanningSetting.sum * 100;
                        var tempCalcPer = parseFloat(tempCalc).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " %";
                        return tempCalcPer;
                    }
                    else
                        return 0;
                }
            },


        ],
        updateFooter: function (grid) {
            if (!grid.dataView) return;

            var total = 0;
            var length = grid.dataView.getLength();
            while (length--) {
                var data = grid.dataView.getItem(length);
                total += (parseInt(data.total) || 0);
            }

            var columnElement = grid.getFooterRowColumn("currency");
            $(columnElement).html("<div class='text-right' style='font-weight: bold;'>" + costPlanningTranslation.CALCTOTAL + ": </div>");
            columnElement = grid.getFooterRowColumn("total");
            $(columnElement).html(total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' VNĐ');
        },
    };



    costPlanningSetting.valuelist = {

        category: [
            //{ "id": "nhansu", "text": "Nhân sự" },
            { "id": "phancung", "text": "Phần cứng" },
            { "id": "phanmem", "text": "Phần mềm" },
            { "id": "tiepkhach", "text": "Tiếp khách" },
            { "id": "daotao", "text": "Đào tạo" },
            { "id": "thietbi", "text": "Thiết bị" }
        ],
        categoryFull: [
            { "id": "nhansu", "text": "Nhân sự" },
            { "id": "phancung", "text": "Phần cứng" },
            { "id": "phanmem", "text": "Phần mềm" },
            { "id": "tiepkhach", "text": "Tiếp khách" },
            { "id": "daotao", "text": "Đào tạo" },
            { "id": "thietbi", "text": "Thiết bị" }
        ],
        unit: [
            { "id": "cai", "text": "Cái" },
            { "id": "nguoi", "text": "Người" },
            { "id": "thung", "text": "Thùng" },
            { "id": "thang", "text": "Tháng" }
        ],
        currency: [
            { "id": "VNĐ", "text": "VNĐ" },
            { "id": "USD", "text": "USD" }
        ],

    };

    costPlanningSetting.options = {
        uploadSetting: [
            {
                acceptedFiles: 'image/*',
                maxFiles: 2,
                elementId: 'imgAvatar',
            }],
    };
    costPlanningSetting.required = [
        "description", "paymentDate", "category", "qty", "price"
    ];
    costPlanningSetting.readonly = [
        "currency"
    ];

    costPlanningSetting.validate = {
        description: { required: true },
        paymentDate: { required: true },
        category: { required: true },
        qty: { required: true },
        price: { required: true },
    }
}
