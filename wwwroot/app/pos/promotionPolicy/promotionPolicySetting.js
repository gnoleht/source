var promotionPolicySetting = {
    view: {
        module: 'pos',
        formName: 'promotionPolicy',
        gridName: 'grvpromotionPolicy',
    }
};

function promotionPolicyInitSetting() {
    promotionPolicySetting.valuelist = {};

    promotionPolicySetting.gridChild = {
        grvPromoBreakPoint: {
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
            },
            columns: [
                {
                    id: 'breakPoint', field: 'breakPoint', name: promotionPolicyTranslation.BREAKPOINT, width: 200, sortable: true, dataType: 'number', opt: { min: 0 },
                    formatter: Slick.Formatters.Number
                },
                {
                    id: 'quantity', field: 'quantity', name: promotionPolicyTranslation.QUANTITY, width: 200, sortable: true, dataType: 'number',
                    formatter: Slick.Formatters.Number                   
                },
                {
                    id: 'note', field: 'note', name: promotionPolicyTranslation.NOTE, width: 400, sortable: true, dataType: 'text',
                },
            ],
        },

        grvPolicyStore: {
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
            },
            columns: [
                {
                    id: 'code', field: 'code', name: promotionPolicyTranslation.STORECODE, width: 150, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },
                {
                    id: 'name', field: 'name', name: promotionPolicyTranslation.STORENAME, width: 350, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },
                {
                    id: 'primaryStreet', field: 'primaryStreet', name: promotionPolicyTranslation.STOREPRIMARYSTREET, width: 400, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },
            ],
        },

        grvPromoApply: {
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
            },
            columns: [
                {
                    id: 'groupId', field: 'groupId', name: promotionPolicyTranslation.ITEMGROUP, width: 350, sortable: true, dataType: 'text',
                },
                {
                    id: 'sku', field: 'sku', name: promotionPolicyTranslation.SKU, width: 150, sortable: true, dataType: 'text',
                },
                {
                    id: 'name', field: 'name', name: promotionPolicyTranslation.ITEMNAME, width: 350, sortable: true, dataType: 'text',
                },
                {
                    id: 'uom', field: 'uom', name: promotionPolicyTranslation.UOM, width: 100, sortable: true, dataType: 'text',
                },
                {
                    id: 'note', field: 'note', name: promotionPolicyTranslation.NOTE, width: 350, sortable: true, dataType: 'text',
                },
            ],
        },
        //Detail

        grvPromoBreakPointDetail: {
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
            },
            columns: [
                {
                    id: 'breakPoint', field: 'breakPoint', name: promotionPolicyTranslation.BREAKPOINT, width: 200, sortable: true, dataType: 'number', opt: { min: 0 },
                    editor: Slick.Editors.Integer,
                    formatter: Slick.Formatters.Number
                },
                {
                    id: 'quantity', field: 'quantity', name: promotionPolicyTranslation.QUANTITY, width: 200, sortable: true, dataType: 'number', opt: { min: 1},
                    editor: Slick.Editors.Integer,
                    formatter: Slick.Formatters.Number

                },
                {
                    id: 'note', field: 'note', name: promotionPolicyTranslation.NOTE, width: 730, sortable: true, dataType: 'text', editor: Slick.Editors.Text,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },
            ],
        },

        grvPolicyStoreDetail: {
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
            },
            columns: [
                {
                    id: 'selectedStore', field: 'selectedStore', sortable: false, filterable: false, resizable: false,
                    name: '<div> <i id="ckbAllStore" class="ckbAllStore bowtie-icon bowtie-checkbox-empty" style="cursor:pointer;font-size:18px;margin-right:13px"></i></div>',
                    width: 50,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var icon = dataContext.selectedStore ? "bowtie-checkbox" : "bowtie-checkbox-empty";
                        return '<span> ' +
                            '<i class="selectedStore bowtie-icon ' + icon + '" style="font-size:18px;"></i >' +
                            '</span> ';
                    }
                },
                {
                    id: 'code', field: 'code', name: promotionPolicyTranslation.STORECODE, width: 150, sortable: true, dataType: 'text', editor: Slick.Editors.Text,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },
                {
                    id: 'name', field: 'name', name: promotionPolicyTranslation.STORENAME, width: 450, sortable: true, dataType: 'text', editor: Slick.Editors.Text,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },
                {
                    id: 'primaryStreet', field: 'primaryStreet', name: promotionPolicyTranslation.STOREPRIMARYSTREET, width: 480, dataType: 'text', editor: Slick.Editors.Text,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },
            ],
        },

        grvPromoApplyDetail: {
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
            },
            columns: [
                {
                    id: 'sku', field: 'itemId', name: promotionPolicyTranslation.SKU, width: 150, sortable: true, dataType: 'select', listName: 'listItem',
                    editor: Slick.Editors.Combobox,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && promotionPolicySetting.valuelist.listItem) {
                            var item = promotionPolicySetting.valuelist.listItem.find(x => x.id == value);
                            if (item)
                                return item.text;
                            return null
                        }
                    }
                },
                {
                    id: 'name', field: 'itemId', name: promotionPolicyTranslation.ITEMNAME, width: 350, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && promotionPolicySetting.valuelist.listItem) {
                            var item = promotionPolicySetting.valuelist.listItem.find(x => x.id == value);
                            if (item) return item.name;
                            return null
                        }
                    }
                },

                {
                    id: 'groupId', field: 'itemId', name: promotionPolicyTranslation.ITEMGROUP, width: 200, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && promotionPolicySetting.valuelist.listItem) {
                            var item = promotionPolicySetting.valuelist.listItem.find(x => x.id == value);
                            if (item) return item.group;
                            return null
                        }
                    }
                },

                {
                    id: 'UMID', field: 'itemId', name: promotionPolicyTranslation.UOM, width: 100, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && promotionPolicySetting.valuelist.listItem) {
                            var item = promotionPolicySetting.valuelist.listItem.find(x => x.id == value);
                            if (item) return item.unit;
                        }
                    }
                },
                {
                    id: 'note', field: 'note', name: promotionPolicyTranslation.NOTE, width: 330, sortable: true, dataType: 'text', editor: Slick.Editors.Text,
                    //formatter: function (row, cell, value, columnDef, dataContext) {
                    //    return value;
                    //}
                },
            ],
        },

        grvPromoItemDetail: {
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
            },
            columns: [
                {
                    id: 'sku', field: 'itemId', name: promotionPolicyTranslation.SKU, width: 200, sortable: true, dataType: 'select', listName: 'listItem',
                    editor: Slick.Editors.Combobox,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && promotionPolicySetting.valuelist.listItem) {
                            
                            var item = promotionPolicySetting.valuelist.listItem.find(x => x.id == value);
                            if (item)
                                return item.text;
                            return null
                        }
                    }
                },
                {
                    id: 'name', field: 'itemId', name: promotionPolicyTranslation.ITEMNAME, width: 480, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && promotionPolicySetting.valuelist.listItem) {
                            var item = promotionPolicySetting.valuelist.listItem.find(x => x.id == value);
                            if (item) return item.name;
                            return null
                        }
                    }
                },

                {
                    id: 'groupId', field: 'itemId', name: promotionPolicyTranslation.ITEMGROUP, width: 250, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && promotionPolicySetting.valuelist.listItem) {
                            var item = promotionPolicySetting.valuelist.listItem.find(x => x.id == value);
                            if (item) return item.group;
                            return null
                        }
                    }
                },

                {
                    id: 'UMID', field: 'itemId', name: promotionPolicyTranslation.UOM, width: 200, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && promotionPolicySetting.valuelist.listItem) {
                            var item = promotionPolicySetting.valuelist.listItem.find(x => x.id == value);
                            if (item) return item.unit;
                        }
                    }
                },
            ],
        },
    };

    promotionPolicySetting.required = ['name', 'priority', 'promoType', 'policyDate', 'effFromDate', 'effToDate'];

    promotionPolicySetting.readonly = [];

    promotionPolicySetting.validate = {
        name: { required: true },
        priority: { required: true },
        promoType: { required: true },
        policyDate: { required: true },
        effFromDate: { required: true },
        effToDate: { required: true },
        //effFromTime: { required: true }, 
        //effToTime: { required: true }, 
    }
}