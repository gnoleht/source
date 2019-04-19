var reportCustomerSetting = {
    view: {
        module: 'pos',
        subModule: 'reportCustomer',
        formName: 'reportCustomer',
        gridName: 'grvReportCustomer',
    }
};
function reportCustomerInitSetting() {
    reportCustomerSetting.grid = {
        url: 'api/pos/reportCustomer/get',

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
                id: "row", field: "row", name: reportCustomerTranslation.NO, width: 40, minWidth: 40, sortable: false, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return dataContext.number;
                }
            },
            {
                id: 'statisticTime', field: 'customerRelated', name: 'Khách hàng', dataType: 'text', minWidth: 200, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var a = reportCustomerSetting.temp;
                    if (a == "2") {
                        return dataContext.custType;
                    }
                    if (a == "3") {
                        return dataContext.custGroup;
                       
                    }
                    return dataContext.custName;

                }
               
            },
            {
                id: 'bPaidAmount', field: 'bPaidAmount', name: reportCustomerTranslation.BPAIDAMOUNT, dataType: 'number', minWidth: 300, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    //if (dataContext.posCode == 'root')
                    //    return '<p style="font-weight: bold">' + dataContext.bPaidAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</p>';
                    //else
                    return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                }
            },
            {
                id: 'vatAmount', field: 'vatAmount', name: reportCustomerTranslation.VATAMOUNT, dataType: 'number', minWidth: 200, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    //if (dataContext.posCode == 'root')
                    //    return '<p style="font-weight: bold">' + parseFloat(dataContext.vatAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</p>';
                    //else
                    return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                }
            },
            {
                id: 'paidAmount', field: 'paidAmount', name: reportCustomerTranslation.PAIDAMOUNT, dataType: 'number', minWidth: 300, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    //if (dataContext.posCode == 'root')
                    //    return '<p style="font-weight: bold">' + dataContext.paidAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</p>';
                    //else
                    return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                }
            }
        ],
        hiddenColumns: [
            { id: "cashierId", name: "Thu ngân", field: "cashierId", sortable: true, dataType: 'text', width: 200 },
            { id: "createdTime", name: "Thời gian", field: "createdTime", sortable: true, dataType: 'text', width: 200 },   
            { id: "storeName", name: "Cửa hàng", field: "storeName", sortable: true, dataType: 'text', width: 200 },
        ],
        updateFooter: function (grid) {
            var gridData = grid.getData().getItems();
           
           
            var totalbPaidAmount = 0;
            var totalvatAmount = 0;
            var totalpaidAmount = 0;
            $.each(gridData, function (key, value) {
                totalbPaidAmount += (parseInt(value.bPaidAmount) || 0);
                totalvatAmount += (parseInt(value.vatAmount) || 0);
                totalpaidAmount += (parseInt(value.paidAmount) || 0);
            });
            var columnElement = grid.getFooterRowColumn("statisticTime");
            $(columnElement).html("<div class='text-right' style='font-weight: bold; float: right'>" + reportCustomerTranslation.TOTAL + ": </div>");

            columnElement = grid.getFooterRowColumn("bPaidAmount");
            $(columnElement).html('<div style="font-weight: bold; float: right">' + totalbPaidAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</div>');

            columnElement = grid.getFooterRowColumn("vatAmount");
            $(columnElement).html('<div style="font-weight: bold; float: right">' + totalvatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</div>');

            columnElement = grid.getFooterRowColumn("paidAmount");
            $(columnElement).html('<div style="font-weight: bold; float: right">' + totalpaidAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</div>');

        },
        
    };
    reportCustomerSetting.valuelist = {};
    reportCustomerSetting.listFilter = {};
}