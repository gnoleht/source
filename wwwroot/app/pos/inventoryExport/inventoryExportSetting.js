var inventoryExportSetting = {
    view: {
        module: 'pos',
        formName: 'inventoryExport',
        gridName: 'grvinventoryExport',
    }
};

function inventoryExportInitSetting() {
    inventoryExportSetting.valuelist = {};

    inventoryExportSetting.grid = {
        url: 'api/pos/InventoryExport/get',

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
                id: 'barcode', field: 'barcode', name: inventoryExportTranslation.BARCODE, width: 200, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext && dataContext.item)
                        return dataContext.item.barcode;
                    return null;
                }
            },
            {
                id: 'sku', field: 'sku', name: inventoryExportTranslation.SKU, width: 200, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext && dataContext.item)
                        return dataContext.item.sku;
                    return null;
                }
            },
            {
                id: 'name', field: 'name', name: inventoryExportTranslation.ITEMNAME, width: 430, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext && dataContext.item)
                        return dataContext.item.name;
                    return null;
                }
            },
            {
                id: 'uom', field: 'item.umid', name: inventoryExportTranslation.UOM, width: 150, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value && inventoryExportSetting.valuelist.listUnit) return inventoryExportSetting.valuelist.listUnit.find(x=>x.id==value).name;
                }
            },
            {
                id: 'quantity', field: 'quantity', name: inventoryExportTranslation.QUANTITY, width: 100, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                }
            },
            { id: 'unitCost', field: 'unitCost', name: inventoryExportTranslation.UNITCOST, width: 180, sortable: true, formatter: Slick.Formatters.Money },
            { id: 'amount', field: 'amount', name: inventoryExportTranslation.AMOUNT, width: 220, sortable: true, formatter: Slick.Formatters.Money },
        ],
        updateFooter: function (grid) {
            var gridData = grid.getData().getItems();
            var total = 0;
            $.each(gridData, function (key, value) {
                total += (parseInt(value.amount) || 0);
            });
            var columnElement = grid.getFooterRowColumn("unitCost");
            $(columnElement).html("<div class='text-right' style='font-weight: bold; float: right'>" + inventoryExportTranslation.SUMMONEY + ": </div>");
            var columnElement2 = grid.getFooterRowColumn("amount");
            $(columnElement2).html('<div style="font-weight: bold; float: right">' + total.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '</div>');
        },
    };

    inventoryExportSetting.gridChild = {
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
                    id: 'barcode', field: 'itemId', name: inventoryExportTranslation.BARCODE, width: 150, sortable: true, dataType: 'select', listName: 'listItem',
                    editor: Slick.Editors.Combobox,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && inventoryExportSetting.valuelist.listItem) {
                            var item = inventoryExportSetting.valuelist.listItem.find(x => x.id == value);
                            if (item)
                                return item.text;
                            return null;
                        }
                        return null;
                    }
                },
                {
                    id: 'sku', field: 'itemId', name: inventoryExportTranslation.SKU, width: 150, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && inventoryExportSetting.valuelist.listItem) {
                            var item = inventoryExportSetting.valuelist.listItem.find(x => x.id == value);
                            if (item) return item.sku;
                            return null;
                        }
                        return null;
                    }
                },
                {
                    id: 'name', field: 'itemId', name: inventoryExportTranslation.ITEMNAME, width: 350, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && inventoryExportSetting.valuelist.listItem) {
                            var item = inventoryExportSetting.valuelist.listItem.find(x => x.id == value);
                            if (item) return item.name;
                            return null;
                        }
                        return null;
                    }
                },
                {
                    id: 'uom', field: 'itemId', name: inventoryExportTranslation.UOM, width: 100, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && inventoryExportSetting.valuelist.listItem) {
                            var item = inventoryExportSetting.valuelist.listItem.find(x => x.id == value);
                            if (item) return item.unit;
                            return null;
                        }
                        return null;
                    }
                },
                {
                    id: 'quantity', field: 'quantity', dataType: 'number', name: inventoryExportTranslation.QUANTITY, width: 90, sortable: true, editor: Slick.Editors.Integer,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                    }
                },
                {
                    id: 'unitCost', field: 'unitCost', dataType: 'number', name: inventoryExportTranslation.UNITCOST, width: 150, sortable: true, editor: Slick.Editors.Integer,
                    formatter: Slick.Formatters.Money
                },
                {
                    id: 'amount', field: 'amount', dataType: 'number', name: inventoryExportTranslation.AMOUNT, width: 150, sortable: true, editor: Slick.Editors.Integer,
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
                { id: 'itemBarcode', field: 'barcode', dataType: 'text', name: inventoryExportTranslation.BARCODE, minWidth: 200, sortable: true },
                { id: 'itemSKU', field: 'sku', dataType: 'text', name: inventoryExportTranslation.SKU, minWidth: 200, sortable: true },
                { id: 'itemName', field: 'name', dataType: 'text', name: inventoryExportTranslation.ITEMNAME, minWidth: 450, sortable: true },
                {
                    id: 'itemQuantity', field: 'quantity', dataType: 'number', name: inventoryExportTranslation.QUANTITY, width: 150, sortable: true, editor: Slick.Editors.Integer,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (!value) dataContext.quantity = 1;

                        return parseFloat(dataContext.quantity).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                    }
                },
            ],
        }
    };

    inventoryExportSetting.required = ['deliverer', 'storeId', "nameVendor", "primaryStreetVendor", "primaryPhoneVendor", "firstNameEmployee", "lastNameEmployee"];

    inventoryExportSetting.readonly = [];

    inventoryExportSetting.validate = {
        deliverer: { required: true },
       // objectType: { required: true },
        storeId: { required: true },
        //nameVendor: { required: true },
        //primaryStreetVendor: { required: true },
        //primaryPhoneVendor: { required: true },
    }
}