var barcodePrintSetting = {
    view: {
        module: 'pos',
        formName: 'barcodePrint',
        gridName: 'grvBarcodePrint',
    }
};

function barcodePrintInitSetting() {
    barcodePrintSetting.valuelist = {};

    barcodePrintSetting.grid = {
        url: 'api/pos/barcodePrint/get',
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
                name: '<div> <i id="ckbAllPrint" class="ckbAllPrint bowtie-icon bowtie-checkbox-empty" style="cursor:pointer;font-size:18px;margin-right:3px"></i></div>',
                width: 40, minWidth: 40, maxWidth: 40, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var icon = dataContext.selectedPrint ? "bowtie-checkbox" : "bowtie-checkbox-empty";                     
                    return '<span> ' +
                        '<i class="selectedPrint bowtie-icon ' + icon + '" style="font-size:18px;"></i >' +
                        '</span> ';
                }
            },
            { id: 'sku', field: 'sku', dataType: 'text', name: barcodePrintTranslation.SKU, minWidth: 200, sortable: true },
            { id: 'barcode', field: 'barcode', dataType: 'text', name: barcodePrintTranslation.BARCODE, minWidth: 200, sortable: true },
            { id: 'name', field: 'name', dataType: 'text', name: barcodePrintTranslation.NAME, width: 400, sortable: true },
            { id: 'sellPrice', field: 'sellPrice', dataType: 'number', name: barcodePrintTranslation.SELLPRICE, width: 150, sortable: true, formatter: Slick.Formatters.Money },
            {
                id: 'quantityPrint', field: 'quantityPrint', dataType: 'number', name: barcodePrintTranslation.QUANTITYPRINT, width: 150, sortable: true, editor: Slick.Editors.Integer, cssClass: 'center',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (!value) dataContext.quantityPrint = 1;

                    return parseFloat(dataContext.quantityPrint).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                }
            },
            {
                id: 'storeId', field: 'storeId', name: barcodePrintTranslation.STOREID, width: 360, sortable: true, dataType: 'select', listName: 'listStore',
                editor: Slick.Editors.Combobox,
                formatter: function (row, cell, value, columnDef, dataContext) {

                    if (value && barcodePrintSetting.valuelist.listStore) {
                        var item = barcodePrintSetting.valuelist.listStore.find(x => x.id == value);
                        if (item)
                            return item.text;
                        return null
                    }
                    return null;
                }
            },
        ],
    };

    barcodePrintSetting.gridChild = {
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
                { id: 'code', field: 'code', dataType: 'text', name: barcodePrintTranslation.CODEINVIMPORT, minWidth: 200, sortable: true },
                {
                    id: 'docDate', field: 'docDate', dataType: 'text', name: barcodePrintTranslation.DOCDATE, minWidth: 150, sortable: true,
                    formatter: Slick.Formatters.Date
                },
                {
                    id: 'docTime', field: 'docTime', dataType: 'text', name: barcodePrintTranslation.DOCTIME, width: 100, sortable: true, formatter: function (row, cell, value, columnDef, dataContext) {
                        return moment(value).format('LTS');
                    }
                },
                {
                    id: 'storeId', field: 'storeId', dataType: 'text', name: barcodePrintTranslation.STOREID, width: 295, sortable: true,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (dataContext && dataContext.store)
                            return dataContext.store.name;
                        return null;
                    }
                },
                { id: 'memo', field: 'memo', dataType: 'text', name: barcodePrintTranslation.MEMO, width: 260, sortable: true },
            ],
        }
    };

    barcodePrintSetting.required = [

    ];
    barcodePrintSetting.validate = {

    }
}
