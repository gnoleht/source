var driversSetting = {
    view: {
        module: 'pt',
        subModule: 'vehicle',
        formName: 'drivers',
        gridName: 'grvDrivers'
    }
};

function driversInitSetting() {
    driversSetting.grid = {
        url: '',
        options: {
            rowHeight: 40,
            topPanelHeight: 35,

            showHeaderRow: true,
            headerRowHeight: 0,

            allowOrder: true,
            allowFilter: true,
            allowCustom: true,

            createFooterRow: true,
            showFooterRow: true,
            footerRowHeight: 30,

            autoHeight: false,
            fullWidthRows: true,
            multiColumnSort: true,

            enableColumnReorder: true,
            enableCellNavigation: true,
            explicitInitialization: true
        },

        columns: [
            { id: "sortOrder", name: driversTranslation.SORTORDER, field: "sortOrder", sortable: true, dataType: 'text', width: 100, filterable: false },
            {
                id: "userRelated", name: driversTranslation.USER, field: "userRelated", sortable: true, width: 300, fieldFilter: 'displayName',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return dataContext.userRelated.displayName;
                }
            },
            {
                id: "vehicleTypes", name: driversTranslation.VEHICLETYPES, field: "vehicleTypes", sortable: true, dataType: 'text', width: 300, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value)
                        return dataContext.vehicleTypesRelated.map(x => x.name).join(', ');
                    return null;
                }
            }
        ]
    };

    driversSetting.required = ['sortOrder', 'user', 'vehicleTypes'];
    driversSetting.valuelist = {};
    driversSetting.options = {};
    driversSetting.validate = {
        sortOrder: { required: true },
        user: { required: true },
        vehicleTypes: { required: true }
    };
}