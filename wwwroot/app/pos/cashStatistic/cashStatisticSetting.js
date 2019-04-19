var cashStatisticSetting = {
    view: {
        module: 'pos',
        formName: 'cashStatistic',
        gridName: 'grvCashStatistic',
    }
};

function cashStatisticInitSetting() {
    cashStatisticSetting.valuelist = {};

    cashStatisticSetting.grid = {
        url: 'api/pos/cashStatistic/get',

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
            //{ id: 'id', field: 'id', dataType: 'text', name: cashStatisticTranslation.CODE, minWidth: 200, sortable: true },
            { id: 'code', field: 'code', dataType: 'text', name: cashStatisticTranslation.CODE, minWidth: 150, sortable: true },
            //{ id: 'docDate', field: 'docDate', dataType: 'text', name: cashStatisticTranslation.DOCDATE, width: 100, sortable: true },           
            {
                id: "docDate", field: "docDate", name: cashStatisticTranslation.DOCDATE, width: 150, defaultWidth: 150, sortable: true, dataType: 'datetime', formatter: Slick.Formatters.Date
            },
            {
                id: 'cashType', field: 'cashType', dataType: 'select', listName: 'gender', name: cashStatisticTranslation.CASHTYPE, width: 100, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value) {
                        var checkExist = cashStatisticSetting.valuelist.cashType.find(x => x.id == value);
                        if (checkExist)
                            return checkExist.text;
                        else
                            return '';
                    }
                }
            },       
            { id: 'objectName', field: 'objectName', dataType: 'text', name: cashStatisticTranslation.OBJECTNAME, width: 200, sortable: true },
            { id: 'memo', field: 'memo', dataType: 'text', name: cashStatisticTranslation.MEMO, width: 300, sortable: true },
            {
                id: 'debitAmount', field: 'debitAmount', name: cashStatisticTranslation.DEBITAMOUNT, width: 200, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                }
            },
            {
                id: 'creditAmount', field: 'creditAmount', name: cashStatisticTranslation.CREDITAMOUNT, width: 200, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                }
            },           
        ],
    };
    cashStatisticSetting.required = [
        
    ];
    cashStatisticSetting.validate = {
        
    }
}
