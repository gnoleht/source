var cashDiscPolicySetting = {
    view: {
        module: 'pos',
        formName: 'cashDiscPolicy',
        gridName: 'grvcashDiscPolicy',
    }
};

function cashDiscPolicyInitSetting() {
    cashDiscPolicySetting.valuelist = {};
    
    cashDiscPolicySetting.gridChild = { 
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
                    id: 'code', field: 'code', name: cashDiscPolicyTranslation.STORECODE, width: 150, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },
                {
                    id: 'name', field: 'name', name: cashDiscPolicyTranslation.STORENAME, width: 350, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },
                {
                    id: 'primaryStreet', field: 'primaryStreet', name: cashDiscPolicyTranslation.STOREPRIMARYSTREET, width: 400, dataType: 'text',
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
                    id: 'code', field: 'code', name: cashDiscPolicyTranslation.STORECODE, width: 150, sortable: true, dataType: 'text', editor: Slick.Editors.Text,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },
                {
                    id: 'name', field: 'name', name: cashDiscPolicyTranslation.STORENAME, width: 450, sortable: true, dataType: 'text', editor: Slick.Editors.Text,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },
                {
                    id: 'primaryStreet', field: 'primaryStreet', name: cashDiscPolicyTranslation.STOREPRIMARYSTREET, width: 480, dataType: 'text', editor: Slick.Editors.Text,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    }
                },
            ],
        },

    };

    cashDiscPolicySetting.required = ['name', 'priority', 'policyDate', 'bankCardTypeId', 'effFromDate', 'effToDate', 'effFromTime', 'effToTime'];

    cashDiscPolicySetting.readonly = [];

    cashDiscPolicySetting.validate = {
        name: { required: true },     
        priority: { required: true },          
        policyDate: { required: true },      
        bankCardTypeId: { required: true },  
        effFromDate: { required: true },      
        effToDate: { required: true },  
        //effFromTime: { required: true },
        //effToTime: { required: true },  
    }
}