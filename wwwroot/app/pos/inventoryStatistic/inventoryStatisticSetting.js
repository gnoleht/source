var inventoryStatisticSetting = {
    view: {
        module: 'pos',
        formName: 'inventoryStatistic',
        gridName: 'grvInventoryStatistic',
    }
};

function inventoryStatisticInitSetting() {
    inventoryStatisticSetting.valuelist = {};

    inventoryStatisticSetting.grid = {
        url: 'api/pos/inventoryStatistic/GetInventoryStatistic',

        options: {
            rowHeight: 40,
            topPanelHeight: 35,

            showHeaderRow: true,
            headerRowHeight: 0,

            allowOrder: false,
            allowFilter: false,
            allowCustom: true,

            allowGroup: true,
            autoHeight: false,
            fullWidthRows: true,
            multiColumnSort: true,

            enableColumnReorder: false,
            enableCellNavigation: true,
            explicitInitialization: true,

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
                id: "itemInfo", name: inventoryStatisticTranslation.ITEMINFO, children: [
                    {
                        id: "sku", field: "sku", name: inventoryStatisticTranslation.SKU, width: 150, defaultWidth: 100, sortable: true, dataType: 'text',
                        formatter: function (row, cell, value, columnDef, dataContext) {
                            return value;
                        }
                    },
                    {
                        id: "name", field: "name", name: inventoryStatisticTranslation.NAME, width: 380, defaultWidth: 300, sortable: true, dataType: 'text',
                        formatter: function (row, cell, value, columnDef, dataContext) {
                            return value;
                        }
                    },
                    {
                        id: "unit", field: "unit", name: inventoryStatisticTranslation.UNIT, width: 100, defaultWidth: 100, sortable: true, dataType: 'text',
                        formatter: function (row, cell, value, columnDef, dataContext) {
                            if (value && inventoryStatisticSetting.valuelist.listUnit) return inventoryStatisticSetting.valuelist.listUnit.find(x => x.id == value).name;
                        }
                    },
                ]
            },
            {
                id: "openStock", name: inventoryStatisticTranslation.OPENINGSTOCK, children: [
                    {
                        id: "quantityOpenStock", field: "openingStock.quantity", name: inventoryStatisticTranslation.QUANTITY, width: 120, defaultWidth: 200, sortable: true, dataType: 'text',
                        formatter: function (row, cell, value, columnDef, dataContext) {
                            return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                        }
                    },
                    {
                        id: "amountOpenStock", field: "openingStock.amount", name: inventoryStatisticTranslation.AMOUNT, width: 150, defaultWidth: 200, sortable: true, dataType: 'text',
                        formatter: function (row, cell, value, columnDef, dataContext) {
                            return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                        }
                    },
                ]
            },     
            {
                id: "import", name: inventoryStatisticTranslation.IMPORT, children: [
                    {
                        id: "quantityImport", field: "import.quantity", name: inventoryStatisticTranslation.QUANTITY, width: 120, defaultWidth: 200, sortable: true, dataType: 'text',
                        formatter: function (row, cell, value, columnDef, dataContext) {
                            return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                        }
                    },
                    {
                        id: "amountImport", field: "import.amount", name: inventoryStatisticTranslation.AMOUNT, width: 150, defaultWidth: 200, sortable: true, dataType: 'text', 
                        formatter: function (row, cell, value, columnDef, dataContext) {
                            return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                        }
                    },
                ]
            },
            {
                id: "export", name: inventoryStatisticTranslation.EXPORT, children: [
                    {
                        id: "quantityExport", field: "export.quantity", name: inventoryStatisticTranslation.QUANTITY, width: 120, defaultWidth: 200, sortable: true, dataType: 'text', 
                        formatter: function (row, cell, value, columnDef, dataContext) {
                            return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                        }
                    },
                    {
                        id: "amountExport", field: "export.amount", name: inventoryStatisticTranslation.AMOUNT, width: 150, defaultWidth: 100, sortable: true, dataType: 'text', 
                        formatter: function (row, cell, value, columnDef, dataContext) {
                            return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                        }
                    },
                ]
            },
            {
                id: "closingStock", name: inventoryStatisticTranslation.CLOSINGSTOCK, children: [
                    {
                        id: "quantityClosingStock", field: "closingStock.quantity", name: inventoryStatisticTranslation.QUANTITY, width: 120, defaultWidth: 200, sortable: true, dataType: 'text',
                        formatter: function (row, cell, value, columnDef, dataContext) {
                            return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                        }
                    },
                    {
                        id: "amountClosingStock", field: "closingStock.amount", name: inventoryStatisticTranslation.AMOUNT, width: 150, defaultWidth: 200, sortable: true, dataType: 'text',
                        formatter: function (row, cell, value, columnDef, dataContext) {
                            return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                        }
                    },
                ]
            }
        ],
    };

    inventoryStatisticSetting.gridChild = {
        grvWorst : {
            url: 'api/pos/inventoryStatistic/GetStatisticSell',

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
                    id: "#", name: "#", width: 50, defaultWidth: 50, sortable: false, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return row + 1;
                    }
                },
                {
                    id: "sku2", field: "sku", name: inventoryStatisticTranslation.SKU, width: 250, defaultWidth: 150, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },
                {
                    id: "name2", field: "name", name: inventoryStatisticTranslation.NAME, width: 600, defaultWidth: 300, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },
                {
                    id: "monthQuantity2", field: "monthQuantity", name: inventoryStatisticTranslation.MONTHQUANTITY, width: 200, defaultWidth: 200, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },
                {
                    id: "quarterQuantity2", field: "quarterQuantity", name: inventoryStatisticTranslation.QUARTERQUANTITY, sortable: true, width: 200, defaultWidth: 200,
                    minWidth: 70, maxWidth: 150, filterable: false,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },
                {
                    id: "yearQuantity2", field: "yearQuantity", name: inventoryStatisticTranslation.YEARQUANTITY, width: 200, defaultWidth: 200, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },
                {
                    id: "previousYearQuantity2", field: "previousYearQuantity", name: inventoryStatisticTranslation.PREVIOUSYEARQUANTITY, width: 200, defaultWidth: 200, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },
            ],
        },

        grvBest:
        {
            url: 'api/pos/inventoryStatistic/GetStatisticSell',

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
                    id: "#", name: "#", width: 50, defaultWidth: 50, sortable: false, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return row + 1;
                    }
                },
                {
                    id: "sku", field: "sku", name: inventoryStatisticTranslation.SKU, width: 250, defaultWidth: 150, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },
                {
                    id: "name", field: "name", name: inventoryStatisticTranslation.NAME, width: 600, defaultWidth: 300, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },
                {
                    id: "monthQuantity", field: "monthQuantity", name: inventoryStatisticTranslation.MONTHQUANTITY, width: 200, defaultWidth: 200, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                    }
                },
                {
                    id: "quarterQuantity", field: "quarterQuantity", name: inventoryStatisticTranslation.QUARTERQUANTITY, sortable: true, width: 200, defaultWidth: 200,
                    minWidth: 70, maxWidth: 150, filterable: false,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                    }
                },
                {
                    id: "yearQuantity", field: "yearQuantity", name: inventoryStatisticTranslation.YEARQUANTITY, width: 200, defaultWidth: 200, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                    }
                },
                {
                    id: "previousYearQuantity", field: "previousYearQuantity", name: inventoryStatisticTranslation.PREVIOUSYEARQUANTITY, width: 200, defaultWidth: 200, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                    }
                },
            ],
        }

    };


    inventoryStatisticSetting.required = [];

    inventoryStatisticSetting.validate = {
    
    }
}