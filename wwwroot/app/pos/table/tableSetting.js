var tableSetting = {
    view: {
        module: 'pos',
        formName: 'table',
        gridName: 'grvTable',
    }
};

function tableInitSetting() {
    tableSetting.valuelist = {};

    tableSetting.grid = {
        url: 'api/pos/table/get',

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
            { id: 'code', field: 'code', dataType: 'text', name: tableTranslation.CODE, minWidth: 200, sortable: true },
            { id: 'name', field: 'name', dataType: 'text', name: tableTranslation.NAME, width: 300, sortable: true },
            {
                id: "zoneId", field: "zoneId", name: tableTranslation.ZONEID, width: 250, defaultWidth: 250, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext && dataContext.relatedZone) {
                        return dataContext.relatedZone.name;
                    }
                    return '';
                }
            },
            {
                id: 'status', field: 'status', dataType: 'text', name: tableTranslation.STATUS, width: 200, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (tableSetting.valuelist.status) {
                        var temp = tableSetting.valuelist.status.find(x => x.id == value);
                        if (temp)
                            return temp.text;
                    }

                    return value;
                }
            },
            {
                id: "checkIN", field: "checkIN", name: tableTranslation.CHECKIN, width: 150, defaultWidth: 150, sortable: true, dataType: 'text', formatter: Slick.Formatters.Date
            },
            {
                id: "checkOUT", field: "checkOUT", name: tableTranslation.CHECKOUT, width: 150, defaultWidth: 150, sortable: true, dataType: 'text', formatter: Slick.Formatters.Date
            },

            { id: 'note', field: 'note', dataType: 'text', name: tableTranslation.NOTE, width: 300, sortable: true },
            //{
            //    id: 'storeRelated', field: 'storeRelated', dataType: 'text', fieldFilter: 'name', name: tableTranslation.STORERELATED, width: 300, sortable: true,
            //    formatter: function (row, cell, value, columnDef, dataContext) {
            //        if (dataContext.storeRelated) {
            //            return dataContext.storeRelated.name;
            //        }

            //        return value;
            //    }
            //},           
            {
                id: "active", field: "active", name: tableTranslation.ACTIVE, sortable: true, width: 100, defaultWidth: 100, cssClass: 'center',
                minWidth: 70, maxWidth: 150, filterable: true, dataType: 'boolen',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var icon = dataContext.active ? "bowtie-checkbox" : "bowtie-checkbox-empty";
                    return '<span> ' +
                        '<i class="checkActive bowtie-icon ' + icon + '" style="font-size:18px;"></i >' +
                        '</span> ';
                }
            },
            {
                id: "createdBy", field: "createdBy", name: tableTranslation.CREATEDBY, width: 250, defaultWidth: 250, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext && dataContext.user) {
                        return dataContext.user.displayName;
                    }
                    return '';
                }
            },
            {
                id: "createdTime", field: "createdTime", name: tableTranslation.CREATEDTIME, width: 150, defaultWidth: 150, sortable: true, dataType: 'datetime', formatter: Slick.Formatters.Date
            },
        ],
    };
    tableSetting.required = [
        "name", "code"
    ];
    tableSetting.validate = {
        code: { required: true },
        name: { required: true },
    }
}
