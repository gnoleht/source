var bankSetting = {
    view: {
        module: 'pos',
        formName: 'bank',
        gridName: 'grvBank',
    }
};

function bankInitSetting() {
    bankSetting.valuelist = {};

    bankSetting.grid = {
        url: 'api/pos/bank/get',

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
            { id: 'code', field: 'code', dataType: 'text', name: bankTranslation.CODE, minWidth: 200, sortable: true },
            { id: 'name', field: 'name', dataType: 'text', name: bankTranslation.NAME, width: 300, sortable: true },
            { id: 'note', field: 'note', dataType: 'text', name: bankTranslation.NOTE, width: 400, sortable: true },
            //{
            //    id: 'storeRelated', field: 'storeRelated', dataType: 'text', fieldFilter: 'name', name: bankTranslation.STORERELATED, width: 300, sortable: true,
            //    formatter: function (row, cell, value, columnDef, dataContext) {
            //        if (dataContext.storeRelated) {
            //            return dataContext.storeRelated.name;
            //        }

            //        return value;
            //    }
            //},           
            {
                id: "active", field: "active", name: bankTranslation.ACTIVE, sortable: true, width: 100, defaultWidth: 100, cssClass: 'center',
                minWidth: 70, maxWidth: 150, filterable: true, dataType: 'boolen',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var icon = dataContext.active ? "bowtie-checkbox" : "bowtie-checkbox-empty";
                    return '<span> ' +
                        '<i class="checkActive bowtie-icon ' + icon + '" style="font-size:18px;"></i >' +
                        '</span> ';
                }
            },
        ],
    };
    bankSetting.required = [
        "name", "code"
    ];
    bankSetting.validate = {
        code: { required: true },
        name: { required: true }
    }
}
