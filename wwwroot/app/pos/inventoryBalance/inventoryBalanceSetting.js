var inventoryBalanceSetting = {
    view: {
        module: 'pos',
        formName: 'inventoryBalance',
        gridName: 'grvInventoryBalance',
    }
};

function inventoryBalanceInitSetting() {
    inventoryBalanceSetting.valuelist = {};

    inventoryBalanceSetting.grid = {
        url: 'api/pos/InventoryBalance/get',

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

            dataItemColumnValueExtractor: Slick.Editors.ObjectValue
        },
        columns: [
            { id: 'sku', field: 'item.sku', name: inventoryBalanceTranslation.SKU, width: 180, sortable: true },
            { id: 'barcode', field: 'item.barcode', name: inventoryBalanceTranslation.BARCODE, width: 200, sortable: true },
            { id: 'name', field: 'item.name', name: inventoryBalanceTranslation.NAME, width: 350, sortable: true },
            {
                id: 'uom', field: 'item.relatedUnitOfMeasure', name: inventoryBalanceTranslation.UOM, width: 150, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value)
                        return value.name;                  
                }
            },
            { id: 'lastCogs', field: 'lastCogs', name: inventoryBalanceTranslation.COGS, width: 200, sortable: true, formatter: Slick.Formatters.Money },
            { id: 'sellPrice', field: 'item.sellPrice', name: inventoryBalanceTranslation.SELLPRICE, width: 200, sortable: true, formatter: Slick.Formatters.Money },           
            {
                id: 'quantity', field: 'quantity', name: inventoryBalanceTranslation.STOCK, width: 140, sortable: true, dataType: 'number',
                formatter: Slick.Formatters.Number
            },
        ],
    };

    inventoryBalanceSetting.gridChild = {
        grvItemDetail: {
            url: '',

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

                dataItemColumnValueExtractor: Slick.Editors.ObjectValue
            },
            columns: [
                { id: 'sku', field: 'item.sku', name: inventoryBalanceTranslation.SKU, width: 150, sortable: true },
                { id: 'barcode', field: 'item.barcode', name: inventoryBalanceTranslation.BARCODE, width: 150, sortable: true },
                { id: 'name', field: 'item.name', name: inventoryBalanceTranslation.NAME, width: 350, sortable: true },
                {
                    id: 'uom', field: 'item.relatedUnitOfMeasure', name: inventoryBalanceTranslation.UOM, width: 100, sortable: true,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value)
                            return value.name;
                    }
                }, 
                {
                    id: 'quantity', field: 'quantity', dataType: 'number', name: inventoryBalanceTranslation.QUANTITY, width: 90, sortable: true, dataType: 'number',
                    formatter: Slick.Formatters.Number
                },
                {
                    id: 'unitCost', field: 'unitCost', dataType: 'number', name: inventoryBalanceTranslation.UNITCOST, width: 150, sortable: true, dataType: 'number',
                    formatter: Slick.Formatters.Money
                },
                {
                    id: 'amount', field: 'amount', dataType: 'number', name: inventoryBalanceTranslation.AMOUNT, width: 150, sortable: true, dataType: 'number',
                    formatter: Slick.Formatters.Money
                },
            ],
        },
    }

    inventoryBalanceSetting.required = [];

    inventoryBalanceSetting.readonly = [];

    inventoryBalanceSetting.validate = {

    }
}