var zoneSetting = {
    view: {
        module: 'pos',
        formName: 'zone',
        gridName: 'grvZone',
    }
};

function zoneInitSetting() {
    zoneSetting.valuelist = {};

    zoneSetting.grid = {
        url: 'api/pos/zone/get',

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
            { id: 'code', field: 'code', dataType: 'text', name: zoneTranslation.CODE, minWidth: 200, sortable: true },
            { id: 'name', field: 'name', dataType: 'text', name: zoneTranslation.NAME, width: 300, sortable: true },
            { id: 'note', field: 'note', dataType: 'text', name: zoneTranslation.NOTE, width: 400, sortable: true },
            //{
            //    id: 'storeRelated', field: 'storeRelated', dataType: 'text', fieldFilter: 'name', name: zoneTranslation.STORERELATED, width: 300, sortable: true,
            //    formatter: function (row, cell, value, columnDef, dataContext) {
            //        if (dataContext.storeRelated) {
            //            return dataContext.storeRelated.name;
            //        }

            //        return value;
            //    }
            //},           
            {
                id: "active", field: "active", name: zoneTranslation.ACTIVE, sortable: true, width: 100, defaultWidth: 100, cssClass: 'center',
                minWidth: 70, maxWidth: 150, filterable: true, dataType: 'boolen',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var icon = dataContext.active ? "bowtie-checkbox" : "bowtie-checkbox-empty";
                    return '<span> ' +
                        '<i class="checkActive bowtie-icon ' + icon + '" style="font-size:18px;"></i >' +
                        '</span> ';
                }
            },
            {
                id: "createdBy", field: "createdBy", name: zoneTranslation.CREATEDBY, width: 250, defaultWidth: 250, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext && dataContext.user) {
                        return dataContext.user.displayName;
                    }
                    return '';
                }
            },
            {
                id: "createdTime", field: "createdTime", name: zoneTranslation.CREATEDTIME, width: 150, defaultWidth: 150, sortable: true, dataType: 'datetime', formatter: Slick.Formatters.Date
            },
        ],
    };
    zoneSetting.required = [
        "name", "code", "storeId"
    ];
    zoneSetting.validate = {
        code: { required: true },
        name: { required: true }
    }
}
