var pricePolicySetting = {
    view: {
        module: 'pos',
        formName: 'pricePolicy',
        gridName: 'grvPricePolicy',
    }
};

function pricePolicyInitSetting() {
    pricePolicySetting.valuelist = {};

    pricePolicySetting.gridChild = {
        grvPricePolicy: {
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
                    id: 'sku', field: 'sku', name: pricePolicyTranslation.SKU, width: 150, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (pricePolicySetting.valuelist.listItem) {
                            var item = pricePolicySetting.valuelist.listItem.find(x => x.id == dataContext.itemID);
                            if (item)
                                return item.text;
                            return null
                        }
                    }
                },
                {
                    id: 'name', field: 'name', name: pricePolicyTranslation.ITEMNAME, width: 200, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (pricePolicySetting.valuelist.listItem) {
                            var item = pricePolicySetting.valuelist.listItem.find(x => x.id == dataContext.itemID);
                            if (item)
                                return item.name;
                            return null
                        }
                    }
                },
                {
                    id: 'groupId', field: 'groupId', name: pricePolicyTranslation.ITEMGROUP, width: 100, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (pricePolicySetting.valuelist.listItem) {
                            var item = pricePolicySetting.valuelist.listItem.find(x => x.id == dataContext.itemID);
                            if (item)
                                return item.group;
                            return null
                        }
                    }
                },
                {
                    id: 'uom', field: 'uom', name: pricePolicyTranslation.UOM, width: 100, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (pricePolicySetting.valuelist.listItem) {
                            var item = pricePolicySetting.valuelist.listItem.find(x => x.id == dataContext.itemID);
                            if (item)
                                return item.unit;
                            return null
                        }
                    }
                },
                {
                    id: 'breakPoint', field: 'breakPoint', dataType: 'number', name: pricePolicyTranslation.BREAKPOINT, width: 100, sortable: true,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                    }
                },
                {
                    id: 'sellPrice', field: 'sellPrice', name: pricePolicyTranslation.OLDSELLPRICE, width: 150, sortable: true, dataType: 'number',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (pricePolicySetting.valuelist.listItem) {
                            var item = pricePolicySetting.valuelist.listItem.find(x => x.id == dataContext.itemID);
                            if (item)
                                return item.sellPrice.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                            return null
                        }
                    }
                },
                {
                    id: 'sellPrice', field: 'sellPrice', name: pricePolicyTranslation.SELLPRICE, width: 150, sortable: true, dataType: 'number',
                    formatter: Slick.Formatters.Number
                },
                {
                    id: 'discPercent', field: 'discPercent', name: pricePolicyTranslation.PROMOTION, width: 150, sortable: true, dataType: 'number',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value) {
                            return value + ' %';
                        }
                        return null
                    }
                },
                {
                    id: 'discAmount', field: 'discAmount', name: pricePolicyTranslation.DISCOUNT, width: 150, sortable: true, dataType: 'number',
                    formatter: Slick.Formatters.Number
                },
                {
                    id: 'finalAmount', field: 'finalAmount', name: pricePolicyTranslation.TOTALPRICE, width: 150, sortable: true, dataType: 'number',
                    formatter: Slick.Formatters.Number
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
                    id: 'code', field: 'code', name: pricePolicyTranslation.STORECODE, width: 150, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },
                {
                    id: 'name', field: 'name', name: pricePolicyTranslation.STORENAME, width: 350, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },
                {
                    id: 'primaryStreet', field: 'primaryStreet', name: pricePolicyTranslation.STOREPRIMARYSTREET, width: 400, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },
            ],
        },

        //Detail

        grvPricePolicyDetail: {
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
                    id: 'sku', field: 'itemID', name: pricePolicyTranslation.SKU, width: 150, sortable: true, dataType: 'select', listName: 'listItem',
                    editor: Slick.Editors.Combobox,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && pricePolicySetting.valuelist.listItem) {
                            var item = pricePolicySetting.valuelist.listItem.find(x => x.id == value);
                            if (item)
                                return item.text;
                            return null
                        }
                        return null;
                    }
                },
                {
                    id: 'name', field: 'itemID', name: pricePolicyTranslation.ITEMNAME, width: 150, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && pricePolicySetting.valuelist.listItem) {
                            var item = pricePolicySetting.valuelist.listItem.find(x => x.id == value);
                            if (item) return item.name;
                            return null
                        }
                        return null;
                    }
                },

                {
                    id: 'groupId', field: 'itemID', name: pricePolicyTranslation.ITEMGROUP, width: 150, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && pricePolicySetting.valuelist.listItem) {
                            var item = pricePolicySetting.valuelist.listItem.find(x => x.id == value);
                            if (item) return item.group;
                            return null
                        }
                        return null;
                    }
                },

                {
                    id: 'UMID', field: 'itemID', name: pricePolicyTranslation.UOM, width: 100, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && pricePolicySetting.valuelist.listItem) {
                            var item = pricePolicySetting.valuelist.listItem.find(x => x.id == value);
                            if (item) return item.unit;
                        }
                        return null;
                    }
                },
                {
                    id: 'breakPoint', field: 'breakPoint', dataType: 'number', name: pricePolicyTranslation.BREAKPOINT, width: 100, sortable: true, opt: { min: 1 },
                    editor: Slick.Editors.Integer,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                    }
                },
                {
                    id: 'oldSellPrice', field: 'itemID', name: pricePolicyTranslation.OLDSELLPRICE, width: 100, sortable: true, dataType: 'text',

                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (pricePolicySetting.valuelist.listItem) {
                            var item = pricePolicySetting.valuelist.listItem.find(x => x.id == dataContext.itemID);
                            if (item) {
                                //dataContext.sellPrice = item.sellPrice;
                                return item.sellPrice.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });;
                            }
                        }
                        return null;
                    }
                },
                {
                    id: 'sellPrice', field: 'sellPrice', name: pricePolicyTranslation.SELLPRICE, width: 100, sortable: true, dataType: 'text',
                    editor: Slick.Editors.Integer,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value) {
                            dataContext.sellPrice = value;
                            return value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                        }
                        return null;
                    }
                },
                {
                    id: 'discPercent', field: 'discPercent', name: pricePolicyTranslation.PROMOTION, width: 100, sortable: true, dataType: 'number',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (pricePolicySetting.discPercent != undefined) {
                            dataContext.discPercent = pricePolicySetting.discPercent;
                            return pricePolicySetting.discPercent.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                        }
                        return 0;
                    }
                },
                {
                    id: 'discAmount', field: 'discAmount', name: pricePolicyTranslation.DISCOUNT, width: 100, sortable: true, dataType: 'number',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (pricePolicySetting.discAmount != undefined) {
                            dataContext.discAmount = pricePolicySetting.discAmount;
                            return dataContext.discAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });;
                        }
                        return 0;
                    }
                },
                {
                    id: 'finalAmount', field: 'finalAmount', name: pricePolicyTranslation.TOTALPRICE, width: 100, sortable: true, dataType: 'number',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (!dataContext.finalAmount)
                            dataContext.finalAmount = 0;
                        var thisSellPrice = 0;
                        var item = pricePolicySetting.valuelist.listItem.find(x => x.id == dataContext.itemID);
                        if (!item)
                            return 0;
                        if (pricePolicySetting.valuelist.listItem) {

                            if (dataContext.sellPrice != undefined && dataContext.sellPrice != 0) {
                                thisSellPrice = dataContext.sellPrice;
                            }
                            else
                                thisSellPrice = item.sellPrice;

                        }
                        if (dataContext.discPercent != undefined && dataContext.discPercent > 0) {
                            dataContext.finalAmount = thisSellPrice - thisSellPrice * (dataContext.discPercent / 100);
                        }
                        else if (dataContext.discAmount != undefined && dataContext.discAmount > 0) {
                            dataContext.finalAmount = thisSellPrice - dataContext.discAmount;
                        }
                        if (dataContext.finalAmount != undefined || dataContext.finalAmount != null)
                            return dataContext.finalAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                        else
                            return thisSellPrice.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });;

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
                    id: 'code', field: 'code', name: pricePolicyTranslation.STORECODE, width: 150, sortable: true, dataType: 'text', editor: Slick.Editors.Text,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },
                {
                    id: 'name', field: 'name', name: pricePolicyTranslation.STORENAME, width: 450, sortable: true, dataType: 'text', editor: Slick.Editors.Text,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },
                {
                    id: 'primaryStreet', field: 'primaryStreet', name: pricePolicyTranslation.STOREPRIMARYSTREET, width: 480, dataType: 'text', editor: Slick.Editors.Text,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },
            ],
        },

    };

    //pricePolicySetting.required = ['deliverer', 'objectType', 'storeId'];

    //pricePolicySetting.readonly = [];

    //pricePolicySetting.validate = {
    //    deliverer: { required: true },
    //    objectType: { required: true },
    //    storeId: { required: true }
    //}
    pricePolicySetting.required = ['name', 'priority', 'policyDate', 'effFromDate', 'effToDate'];

    pricePolicySetting.readonly = [];

    pricePolicySetting.validate = {
        name: { required: true },
        priority: { required: true },
        //promoType: { required: true },
        policyDate: { required: true },
        effFromDate: { required: true },
        effToDate: { required: true },
        //effFromTime: { required: true },
        //effToTime: { required: true },
    }
}