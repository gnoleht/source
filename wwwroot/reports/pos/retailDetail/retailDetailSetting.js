var retailDetailSetting = {
    view: {
        module: 'pos',
        subModule: 'retailDetail',
        formName: 'retailDetail',
        gridName: 'grvRetailDetail',
    }
};
function retailDetailInitSetting() {
    retailDetailSetting.grid = {
        url: 'api/pos/retailDetail/get',

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
            footerRowHeight: 30
        },
        columns: [
            {
                id: "row", field: "status", name: retailDetailTranslation.NO, width: 40, minWidth: 40, sortable: false, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    //debugger
                    return dataContext.number;
                }
            },
            {
                id: 'code', field: 'code', name: retailDetailTranslation.CODE, dataType: 'text', minWidth: 200, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    //if (dataContext.posCode == 'root')
                    //    return '<p style="font-weight: bold">' + dataContext.code + '</p>';
                    //else
                        return value;
                }
               
            },
            {
                id: 'createdTime', field: 'createdTime', name: retailDetailTranslation.DOCDATE, width: 200, sortable: true, dataType: 'datetime',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    //if (dataContext.posCode == 'root')
                    //    return '';
                    //else
                        return moment(value).format("DD/MM/YYYY");;
                }
            },
            {
                id: 'cashierId', field: 'cashierId', name: retailDetailTranslation.CASHIER, dataType: 'text', minWidth: 200, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    //if (dataContext.posCode == 'root')
                    //    return '<p style="font-weight: bold">' + dataContext.cashierId + '</p>';
                    //else
                        return value;
                }
            },
            //{ id: 'custName', field: 'custName', name: retailDetailTranslation.CUSTOMER, dataType: 'text', minWidth: 200, sortable: true },
            {
                id: 'customerRelated', field: 'customerRelated', name: retailDetailTranslation.CUSTOMER, dataType: 'text', minWidth: 200, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value != null) {
                        return value.name;
                    }
                    return "";
                }
            },
            {
                id: 'bPaidAmount', field: 'bPaidAmount', name: retailDetailTranslation.BPAIDAMOUNT, dataType: 'number', minWidth: 300, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    //if (dataContext.posCode == 'root')
                    //    return '<p style="font-weight: bold">' + dataContext.bPaidAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</p>';
                    //else
                    return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                }
            },
            {
                id: 'vatAmount', field: 'vatAmount', name: retailDetailTranslation.VATAMOUNT, dataType: 'number', minWidth: 200, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    //if (dataContext.posCode == 'root')
                    //    return '<p style="font-weight: bold">' + parseFloat(dataContext.vatAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</p>';
                    //else
                    return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                }
            },
            {
                id: 'paidAmount', field: 'paidAmount', name: retailDetailTranslation.PAIDAMOUNT, dataType: 'number', minWidth: 300, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    //if (dataContext.posCode == 'root')
                    //    return '<p style="font-weight: bold">' + dataContext.paidAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</p>';
                    //else
                    return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                }
            },
            //{
            //    id: "storeRelated", name: "Cửa hàng", field: "storeRelated", sortable: true, dataType: 'text', width: 200,
            //    formatter: function (row, cell, value, columnDef, dataContext) {
            //        debugger
            //        if (value != null) {
            //            return value.name;
            //        }
            //        return "";
            //    }
            //},
            //{
            //    id: 'customerRelated', field: 'customerRelated', name: retailDetailTranslation.CUSTOMER, dataType: 'text', minWidth: 200, sortable: true,
            //    formatter: function (row, cell, value, columnDef, dataContext) {
            //        if (value != null) {
            //            return value.groupName;
            //        }
            //        return "";
            //    }
            //},
        ],
        hiddenColumns: [
            //{ id: "custId", name: "Khách hàng", field: "custId", sortable: true, dataType: 'text', width: 200 },
        //nhóm khách hàng
            {
                id: 'customerRelated', field: 'customerRelated', name: retailDetailTranslation.CUSTOMER, dataType: 'text', minWidth: 200, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value != null) {
                        return value.custGroupRelated.groupName;
                    }
                    return "";
                }
            },
            {
                id: 'customerRelated', field: 'customerRelated', name: retailDetailTranslation.CUSTOMER, dataType: 'text', minWidth: 200, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value != null) {
                        return value.typeName;
                    }
                    return "";
                }
            },
            {
                id: "storeRelated", name: "Cửa hàng", field: "storeRelated", sortable: true, dataType: 'text', width: 200,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value != null) {

                        return value.name;
                    }
                    return "";
                }
            },
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
            var columnElement = grid.getFooterRowColumn("custName");
            $(columnElement).html("<div class='text-right' style='font-weight: bold; float: right'>" + retailDetailTranslation.TOTAL + ": </div>");

            columnElement = grid.getFooterRowColumn("bPaidAmount");
            $(columnElement).html('<div style="font-weight: bold; float: right">' + totalbPaidAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</div>');

            columnElement = grid.getFooterRowColumn("vatAmount");
            $(columnElement).html('<div style="font-weight: bold; float: right">' + totalvatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</div>');

            columnElement = grid.getFooterRowColumn("paidAmount");
            $(columnElement).html('<div style="font-weight: bold; float: right">' + totalpaidAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</div>');

        },
        
    };
    retailDetailSetting.valuelist = {};
    retailDetailSetting.listFilter = {};
}