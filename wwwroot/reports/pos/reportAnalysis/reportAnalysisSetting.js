var reportAnalysisSetting = {
    view: {
        module: 'pos',
        subModule: 'reportAnalysis',
        formName: 'reportAnalysis',
        gridName: 'grvreportAnalysis',
    }
};
function reportAnalysisInitSetting() {
    reportAnalysisSetting.valuelist = {};
    reportAnalysisSetting.listFilter = {};

    reportAnalysisSetting.grid = {
        url: 'api/pos/reportAnalysis/get',
        options: {
            rowHeight: 40,
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

            //createFooterRow: true,
            //showFooterRow: true,
            //footerRowHeight: 50
        },
        columns: [
            //{
            //    id: "NO", field: "NO", name: "STT", width: 40, minWidth: 40, sortable: false, dataType: 'text', filterable: false,
            //    //formatter: function (row, cell, value, columnDef, dataContext) {
            //    //    return row + 1;
            //    //}
            //    formatter: function (row, cell, value, columnDef, dataContext) {
            //        if (dataContext.code == 'root')
            //            return '<p style="font-weight: bold">' + dataContext.no + '</p>';
            //        else
            //            return value;
            //    }
            //},
            //{
            //    id: "id", field: "id", name: "STT", width: 40, minWidth: 40, sortable: false, dataType: 'text', filterable: false,
            //    formatter: function (row, cell, value, columnDef, dataContext) {
            //        return dataContext.number;
            //    }
            //},
            {
                id: "no", field: "no", name: "STT", width: 50, minWidth: 40, sortable: false, dataType: 'text', filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.code == 'root')
                        //return '<p>' + dataContext.no + '</p>';
                        return dataContext.no;
                    else
                        return value;
                }
            },
            {
                id: "reportPeriod", field: "reportPeriod", name: "Kỳ báo cáo", width: 300, minWidth: 40, sortable: false, dataType: 'text', filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    debugger
                    if (dataContext.code == 'root')
                        return dataContext.reportPeriod;
                    else
                    return value;
                }
            },
            {
                id: "LastStatisticTime", field: "LastStatisticTime", name: "Tháng trước nữa", width: 200, minWidth: 40, sortable: false, dataType: 'text', filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    debugger
                    if (dataContext.code == 'root')
                        return parseFloat(dataContext.lastStatisticTime).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                    else
                        return value;
                }
            },
            {
                id: "prerivousStatisticTime", field: "prerivousStatisticTime", name: "Tháng trước", width: 200, minWidth: 40, sortable: false, dataType: 'text', filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    debugger
                    if (dataContext.code == 'root')
                        return parseFloat(dataContext.prerivousStatisticTime).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                    else
                        return value;
                }
            },
            {
                id: "statisticTime", field: "statisticTime", name: "Tháng hiện tại", width: 200, minWidth: 40, sortable: false, dataType: 'text', filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.code == 'root')
                        return parseFloat(dataContext.statisticTime).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                    else
                        return value;
                }
            },
            {
                id: "sum", field: "sum", name: "Tổng cộng", width: 200, minWidth: 40, sortable: false, dataType: 'text', filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.code == 'root')
                        return parseFloat(dataContext.sum).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                    else
                        return value;
                }
            },
            //{ id: "cashier", name: "Khuyến mãi", field: "cashier", sortable: true, dataType: 'text', width: 200 },
        ],
         hiddenColumns: [
            { id: "cashier", name: "Thu ngân", field: "cashier", sortable: true, dataType: 'text', width: 200 },
            { id: "cust", name: "Khách hàng", field: "cust", sortable: true, dataType: 'text', width: 200 },
            { id: "store", name: "Cửa hàng", field: "store", sortable: true, dataType: 'text', width: 200 },
        ],
    };
}
