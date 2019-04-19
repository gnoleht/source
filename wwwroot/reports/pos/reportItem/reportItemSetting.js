var reportItemSetting = {
    view: {
        module: 'report',
        subModule: 'reportItem',
        formName: 'reportItem',
        gridName: 'grvreportItem',
    }
};

function reportItemInitSetting() {

    reportItemSetting.valuelist = {};
    reportItemSetting.listFilter = {};
    reportItemSetting.grid = {
        url: 'api/pos/reportItem/get',
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
                id: "id", field: "id", name: reportItemTranslation.NO, width: 40, minWidth: 40, sortable: false, dataType: 'text', filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return dataContext.number;
                    //return row + 1;
                }
            },
        
            {
                id: "sku", field: "sku", name: "Mã", width: 150, defaultWidth: 100, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var a = reportItemSetting.temp;
                    if (a == "1") {
                        return dataContext.fieldCode;
                    }
                    if (a == "2") {
                        return dataContext.groupCode;
                    }
                    
                    return dataContext.sku;
                    
                  
                }
            },
            {
                id: "relatedItem", field: "relatedItem", name: "Tên", width: 380, defaultWidth: 300, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    //debugger
                    var a = reportItemSetting.temp;
                    if (a == "1")
                    {
                        return dataContext.fieldName;
                    }
                    if (a == "2") {
                        return dataContext.groupName;
                    }
                    
                    return dataContext.itemName;
                  
                }

            },
            

            //{
            //    id: "fieldCode", field: "fieldCode", name: "aa", width: 380, defaultWidth: 300, sortable: true, dataType: 'text',
            //    formatter: function (row, cell, value, columnDef, dataContext) {
            //        if (value != null) {
            //            return value;
            //        }
            //        return "";
            //    }

            //},
            //{
            //    id: "fieldName", field: "fieldName", name: "aa", width: 380, defaultWidth: 300, sortable: true, dataType: 'text',
            //    formatter: function (row, cell, value, columnDef, dataContext) {
            //        if (value != null) {
            //            return value;
            //        }
            //        return "";
            //    }

            //},
            //{
            //    id: "item", name: "Thống kê", children: [

            //        {
            //            id: "sku", field: "sku", name: "aa", width: 150, defaultWidth: 100, sortable: true, dataType: 'text',
            //            formatter: function (row, cell, value, columnDef, dataContext) {
                            
            //                if (value != null) {
            //                    debugger
            //                    return value;
            //                }

            //                return "";
            //            }
            //        },
            //        {
            //            id: "itemName", field: "itemName", name: "aa", width: 380, defaultWidth: 300, sortable: true, dataType: 'text',
            //            formatter: function (row, cell, value, columnDef, dataContext) {
            //                if (value != null) {
            //                    return value;
            //                }
            //                return "";
            //            }

            //        },


            //    ]
            //},
            {
                id: "quantity", field: "quantity", name: reportItemTranslation.QUANTITY_SALE, width: 150, minWidth: 30, sortable: false, dataType: 'number', filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value != null) {
                        return parseFloat(dataContext.quantity).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                        //return value.paidAmount;
                    }

                    return "";
                }
            },
            {
                id: "baseSellAmt", field: "baseSellAmt", name: reportItemTranslation.BASE_SELL_AMT, dataType: 'number', width: 150, minWidth: 30, sortable: false, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value != null) {
                        return parseFloat(dataContext.baseSellAmt).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                        //return value.paidAmount;
                    }

                    return "";
                }
            },
            {
                id: "vatAmount", field: "vatAmount", name: reportItemTranslation.VAT_SALE, dataType: 'text', width: 150, minWidth: 30, sortable: false, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value != null) {
                        return parseFloat(dataContext.vatAmount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                        //return value.paidAmount;
                    }

                    return "";
                }
            },
            //{
            //    id: "relatedSaleOrder", field: "relatedSaleOrder", name: reportItemTranslation.PAID_AMOUNT, dataType: 'number', width: 250, minWidth: 30, sortable: false, filterable: false,
            //    formatter: function (row, cell, value, columnDef, dataContext) {

            //        if (value != null) {
            //            return parseFloat(value.paidAmount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
            //            //return value.paidAmount;
            //        }

            //        return "";
            //    }
            //},
            //{
            //    id: "relatedSaleOrder", field: "relatedSaleOrder", name: reportItemTranslation.PAID_AMOUNT, dataType: 'number', width: 250, minWidth: 30, sortable: false, filterable: false,
            //    formatter: function (row, cell, value, columnDef, dataContext) {

            //        if (value != null) {
            //            return value.custId;
            //        }

            //        return "";
            //    }
            //},
            {
                id: "paidAmount", field: "paidAmount", name: reportItemTranslation.PAID_AMOUNT, dataType: 'number', width: 250, minWidth: 30, sortable: false, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {

                    if (value != null) {
                        return parseFloat(dataContext.paidAmount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                        //return value.paidAmount;
                    }

                    return "";
                }
            },
            //{
            //    id: "relatedSaleOrder", field: "relatedSaleOrder", name: "sdjghjkk", width: 250, minWidth: 30, sortable: false, filterable: false,
            //    formatter: function (row, cell, value, columnDef, dataContext) {

            //        if (value != null) {
            //            return value.cashierId
            //        }

            //        return "";
            //    }
            //}

        ],
        
        hiddenColumns: [
            { id: "createdTime", name: "Khuyến mãi", field: "createdTime", sortable: true, dataType: 'text', width: 200 },
            {
                id: "cashierId", field: "cashierId", name: "sdjghjkk", width: 250, minWidth: 30, sortable: false, filterable: false,
            },
            {
                id: "groupNameCust", field: "groupNameCust", name: "sdjghjkk", width: 250, minWidth: 30, sortable: false, filterable: false,
            },
            {
                id: "typeNameCust", field: "typeNameCust", name: "sdjghjkk", width: 250, minWidth: 30, sortable: false, filterable: false,
            },
            {
                id: "custName", field: "custName", name: "sdjghjkk", width: 250, minWidth: 30, sortable: false, filterable: false,
            },
            {
                id: "storeName", field: "storeName", name: "sdjghjkk", width: 250, minWidth: 30, sortable: false, filterable: false,
            },
            {
                id: "relatedSaleOrder", field: "relatedSaleOrder", name: "sdjghjkk", width: 250, minWidth: 30, sortable: false, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {

                    if (value != null) {
                        return value.storeId
                    }

                    return "";
                }
            },
        ],
        updateFooter: function (grid) {
            var gridData = grid.getData().getItems();
            var quantity = 0;
            var baseSellAmt = 0;
            var vatAmount = 0;
            var paidAmount = 0;
            

          



            $.each(gridData, function (key, value) {
              quantity += (parseInt(value.quantity) || 0);
              baseSellAmt += (parseInt(value.baseSellAmt) || 0);     
              vatAmount += (parseInt(value.vatAmount) || 0);
              paidAmount += (parseInt(value.paidAmount) || 0);
            });
            var columnElement = grid.getFooterRowColumn("relatedItem");
            $(columnElement).html("<div class='text-right' style='font-weight: bold; float: right'>" + reportItemTranslation.TOTAL + ": </div>");

            columnElement = grid.getFooterRowColumn("quantity");
            $(columnElement).html("<div class='text-right' style='font-weight: bold; float: right'>" + quantity.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</div>");

            columnElement = grid.getFooterRowColumn("baseSellAmt");
            $(columnElement).html("<div class='text-right' style='font-weight: bold; float: right'>" + baseSellAmt.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</div>");

            columnElement = grid.getFooterRowColumn("vatAmount");
            $(columnElement).html("<div class='text-right' style='font-weight: bold; float: right'>" + vatAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</div>");

            columnElement = grid.getFooterRowColumn("paidAmount");
            $(columnElement).html("<div class='text-right' style='font-weight: bold; float: right'>" + paidAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "</div>");

            
        },
    };
}


