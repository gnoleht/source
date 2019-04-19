﻿var reportCashierSetting = {
    view: {
        module: 'report',
        subModule: 'reportCashier',
        formName: 'reportCashier',
        gridName: 'grvreportCashier',
    }
};

function reportCashierInitSetting() {

    reportCashierSetting.valuelist = {};
    reportCashierSetting.listFilter = {};
    reportCashierSetting.grid = {
        url: 'api/pos/reporCashier/get',
        //url:'',
        options: {
            rowHeight: 40,
            topPanelHeight: 35,

            showHeaderRow: true,
            headerRowHeight: 0,

            //allowOrder: true,
            allowFilter: false,
            allowCustom: true,

            autoHeight: false,
            fullWidthRows: true,
            //multiColumnSort: true,

            enableColumnReorder: true,
            enableCellNavigation: true,
            explicitInitialization: true,

            createFooterRow: true,
            showFooterRow: true,
            footerRowHeight: 50,

        },

        columns: [
            {
                id: "id", field: "id", name: reportCashierTranslation.NO, width: 40, minWidth: 40, sortable: false, dataType: 'text', filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return dataContext.number;
                }
            },
            {
                id: "cashierName", field: "cashierName", name: reportCashierTranslation.CASHIERNAME, width: 150, defaultWidth: 100, sortable: true, dataType: 'text',

            },
            {
                id: "bPaidAmount", field: "bPaidAmount", name: reportCashierTranslation.BPAIDAMOUNT, width: 380, defaultWidth: 300, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value != null) {
                        return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

                    }

                    return "";
                }
            },

            {
                id: "vatAmount", field: "vatAmount", name: reportCashierTranslation.VATAMOUNT, width: 150, minWidth: 30, sortable: false, dataType: 'number', filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value != null) {
                        return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

                    }

                    return "";
                }
            },
            {
                id: "paidAmount", field: "paidAmount", name: reportCashierTranslation.PAIDAMOUNT, dataType: 'number', width: 200, minWidth: 30, sortable: false, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value != null) {
                        return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

                    }

                    return "";
                }
            },

        ],
        hiddenColumns: [
            { id: "createdTime", name: "Khuyến mãi", field: "createdTime", sortable: true, dataType: 'text', width: 200 },
            { id: "groupName", name: "Khuyến mãi", field: "groupName", sortable: true, dataType: 'text', width: 200 },
            { id: "typeName", name: "Khuyến mãi", field: "typeName", sortable: true, dataType: 'text', width: 200 },
            { id: "name", name: "Khuyến mãi", field: "name", sortable: true, dataType: 'text', width: 200 },
            { id: "cashierName", name: "Khuyến mãi", field: "cashierName", sortable: true, dataType: 'text', width: 200 },
            { id: "storeName", name: "Khuyến mãi", field: "storeName", sortable: true, dataType: 'text', width: 200 },
        ],
        updateFooter: function (grid) {
            var gridData = grid.getData().getItems();
            var vatAmount = 0;
            var paidAmount = 0;
            var bPaidAmount = 0;


            $.each(gridData, function (key, value) {
                vatAmount += (parseInt(value.vatAmount) || 0);
                paidAmount += (parseInt(value.paidAmount) || 0);
                bPaidAmount += (parseInt(value.bPaidAmount) || 0);
            });
            var columnElement = grid.getFooterRowColumn("cashierName");
            $(columnElement).html("<div class='text-right' style='font-weight: bold; float: right'>" + reportCashierTranslation.TOTAL + ": </div>");

            columnElement = grid.getFooterRowColumn("bPaidAmount");
            $(columnElement).html("<div class='text-right' style='font-weight: bold; float: right'>" + bPaidAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</div>");

            columnElement = grid.getFooterRowColumn("paidAmount");
            $(columnElement).html("<div class='text-right' style='font-weight: bold; float: right'>" + paidAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</div>");

            columnElement = grid.getFooterRowColumn("vatAmount");
            $(columnElement).html("<div class='text-right' style='font-weight: bold; float: right'>" + vatAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</div>");


        },
    };
}


