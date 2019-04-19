var costPriceSetting = {
    view: {
        module: 'pos',
        formName: 'costPrice',
        gridName: 'grvcostPrice',
    }
};

function costPriceInitSetting() {
    costPriceSetting.valuelist = {};

    costPriceSetting.grid = {
        url: 'api/pos/costPrice/get',
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
                id: 'selectedPrint', field: 'selectedPrint', sortable: false,
                name: '#',
                width: 40, minWidth: 40, maxWidth: 40, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var icon = dataContext.selectedPrint ? "bowtie-checkbox" : "bowtie-checkbox-empty";                     
                    return '<span> ' +
                        '<i class="selectedPrint bowtie-icon ' + icon + '" style="font-size:18px;"></i >' +
                        '</span> ';
                }
            },
            { id: 'sku', field: 'sku', dataType: 'text', name: costPriceTranslation.SKU, minWidth: 200, sortable: true },
            { id: 'barcode', field: 'barcode', dataType: 'text', name: costPriceTranslation.BARCODE, minWidth: 200, sortable: true },
            { id: 'name', field: 'name', dataType: 'text', name: costPriceTranslation.NAME, width: 400, sortable: true },
            { id: 'sellPrice', field: 'sellPrice', dataType: 'number', name: costPriceTranslation.SELLPRICE, width: 150, sortable: true, formatter: Slick.Formatters.Money },
            {
                id: 'quantityPrint', field: 'quantityPrint', dataType: 'number', name: costPriceTranslation.QUANTITYPRINT, width: 150, sortable: true, editor: Slick.Editors.Integer,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if(value)
                        return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                    return 1;
                }
            },
            {
                id: 'storeId', field: 'storeId', name: costPriceTranslation.STOREID, width: 270, sortable: true, dataType: 'select', listName: 'listStore',
                editor: Slick.Editors.Combobox,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value && costPriceSetting.valuelist.listStore) {
                        var item = costPriceSetting.valuelist.listStore.find(x => x.id == value);
                        if (item)
                            return item.text;
                        return null
                    }
                }
            },
        ],
    };

    costPriceSetting.gridChild = {
        grvInventoryImport: {
            url: 'api/pos/inventoryImport/get',
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
                    id: 'selectedInvImport', field: 'selectedInvImport', sortable: false,
                    name: '#',
                    width: 40, minWidth: 40, maxWidth: 40, filterable: false,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var icon = dataContext.selectedInvImport ? "bowtie-checkbox" : "bowtie-checkbox-empty";                     
                        return '<span> ' +
                            '<i class="selectedInvImport bowtie-icon ' + icon + '" style="font-size:18px;"></i >' +
                            '</span> ';
                    }
                },
                { id: 'code', field: 'code', dataType: 'text', name: costPriceTranslation.CODEINVIMPORT, minWidth: 200, sortable: true },
                {
                    id: 'docDate', field: 'docDate', dataType: 'text', name: costPriceTranslation.DOCDATE, minWidth: 150, sortable: true,
                    formatter: Slick.Formatters.Date
                },
                {
                    id: 'docTime', field: 'docTime', dataType: 'text', name: costPriceTranslation.DOCTIME, width: 100, sortable: true, formatter: function (row, cell, value, columnDef, dataContext) {
                        return moment(value).format('LTS');
                    }
                },
                {
                    id: 'storeId', field: 'storeId', dataType: 'text', name: costPriceTranslation.STOREID, width: 295, sortable: true,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (dataContext && dataContext.store)
                            return dataContext.store.name;
                        return null;
                    }
                },
                { id: 'memo', field: 'memo', dataType: 'text', name: costPriceTranslation.MEMO, width: 260, sortable: true },
            ],
        }
    };

    costPriceSetting.required = [

    ];
    costPriceSetting.validate = {

    }
}
