var cashReasonSetting = {
    view: {
        module: 'pos',
        formName: 'cashReason',
        gridName: 'grvCashReason',
    }
};

function cashReasonInitSetting() {
    cashReasonSetting.valuelist = {};

    cashReasonSetting.grid = {
        url: 'api/pos/cashReason/get',

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
            { id: 'code', field: 'code', dataType: 'text', name: cashReasonTranslation.CODE, minWidth: 200, sortable: true },
            { id: 'name', field: 'name', dataType: 'text', name: cashReasonTranslation.NAME, width: 300, sortable: true },            
            {
                id: 'type', field: 'type', dataType: 'select', listName: 'type', name: cashReasonTranslation.TYPE, width: 300, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value) {
                        var temp = cashReasonSetting.valuelist.type.find(x => x.id == value);
                        if (temp)
                            return temp.text;
                        else
                            return value;
                    }

                    return value;
                }
            },  
            {
                id: 'storeRelated', field: 'storeRelated', dataType: 'text', fieldFilter: 'name', name: cashReasonTranslation.STORERELATED, width: 300, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.storeRelated) {
                        return dataContext.storeRelated.name;
                    }

                    return value;
                }
            },           
            { id: 'note', field: 'note', dataType: 'text', name: cashReasonTranslation.NOTE, width: 400, sortable: true },

            {
                id: "createdBy", field: "createdBy", name: cashReasonTranslation.CREATEDBY, width: 250, defaultWidth: 250, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext && dataContext.user) {
                        return dataContext.user.displayName;
                    }
                    return '';
                }
            },
            {
                id: "createdTime", field: "createdTime", name: cashReasonTranslation.CREATEDTIME, width: 150, defaultWidth: 150, sortable: true, dataType: 'datetime', formatter: Slick.Formatters.Date
            },
        ],
    };
    cashReasonSetting.required = [
        "name", "code", "type"
    ];
    cashReasonSetting.validate = {
        code: { required: true },
        name: { required: true },
        type: { required: true },
    }
}
