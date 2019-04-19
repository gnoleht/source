var inventoryCountingSetting = {
    view: {
        module: 'pos',
        formName: 'inventoryCounting',
        gridName: 'grvInventoryCounting',
    }
};

function inventoryCountingInitSetting() {
    inventoryCountingSetting.valuelist = {};

    inventoryCountingSetting.grid = {
        url: 'api/pos/inventoryCountingDetail/get',

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
            footerRowHeight: 50
        },
        columns: [
            {
                id: 'itemId', field: 'itemId', dataType: 'text', filterable: true, name: inventoryCountingTranslation.ITEMID, width: 100, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.relatedItem != null)
                        return dataContext.relatedItem.barcode;
                    return null;
                }
            },
            {
                id: 'itemName', field: 'itemName', dataType: 'text', filterable: true, name: inventoryCountingTranslation.ITEMNAME, width: 200, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.relatedItem != null)
                        return dataContext.relatedItem.name;
                    return null;
                }
            },
            {
                id: 'quantity', field: 'quantity', dataType: 'text', filterable: true, name: inventoryCountingTranslation.QUANTITY, width: 200, sortable: true, editor: Slick.Editors.Integer,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                }
            },
            {
                id: 'actualQuantity', field: 'actualQuantity', filterable: true, name: inventoryCountingTranslation.ACTUALQUANTITY, width: 200, sortable: true, editor: Slick.Editors.Integer,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                }
            },
            {
                id: 'difference', field: 'difference', dataType: 'text', filterable: true, name: inventoryCountingTranslation.DIFFERENCE, width: 200, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                }
            },
            {
                id: 'differeceAmount', field: 'differeceAmount', dataType: 'text', filterable: true, name: inventoryCountingTranslation.DIFFERECEAMOUNT, width: 200, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                }
            },
            //{
            //    id: 'debitAmount', field: 'debitAmount', dataType: 'number', filterable: true, name: inventoryCountingTranslation.DEBITAMOUNT, width: 300, sortable: true, editor: Slick.Editors.Text,
            //    formatter: Slick.Formatters.Money
            //}
        ],
        updateFooter: function (grid) {
            var gridData = grid.getData().getItems();
            //var i = gridData.length;
            var total = 0;
            $.each(gridData, function (key, value) {
                total += (parseInt(value.debitAmount) || 0);
            });
            var columnElement = grid.getFooterRowColumn("cashReason");
            $(columnElement).html("<div class='text-right' style='font-weight: bold; float: right'>" + inventoryCountingTranslation.TOTAL + ": </div>");
            columnElement = grid.getFooterRowColumn("debitAmount");
            $(columnElement).html('<div style="font-weight: bold; float: right">' + total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' VNĐ' + '</div>');
        },
    };

    inventoryCountingSetting.gridChild = {
        grvInventoryCountingDetail: {
            url: 'api/pos/inventoryCountingDetail/get',
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

                editable: true,
                autoEdit: true,
                enableAddRow: false,

                createFooterRow: true,
                showFooterRow: true,
                footerRowHeight: 50
            },
            columns: [
                //{ id: 'itemId', field: 'itemId', dataType: 'text', filterable: true, name: inventoryCountingTranslation.ITEMID, width: 100, sortable: true, editor: Slick.Editors.Text },
                {
                    id: 'barcode', field: 'itemId', name: inventoryCountingTranslation.ITEMID, width: 150, sortable: true, dataType: 'select', listName: 'listItem',
                    editor: Slick.Editors.Combobox,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && inventoryCountingSetting.valuelist.listItem) {
                            var item = inventoryCountingSetting.valuelist.listItem.find(x => x.id == value);
                            if (item)
                                return item.text;
                            return null
                        }
                    }
                },
                {
                    id: 'itemName', field: 'itemId', name: inventoryCountingTranslation.ITEMNAME, width: 400, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && inventoryCountingSetting.valuelist.listItem) {
                            var item = inventoryCountingSetting.valuelist.listItem.find(x => x.id == value);
                            if (item) return item.name;
                            return null
                        }
                    }
                },
                {
                    id: 'quantity', field: 'quantity', name: inventoryCountingTranslation.QUANTITY, width: 150, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && inventoryCountingSetting.valuelist.listItem) {
                            var item = inventoryCountingSetting.valuelist.listItem.find(x => x.id == value);
                            //if (item) {
                            //    dataContext.quantity = item.sum;
                            //}
                            //else
                            //    dataContext.quantity = 0

                            return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                        }
                    }
                },
                {
                    id: 'actualQuantity', field: 'actualQuantity', dataType: 'number', name: inventoryCountingTranslation.ACTUALQUANTITY, width: 150, sortable: true, opt: { min: 0 },
                    editor: Slick.Editors.Integer,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                    }
                },


                { id: 'difference', field: 'difference', dataType: 'text', filterable: true, name: inventoryCountingTranslation.DIFFERENCE, width: 150, sortable: true, editor: Slick.Editors.Text },
                {
                    id: 'differeceAmount', field: 'differeceAmount', dataType: 'number', name: inventoryCountingTranslation.DIFFERECEAMOUNT, width: 150, sortable: true, editor: Slick.Editors.Integer,
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
                    name: '#',
                    width: 40, minWidth: 40, maxWidth: 40, filterable: false,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var icon = dataContext.selectedItemImport ? "bowtie-checkbox" : "bowtie-checkbox-empty";
                        return '<span> ' +
                            '<i class="selectedItemImport bowtie-icon ' + icon + '" style="font-size:18px;"></i >' +
                            '</span> ';
                    }
                },
                { id: 'itemBarcode', field: 'barcode', dataType: 'text', name: inventoryCountingTranslation.BARCODE, minWidth: 200, sortable: true },
                { id: 'itemSKU', field: 'sku', dataType: 'text', name: inventoryCountingTranslation.SKU, minWidth: 200, sortable: true },
                { id: 'itemName', field: 'name', dataType: 'text', name: inventoryCountingTranslation.ITEMNAME, minWidth: 450, sortable: true },
                {
                    id: 'itemQuantity', field: 'quantity', dataType: 'number', name: inventoryCountingTranslation.QUANTITY, width: 150, sortable: true, editor: Slick.Editors.Integer,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (!value) dataContext.quantity = 1;

                        return parseFloat(dataContext.quantity).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                    }
                },
            ],
        }
    };

    inventoryCountingSetting.required = [
        "docDate", "storeId"
    ];
    inventoryCountingSetting.validate = {
        docDate: { required: true },
        storeId: { required: true }
    };
    inventoryCountingSetting.readonly = [
        "status"
    ];
}
