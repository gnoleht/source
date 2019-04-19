var reportByTimeSetting = {
    view: {
        module: 'pos',
        subModule: 'reportByTime',
        formName: 'reportByTime',
        gridName: 'grvReportByTime',
    }
};
function reportByTimeInitSetting() {
    reportByTimeSetting.grid = {
        url: 'api/pos/reportByTime/get',

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
                id: "row", field: "row", name: reportByTimeTranslation.NO, width: 40, minWidth: 40, sortable: false, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return dataContext.number;
                }
            },
            {
                id: 'statisticTime', field: 'createdTime', name: 'Statistic Time', dataType: 'text', minWidth: 200, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var a = reportByTimeSetting.temp;
                    if (a == "1") {
                        return moment(dataContext.createdTime).format("hh:mm");
                    }

                    if (a == "2") {
                        return moment(dataContext.createdTime).format("dddd");
                        //return value;
                    }
                    //if (a == "3") {
                    //    return moment(dataContext.createdTime).format("DD/MM/YYYY");
                    //}
                    if (a == "4") {
                        return moment(dataContext.createdTime).format("MM/YYYY");
                    }
                    if (a == "5") {
                        return "Quý: "+ moment(dataContext.createdTime).format("Q");
                    }
                    if (a == "6") {
                        return moment(dataContext.createdTime).format("YYYY");
                    }
                    return moment(dataContext.createdTime).format("DD/MM/YYYY");
                   
                }
               
            },
            //{
            //    id: 'createdTime', field: 'createdTime', name: retailDetailTranslation.DOCDATE, width: 200, sortable: true, dataType: 'datetime',
            //    formatter: function (row, cell, value, columnDef, dataContext) {
            //        //if (dataContext.posCode == 'root')
            //        //    return '';
            //        //else
            //            return moment(value).format("DD/MM/YYYY");;
            //    }
            //},
            //{
            //    id: 'cashierId', field: 'cashierId', name: retailDetailTranslation.CASHIER, dataType: 'text', minWidth: 200, sortable: true,
            //    formatter: function (row, cell, value, columnDef, dataContext) {
            //        //if (dataContext.posCode == 'root')
            //        //    return '<p style="font-weight: bold">' + dataContext.cashierId + '</p>';
            //        //else
            //            return value;
            //    }
            //},
            //{ id: 'custName', field: 'custName', name: retailDetailTranslation.CUSTOMER, dataType: 'text', minWidth: 200, sortable: true },
            {
                id: 'bPaidAmount', field: 'bPaidAmount', name: reportByTimeTranslation.BPAIDAMOUNT, dataType: 'number', minWidth: 300, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    //if (dataContext.posCode == 'root')
                    //    return '<p style="font-weight: bold">' + dataContext.bPaidAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</p>';
                    //else
                    return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                }
            },
            {
                id: 'vatAmount', field: 'vatAmount', name: reportByTimeTranslation.VATAMOUNT, dataType: 'number', minWidth: 200, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    //if (dataContext.posCode == 'root')
                    //    return '<p style="font-weight: bold">' + parseFloat(dataContext.vatAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</p>';
                    //else
                    return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                }
            },
            {
                id: 'paidAmount', field: 'paidAmount', name: reportByTimeTranslation.PAIDAMOUNT, dataType: 'number', minWidth: 300, sortable: true,
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
            { id: "custId", name: "Khách hàng", field: "custId", sortable: true, dataType: 'text', width: 200 },
            { id: "custGroup", name: "Nhóm khách hàng", field: "custGroup", sortable: true, dataType: 'text', width: 200 },
            { id: "custType", name: "Loại khách hàng", field: "custType", sortable: true, dataType: 'text', width: 200 },
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
            $(columnElement).html("<div class='text-right' style='font-weight: bold; float: right'>" + reportByTimeTranslation.TOTAL + ": </div>");

            columnElement = grid.getFooterRowColumn("bPaidAmount");
            $(columnElement).html('<div style="font-weight: bold; float: right">' + totalbPaidAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</div>');

            columnElement = grid.getFooterRowColumn("vatAmount");
            $(columnElement).html('<div style="font-weight: bold; float: right">' + totalvatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</div>');

            columnElement = grid.getFooterRowColumn("paidAmount");
            $(columnElement).html('<div style="font-weight: bold; float: right">' + totalpaidAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</div>');

        },
        
    };
    reportByTimeSetting.valuelist = {};
    reportByTimeSetting.listFilter = {};
}