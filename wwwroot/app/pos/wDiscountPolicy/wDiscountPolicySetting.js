var wDiscountPolicySetting = {
    view: {
        module: 'pos',
        formName: 'wDiscountPolicy',
        gridName: 'grvwDiscountPolicy',
    }
};

function wDiscountPolicyInitSetting() {
    wDiscountPolicySetting.valuelist = {};
    
    wDiscountPolicySetting.gridChild = {
        grvWDiscDetail: {
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
                    id: 'breakPoint', field: 'breakPoint', name: wDiscountPolicyTranslation.BREAKPOINT, width: 200, sortable: true, dataType: 'number', 
                    formatter: Slick.Formatters.Number
                },
                {
                    id: 'discPercent', field: 'discPercent', name: wDiscountPolicyTranslation.DISCPERCENT, width: 200, sortable: true, dataType: 'number',
                    formatter: Slick.Formatters.Number
                },
                {
                    id: 'note', field: 'note', name: wDiscountPolicyTranslation.NOTE, width: 400, sortable: true, dataType: 'text',       
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
                    id: 'code', field: 'code', name: wDiscountPolicyTranslation.STORECODE, width: 150, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },
                {
                    id: 'name', field: 'name', name: wDiscountPolicyTranslation.STORENAME, width: 350, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },
                {
                    id: 'primaryStreet', field: 'primaryStreet', name: wDiscountPolicyTranslation.STOREPRIMARYSTREET, width: 400, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },                
            ],
        },
        //Detail

        grvWDiscDetailDetail: {
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
                    id: 'breakPoint', field: 'breakPoint', name: wDiscountPolicyTranslation.BREAKPOINT, width: 200, sortable: true, dataType: 'number', opt: {min: 0, max:100000000000000 },
                    editor: Slick.Editors.Integer,
                    formatter: Slick.Formatters.Number
                },
                {
                    id: 'discPercent', field: 'discPercent', name: wDiscountPolicyTranslation.DISCPERCENT, width: 200, sortable: true, dataType: 'number', opt: { min: 0,max:100 },
                    editor: Slick.Editors.Integer,
                    formatter: Slick.Formatters.Number
                },
                {
                    id: 'note', field: 'note', name: wDiscountPolicyTranslation.NOTE, width: 730, sortable: true, dataType: 'text', editor: Slick.Editors.Text,
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
                    id: 'code', field: 'code', name: wDiscountPolicyTranslation.STORECODE, width: 150, sortable: true, dataType: 'text', editor: Slick.Editors.Text,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },
                {
                    id: 'name', field: 'name', name: wDiscountPolicyTranslation.STORENAME, width: 450, sortable: true, dataType: 'text', editor: Slick.Editors.Text,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },
                {
                    id: 'primaryStreet', field: 'primaryStreet', name: wDiscountPolicyTranslation.STOREPRIMARYSTREET, width: 480, dataType: 'text', editor: Slick.Editors.Text,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },
            ],
        },
    };

    wDiscountPolicySetting.required = ['name', 'priority', 'promoType', 'policyDate', 'effFromDate', 'effToDate'];

    wDiscountPolicySetting.readonly = [];

    wDiscountPolicySetting.validate = {
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