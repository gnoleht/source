var saleOrderSetting = {
    view: {
        module: 'pos',
        formName: 'saleOrder',
        gridName: 'grvSaleOrder',
    }
};

function saleOrderInitSetting() {
    saleOrderSetting.valuelist = {};

    saleOrderSetting.grid = {
        url: 'api/pos/saleOrderDetail/get',

        options: {
            rowHeight: 40,
            topPanelHeight: 35,

            showHeaderRow: true,
            headerRowHeight: 0,

            allowOrder: true,
            allowFilter: false,
            allowCustom: true,

            autoHeight: false,
            fullWidthRows: true,
            multiColumnSort: true,

            enableColumnReorder: true,
            enableCellNavigation: true,
            explicitInitialization: true,

            createFooterRow: true,
            showFooterRow: true,
            footerRowHeight: 80
        },
        columns: [
            {
                id: 'relatedItem', field: 'relatedItem', dataType: 'text', name: saleOrderTranslation.CODE1, width: 100, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value != null)
                        return dataContext.relatedItem.sku;
                    else
                        return '';
                }
            },
            {
                id: 'relatedItem', field: 'relatedItem', dataType: 'text', name: saleOrderTranslation.NAME1, width: 200, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value != null)
                        return dataContext.relatedItem.name;
                    else
                        return '';
                }
            },
            { id: 'notes', field: 'notes', dataType: 'text', name: saleOrderTranslation.NOTES, width: 200, sortable: true, editor: Slick.Editors.Text },
            {
                id: 'quantity', field: 'quantity', dataType: 'text', name: saleOrderTranslation.QUANTITY, width: 200, sortable: true, editor: Slick.Editors.Integer,
                formatter: Slick.Formatters.Money
            },
            {
                id: 'unitPrice', field: 'unitPrice', dataType: 'text', name: saleOrderTranslation.UNITPRICE, width: 200, sortable: true, editor: Slick.Editors.Integer,
                formatter: Slick.Formatters.Money
            },
            {
                id: 'discAmount', field: 'discAmount', dataType: 'text', name: saleOrderTranslation.DISCAMOUNT, width: 200, sortable: true, editor: Slick.Editors.Integer,
                formatter: Slick.Formatters.Money
            },
            {
                id: 'sellingAmount', field: 'sellingAmount', dataType: 'text', name: saleOrderTranslation.SELLINGAMOUNT, width: 200, sortable: true, editor: Slick.Editors.Integer,
                formatter: Slick.Formatters.Money
            },
        ],
        updateFooter: function (grid) {
            var gridData = grid.getData().getItems();
            //var i = gridData.length;
            var totalSelling = 0;
            var totalDiscount = 0;
            var totalFinal = 0;
            if (gridData.length > 0) {
                var firstOrderDetail = gridData[0];
                //RelatedSaleOrder
                if (firstOrderDetail) {
                    totalSelling = firstOrderDetail.relatedSaleOrder.sellingAmt;
                    totalFinal = firstOrderDetail.relatedSaleOrder.totalAmount;
                    totalDiscount = totalSelling - totalFinal;
                }

            }
            //$.each(gridData, function (key, value) {
            //    totalSelling += (parseInt(value.sellingAmount) || 0);
            //    totalDiscount += (parseInt(value.discAmount) || 0);
            //});
            //totalFinal = totalSelling - totalDiscount;

            var columnElement = grid.getFooterRowColumn("discAmount");
            $(columnElement).html("<div class='text-right' style='font-weight: bold; float: right'>" + saleOrderTranslation.TOTALSELLINGAMOUNT + ": </div>" + 
                "<div class='text-right' style='font-weight: bold; float: right'>" + saleOrderTranslation.TOTALDISCAMOUNT + ": </div>" +
                "<div class='text-right' style='font-weight: bold; float: right'>" + saleOrderTranslation.TOTALFINAL + ": </div>");

            columnElement = grid.getFooterRowColumn("sellingAmount");
            $(columnElement).html('<div style="font-weight: bold; float: right">' + totalSelling.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</div></br>' +
                '<div style="font-weight: bold; float: right">' + totalDiscount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</div></br>' +
                '<div style="font-weight: bold; float: right">' + totalFinal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</div>');
        },
    };

    saleOrderSetting.gridChild = {
        grvSaleOrderPair: {
            url: 'api/pos/saleOrder/getSaleOrderPaidById',

            options: {
                rowHeight: 40,
                topPanelHeight: 35,

                showHeaderRow: true,
                headerRowHeight: 0,

                allowOrder: false,
                allowFilter: false,
                allowCustom: true,

                autoHeight: false,
                fullWidthRows: true,
                multiColumnSort: true,

                enableColumnReorder: true,
                enableCellNavigation: true,
                explicitInitialization: true
            },
            columns: [
                {
                    id: "cashType", field: "cashType", name: saleOrderTranslation.CASHTYPE,  width: 200, sortable: false, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value)
                            return saleOrderSetting.valuelist.cashType.find(x => x.id == value).text;                        
                    }
                },   
                {
                    id: "bankId", field: "bankId", name: saleOrderTranslation.BANKID, width: 200, sortable: false, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && dataContext.bankRelated)
                        return dataContext.bankRelated.name;
                    }
                },   
                {
                    id: "bankCardTypeId", field: "bankCardTypeId", name: saleOrderTranslation.BANKCARDTYPEID, width: 200, sortable: false, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && dataContext.bankCardTypeRelated)
                        return dataContext.bankCardTypeRelated.name;
                    }
                },   
                {
                    id: "tradeId", field: "tradeId", name: saleOrderTranslation.TRADEID, width: 200, sortable: false, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },   
                {
                    id: "debitAmount", field: "debitAmount", name: saleOrderTranslation.DEBITAMOUNT, width: 200, sortable: false, dataType: 'text',
                    formatter: Slick.Formatters.Money
                },   
            ],
        }
    };

    saleOrderSetting.required = [
    ];
    saleOrderSetting.validate = {
        
    }
}
