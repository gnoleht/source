var stationeryOrderSetting = {
    view: {
        module: 'pt',
        subModule: 'stationeryOrder',
        formName: 'stationeryOrder',
        gridName: 'grvStationeryOrder',
    }
};

function stationeryOrderInitSetting() {

    stationeryOrderSetting.grid = {
        url: 'api/pt/StationeryOrder/GetRegister',
        options: {
            rowHeight: 40,
            topPanelHeight: 35,
            showHeaderRow: true,
            headerRowHeight: 0,

            allowOrder: false,
            allowFilter: true,
            allowCustom: true,

            fullWidthRows: true,
            multiColumnSort: true,
            enableColumnReorder: true,
            enableCellNavigation: true,
            explicitInitialization: true,
        },
        columns: [
            //{
            //    id: "id", field: "id", name: stationeryOrderTranslation.NO, width: 40, minWidth: 40, sortable: false, filterable: false,
            //    formatter: function (row, cell, value, columnDef, dataContext) {
            //        return row + 1;
            //    }
            //},
            {
                id: "reason", field: "reason", name: stationeryOrderTranslation.REASON, width: 340, minWidth: 30, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    dataContext.hasChild = !dataContext.parentGroup;
                    var spacer = '<span style="display:inline-block;height:1px;width:' + (15 * dataContext.indent + (dataContext.hasChild ? 0 : 14)) + 'px"></span>';
                    var result = '<div class="middle_40">' + spacer;
                    var reason = dataContext.reason;
                    if (dataContext.hasChild) {
                        if (dataContext.isCollapsed) {
                            result = result + '<i class="bowtie-icon bowtie-navigate-forward-circle arrow_01 toggle"></i>';

                        } else {
                            result = result + '<i class="bowtie-icon bowtie-navigate-forward-circle arrow_02 toggle"></i>';
                        }
                        reason = '<strong> ' + stationeryOrderSetting.listFilter.stationeryOrderStatus[dataContext.reason].text + '</strong>';
                    }
                    result = result + '<span>' + reason + '</span></div>';
                    return result;
                }
            }
        ],
    };

    stationeryOrderSetting.gridChild = {
        grvOrder: {
            options: {
                rowHeight: 40,
                topPanelHeight: 35,
                showHeaderRow: true,
                headerRowHeight: 0,

                allowOrder: false,
                allowFilter: true,
                allowCustom: true,

                fullWidthRows: true,
                multiColumnSort: true,
                enableColumnReorder: true,
                enableCellNavigation: true,
                explicitInitialization: true,
            },
            columns: [
                {
                    id: 'userCreate', field: 'userCreate', name: stationeryOrderTranslation.ORDER_BY, width: 200, minWidth: 50, sortable: true,
                    formatter: function (r, c, value) {
                        if (value)
                            return value.displayName;
                        return;
                    }
                },
                {
                    id: "orderDate", field: "orderDate", name: stationeryOrderTranslation.ORDER_DATE, width: 220, minWidth: 30, sortable: true, formatter: Slick.Formatters.Date, dataType: "datetime",
                },
                {
                    id: "expectedDate", field: "expectedDate", name: stationeryOrderTranslation.EXPECTED_DATE, width: 220, minWidth: 30, sortable: true, formatter: Slick.Formatters.Date, dataType: "datetime",
                },
                {
                    id: "deliveryDate", field: "deliveryDate", name: stationeryOrderTranslation.DELIVERY_DATE, width: 220, minWidth: 30, sortable: true, formatter: Slick.Formatters.Date, dataType: "datetime",
                },
                {
                    id: "amountOrder", field: "amountOrder", name: stationeryOrderTranslation.AMOUNT_ORDER, width: 220, minWidth: 30, sortable: true, formatter: Slick.Formatters.Money, dataType: 'number'
                },
                {
                    id: "amount", field: "amount", name: stationeryOrderTranslation.AMOUNT, width: 220, minWidth: 30, sortable: true, formatter: Slick.Formatters.Money, dataType: 'number'
                },
                {
                    id: 'status', field: 'status', name: stationeryOrderTranslation.STATUS, width: 200, minWidth: 50, sortable: true, dataType: 'select', listName: 'orderStatus',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var itemList = stationeryOrderSetting.listFilter.orderStatus[value];
                        if (itemList)
                            return gridItemRender(itemList);
                        return value;
                    }
                }
                //{ id: 'period', field: 'period', name: stationeryOrderTranslation.PERIOD, width: 200, minWidth: 50, sortable: true },
            ],
        },

        grvOrderDetail: {
            options: {
                rowHeight: 40,
                topPanelHeight: 35,
                showHeaderRow: true,
                headerRowHeight: 0,
                createFooterRow: true,
                showFooterRow: true,
                footerRowHeight: 30,

                allowOrder: false,
                allowFilter: true,
                allowCustom: true,

                editable: true,
                autoEdit: true,

                fullWidthRows: true,
                multiColumnSort: true,
                enableColumnReorder: true,
                enableCellNavigation: true,
                explicitInitialization: true,
            },
            columns: [
                {
                    id: "name", field: "name", name: stationeryOrderTranslation.NAME, width: 200, minWidth: 30, sortable: true
                },
                {
                    id: "unit", field: "unit", name: stationeryOrderTranslation.UNIT, width: 100, minWidth: 30, sortable: true, dataType: 'select', listName: 'stationeryUnit',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var itemList = stationeryOrderSetting.listFilter.stationeryUnit[value];
                        if (itemList)
                            return itemList.text;
                        return value;
                    }
                },
                {
                    id: "quantity", field: "quantity", dataType: 'number', name: stationeryOrderTranslation.QUANTITY, width: 100, minWidth: 30, sortable: true, formatter: Slick.Formatters.Number
                },
                {
                    id: "quantityOrder", field: "quantityOrder", dataType: 'number', name: stationeryOrderTranslation.QUANTITY_ORDER, width: 100, minWidth: 30, sortable: true,
                    editor: Slick.Editors.Integer,
                    formatter: Slick.Formatters.Number
                },
                {
                    id: "delivered", field: "delivered", dataType: 'number', name: stationeryOrderTranslation.DELIVERED, width: 100, minWidth: 30, sortable: true,
                    editor: Slick.Editors.Integer,
                    formatter: Slick.Formatters.Number
                },
                {
                    id: "cost", field: "cost", name: stationeryOrderTranslation.COST, width: 100, minWidth: 30, sortable: true, dataType: 'number',
                    formatter: Slick.Formatters.Money
                },
                {
                    id: "percentVAT", field: "percentVAT", name: stationeryOrderTranslation.PERCENT_VAT, width: 70, minWidth: 30, sortable: true, dataType: 'number',
                    formatter: Slick.Formatters.Number
                },
                {
                    id: "pricesOrder", field: "pricesOrder", name: stationeryOrderTranslation.PRICES_ORDER, width: 150, minWidth: 30, sortable: true, dataType: 'number',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        dataContext.pricesOrder = dataContext.cost * ((100 + dataContext.percentVAT) / 100) * dataContext.quantityOrder;
                        if (!dataContext.pricesOrder) dataContext.pricesOrder = 0;
                        return '<div style="width:100%;text-align:right">' + accounting.formatMoney(dataContext.pricesOrder) + '</div>';
                    }
                },
                {
                    id: "prices", field: "prices", name: stationeryOrderTranslation.PRICES_TOTAL, width: 150, minWidth: 30, sortable: true, dataType: 'number',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        dataContext.prices = dataContext.cost * ((100 + dataContext.percentVAT) / 100) * dataContext.delivered;
                        if (!dataContext.prices) dataContext.prices = 0;
                        return '<div style="width:100%;text-align:right">' + accounting.formatMoney(dataContext.prices) + '</div>';
                    }
                }
            ],
            updateFooter: function (grid) {
                var gridData = grid.getData().getItems();
                var total = 0;
                var totalP = 0;
                $.each(gridData, function (index, item) {
                    total += item.pricesOrder ? item.pricesOrder : 0;
                    totalP += item.prices ? item.prices : 0;
                });
                var columnElement = grid.getFooterRowColumn("percentVAT");
                $(columnElement).html("<div style='font-weight: bold;font-size:12px;text-align:right;'>" + stationeryOrderTranslation.TOTAL + ": </div>");
                columnElement = grid.getFooterRowColumn("pricesOrder");
                $(columnElement).html('<div style="font-size:12px;font-weight:bold;text-align:right;padding: 0 10px;">' + total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " " + stationeryOrderTranslation.UNIT_VND + '</div>');
                columnElement = grid.getFooterRowColumn("prices");
                $(columnElement).html('<div style="font-size:12px;font-weight:bold;text-align:right;padding: 0 10px;">' + totalP.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " " + stationeryOrderTranslation.UNIT_VND + '</div>');
            },
        },
    };

    stationeryOrderSetting.valuelist = {};
    stationeryOrderSetting.listFilter = {};

}
