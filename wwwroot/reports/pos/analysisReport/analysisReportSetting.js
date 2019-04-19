var analysisReportSetting = {
    view: {
        module: 'pos',
        subModule: 'analysisReport',
        formName: 'analysisReport',
        gridName: 'grvAnalysisReport',
    }
};
function analysisReportInitSetting() {
    analysisReportSetting.grid = {
                url: 'api/pos/analysisReport/get',

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
            
            createFooterRow: true,
            showFooterRow: true,
            footerRowHeight: 50
        },
        columns: [
            {
                id: "no", field: "no", name: 'STT', width: 60, minWidth: 60, sortable: false, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.Code == 'root')
                        return '<p style="font-weight: bold">' + dataContext.no + '</p>';
                    else
                    return value;
                }
            },
            {
                id: 'reportPeriod', field: 'reportPeriod', name: 'Kỳ báo cáo', dataType: 'number', minWidth: 300, sortable: true
            },
            {
                id: 'lastStatisticTime', field: 'lastStatisticTime', name: 'Last Statistic Time', dataType: 'number', minWidth: 300, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    //if (dataContext.posCode == 'root')
                    //    return '<p style="font-weight: bold">' + dataContext.bPaidAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</p>';
                    //else
                    return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                }
            },
            {
                id: 'previousStatisticTime', field: 'previousStatisticTime', name: 'Previous Statistic Time', dataType: 'number', minWidth: 300, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    //if (dataContext.posCode == 'root')
                    //    return '<p style="font-weight: bold">' + dataContext.bPaidAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</p>';
                    //else
                    return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                }
            },
            {
                id: 'statisticTime', field: 'statisticTime', name: 'Statistic Time', dataType: 'number', minWidth: 300, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    //if (dataContext.posCode == 'root')
                    //    return '<p style="font-weight: bold">' + dataContext.bPaidAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</p>';
                    //else
                    return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                }
            },
        ],
        hiddenColumns: [
            { id: "store", name: "Cửa hàng", field: "store", sortable: true, dataType: 'text', width: 200 },
           
        ],
       
        
    };
    analysisReportSetting.valuelist = {};
    analysisReportSetting.listFilter = {};
}