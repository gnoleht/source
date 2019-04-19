var inventoryImportSetting = {
    view: {
        module: 'pos',
        formName: 'inventoryImport',
        gridName: 'grvInventoryImport',
    }
};

function inventoryImportInitSetting() {
    inventoryImportSetting.valuelist = {};

    inventoryImportSetting.grid = {
        url: 'api/pos/InventoryImport/get',

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
                id: 'barcode', field: 'barcode', name: inventoryImportTranslation.BARCODE, width: 200, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext && dataContext.item)
                        return dataContext.item.barcode;
                    return null;
                }
            },
            {
                id: 'sku', field: 'sku', name: inventoryImportTranslation.SKU, width: 200, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext && dataContext.item)
                        return dataContext.item.sku;
                    return null;
                }
            },
            {
                id: 'name', field: 'name', name: inventoryImportTranslation.ITEMNAME, width: 430, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext && dataContext.item)
                        return dataContext.item.name;
                    return null;
                }
            },
            {
                id: 'uom', field: 'item.umid', name: inventoryImportTranslation.UOM, width: 150, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value && inventoryImportSetting.valuelist.listUnit) return inventoryImportSetting.valuelist.listUnit.find(x => x.id == value).name;
                }
            },
            {
                id: 'quantity', field: 'quantity', name: inventoryImportTranslation.QUANTITY, width: 100, sortable: true, dataType: 'number',
                formatter: Slick.Formatters.Number
            },
            { id: 'unitCost', field: 'unitCost', name: inventoryImportTranslation.UNITCOST, width: 180, sortable: true, formatter: Slick.Formatters.Money },
            { id: 'amount', field: 'amount', name: inventoryImportTranslation.AMOUNT, width: 220, sortable: true, formatter: Slick.Formatters.Money },
        ],
        updateFooter: function (grid) {
            var gridData = grid.getData().getItems();
            var total = 0;
            $.each(gridData, function (key, value) {
                total += (parseInt(value.amount) || 0);
            });
            var columnElement = grid.getFooterRowColumn("unitCost");
            $(columnElement).html("<div class='text-right' style='font-weight: bold; float: right'>" + inventoryImportTranslation.SUMMONEY + ": </div>");
            var columnElement2 = grid.getFooterRowColumn("amount");
            $(columnElement2).html('<div style="font-weight: bold; float: right">' + total.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' VNĐ' + '</div>');
        },
    };

    inventoryImportSetting.gridChild = {
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
                    id: 'barcode', field: 'itemId', name: inventoryImportTranslation.BARCODE, width: 150, sortable: true, dataType: 'select', listName: 'listItem',
                    editor: Slick.Editors.Combobox,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && inventoryImportSetting.valuelist.listItem) {
                            var item = inventoryImportSetting.valuelist.listItem.find(x => x.id == value);
                            if (item)
                                return item.text;
                            return null;
                        }
                        return null;
                    }
                },
                {
                    id: 'sku', field: 'itemId', name: inventoryImportTranslation.SKU, width: 150, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && inventoryImportSetting.valuelist.listItem) {
                            var item = inventoryImportSetting.valuelist.listItem.find(x => x.id == value);
                            if (item) return item.sku;
                            return null;
                        }
                        return null;
                    }
                },
                {
                    id: 'name', field: 'itemId', name: inventoryImportTranslation.ITEMNAME, width: 350, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && inventoryImportSetting.valuelist.listItem) {
                            var item = inventoryImportSetting.valuelist.listItem.find(x => x.id == value);
                            if (item) return item.name;
                            return null;
                        }
                        return null;
                    }
                },
                {
                    id: 'uom', field: 'itemId', name: inventoryImportTranslation.UOM, width: 100, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && inventoryImportSetting.valuelist.listItem) {
                            var item = inventoryImportSetting.valuelist.listItem.find(x => x.id == value);
                            if (item) return item.unit;
                        }
                        return null;
                    }
                },
                {
                    id: 'quantity', field: 'quantity', dataType: 'number', name: inventoryImportTranslation.QUANTITY, width: 90, sortable: true, editor: Slick.Editors.Integer,
                    opt: { min: 1 },
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                    }
                },
                {
                    id: 'unitCost', field: 'unitCost', dataType: 'number', name: inventoryImportTranslation.UNITCOST, width: 150, sortable: true, editor: Slick.Editors.Integer,
                    formatter: Slick.Formatters.Money
                },
                {
                    id: 'amount', field: 'amount', dataType: 'number', name: inventoryImportTranslation.AMOUNT, width: 150, sortable: true, editor: Slick.Editors.Integer,
                    formatter: Slick.Formatters.Money
                },
            ],
        },

        grvItemImport: {
            url: 'api/pos/Item/get',
            options: {
                rowHeight: 40,
                topPanelHeight: 35,

                showHeaderRow: true,
                headerRowHeight: 0,

                editable: true,
                autoEdit: true,

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
                {
                    id: 'selectedItemImport', field: 'selectedItemImport', sortable: false,
                    name: '<div> <i id="ckbAllItem" class="ckbAllItem bowtie-icon bowtie-checkbox-empty" style="cursor:pointer;font-size:18px;margin-right:5px"></i></div>',
                    width: 40, minWidth: 40, maxWidth: 40, filterable: false,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var icon = dataContext.selectedItemImport ? "bowtie-checkbox" : "bowtie-checkbox-empty";
                        return '<span> ' +
                            '<i class="selectedItemImport bowtie-icon ' + icon + '" style="font-size:18px;"></i >' +
                            '</span> ';
                    }
                },
                { id: 'itemBarcode', field: 'barcode', dataType: 'text', name: inventoryImportTranslation.BARCODE, minWidth: 200, sortable: true },
                { id: 'itemSKU', field: 'sku', dataType: 'text', name: inventoryImportTranslation.SKU, minWidth: 200, sortable: true },
                { id: 'itemName', field: 'name', dataType: 'text', name: inventoryImportTranslation.ITEMNAME, minWidth: 450, sortable: true },
                {
                    id: 'itemQuantity', field: 'quantity', dataType: 'number', name: inventoryImportTranslation.QUANTITY, width: 150, sortable: true, editor: Slick.Editors.Integer,                   
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (!value) dataContext.quantity = 1;

                        return parseFloat(dataContext.quantity).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                    }
                },
            ],
        }
    };

    inventoryImportSetting.required = ['deliverer', 'storeId', "nameVendor", "primaryStreetVendor", "primaryPhoneVendor", "firstNameEmployee","lastNameEmployee"];

    inventoryImportSetting.readonly = [];

    inventoryImportSetting.validate = {
        deliverer: { required: true },
       // objectType: { required: true },
        storeId: { required: true },
        //nameVendor: { required: true },
        //primaryStreetVendor: { required: true },
        //primaryPhoneVendor: { required: true },
    }
}