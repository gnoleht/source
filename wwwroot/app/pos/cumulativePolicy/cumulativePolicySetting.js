var cumulativePolicySetting = {
    view: {
        module: 'pos',
        formName: 'cumulativePolicy',
        gridName: 'grvcumulativePolicy',
    }
};

function cumulativePolicyInitSetting() {
    cumulativePolicySetting.valuelist = {};

    cumulativePolicySetting.grid = {
        url: 'api/pos/cumulativePolicy/get',

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
            explicitInitialization: true,

            editable: false,
            enableAddRow: false,

            createFooterRow: true,
            showFooterRow: true,
            footerRowHeight: 50,

            dataItemColumnValueExtractor: Slick.Editors.ObjectValue
        },
        columns: [
            {
                id: "#", field: '', name: "#", width: 50, defaultWidth: 50, sortable: false, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return row + 1;
                }
            },
            {
                id: 'barcode', field: 'barcode', name: cumulativePolicyTranslation.BARCODE, width: 200, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext && dataContext.item)
                        return dataContext.item.barcode;
                    return null;
                }
            },
            {
                id: 'sku', field: 'sku', name: cumulativePolicyTranslation.SKU, width: 200, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext && dataContext.item)
                        return dataContext.item.sku;
                    return null;
                }
            },
            {
                id: 'name', field: 'name', name: cumulativePolicyTranslation.ITEMNAME, width: 430, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext && dataContext.item)
                        return dataContext.item.name;
                    return null;
                }
            },
            {
                id: 'uom', field: 'item.umid', name: cumulativePolicyTranslation.UOM, width: 150, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value && cumulativePolicySetting.valuelist.listUnit) return cumulativePolicySetting.valuelist.listUnit.find(x=>x.id==value).name;
                }
            },
            {
                id: 'quantity', field: 'quantity', name: cumulativePolicyTranslation.QUANTITY, width: 100, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                }
            },
            { id: 'unitCost', field: 'unitCost', name: cumulativePolicyTranslation.UNITCOST, width: 150, sortable: true, formatter: Slick.Formatters.Money },
            { id: 'amount', field: 'amount', name: cumulativePolicyTranslation.AMOUNT, width: 150, sortable: true, formatter: Slick.Formatters.Money },
        ],
        updateFooter: function (grid) {
            var gridData = grid.getData().getItems();
            var total = 0;
            $.each(gridData, function (key, value) {
                total += (parseInt(value.amount) || 0);
            });
            var columnElement = grid.getFooterRowColumn("unitCost");
            $(columnElement).html("<div class='text-right' style='font-weight: bold; float: right'>" + cumulativePolicyTranslation.SUMMONEY + ": </div>");
            var columnElement2 = grid.getFooterRowColumn("amount");
            $(columnElement2).html('<div style="font-weight: bold; float: right">' + total.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '</div>');
        },
    };

    cumulativePolicySetting.gridChild = {
        grvItemDetail: {
            url: 'api/pos/contact/get',

            options: {
                rowHeight: 40,
                topPanelHeight: 35,

                showHeaderRow: true,
                headerRowHeight: 0,

                editable: true,
                autoEdit: true,

                allowOrder: true,
                allowFilter: false,
                allowCustom: true,
                allowExport: true,
                allowImport: true,

                autoHeight: false,
                fullWidthRows: true,
                multiColumnSort: true,

                enableColumnReorder: true,
                enableCellNavigation: true,
                explicitInitialization: true,
            },
            columns: [
                {
                    id: 'barcode', field: 'itemId', name: cumulativePolicyTranslation.BARCODE, width: 150, sortable: true, dataType: 'select', listName: 'listItem',
                    editor: Slick.Editors.Combobox,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && cumulativePolicySetting.valuelist.listItem) {
                            var item = cumulativePolicySetting.valuelist.listItem.find(x => x.id == value);
                            if (item)
                                return item.text;
                            return null
                        }
                    }
                },
                {
                    id: 'sku', field: 'itemId', name: cumulativePolicyTranslation.SKU, width: 150, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && cumulativePolicySetting.valuelist.listItem) {
                            var item = cumulativePolicySetting.valuelist.listItem.find(x => x.id == value);
                            if (item) return item.sku;
                            return null
                        }
                    }
                },
                {
                    id: 'name', field: 'itemId', name: cumulativePolicyTranslation.ITEMNAME, width: 350, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && cumulativePolicySetting.valuelist.listItem) {
                            var item = cumulativePolicySetting.valuelist.listItem.find(x => x.id == value);
                            if (item) return item.name;
                            return null
                        }
                    }
                },
                {
                    id: 'uom', field: 'itemId', name: cumulativePolicyTranslation.UOM, width: 100, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && cumulativePolicySetting.valuelist.listItem) {
                            var item = cumulativePolicySetting.valuelist.listItem.find(x => x.id == value);
                            if (item) return item.unit;
                        }
                    }
                },
                {
                    id: 'quantity', field: 'quantity', dataType: 'number', name: cumulativePolicyTranslation.QUANTITY, width: 90, sortable: true, editor: Slick.Editors.Integer,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                    }
                },
                {
                    id: 'unitCost', field: 'unitCost', dataType: 'number', name: cumulativePolicyTranslation.UNITCOST, width: 150, sortable: true, editor: Slick.Editors.Integer,
                    formatter: Slick.Formatters.Money
                },
                {
                    id: 'amount', field: 'amount', dataType: 'number', name: cumulativePolicyTranslation.AMOUNT, width: 150, sortable: true, editor: Slick.Editors.Integer,
                    formatter: Slick.Formatters.Money
                },
            ],
        }
    };

    cumulativePolicySetting.required = ['deliverer', 'objectType', 'storeId'];

    cumulativePolicySetting.readonly = [];

    cumulativePolicySetting.validate = {
        deliverer: { required: true },
        objectType: { required: true },
        storeId: { required: true }
    }
}