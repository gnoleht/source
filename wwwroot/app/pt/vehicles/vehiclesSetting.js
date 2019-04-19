var vehiclesSetting = {
    view: {
        module: 'pt',
        subModule: 'vehicle',
        formName: 'vehicles',
        gridName: 'grvVehicles'
    }
};

function vehiclesInitSetting() {
    vehiclesSetting.grid = {
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
            { id: "name", name: vehiclesTranslation.NAME, field: "name", sortable: true, dataType: 'text', width: 200 },
            { id: "brand", name: vehiclesTranslation.BRAND, field: "brand", sortable: true, dataType: 'text', width: 100 },
            { id: "description", name: vehiclesTranslation.DESCRIPTION, field: "description", sortable: true, dataType: 'text', width: 300 },
            { id: "totalTime", name: vehiclesTranslation.TOTALTIME, field: "totalTime", sortable: true, dataType: 'text', width: 100, filterable: false },
            {
                id: "vehicleTypeRelated", name: vehiclesTranslation.VEHICLETYPE, field: "vehicleTypeRelated", sortable: true, fieldFilter: 'name', width: 200,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.vehicleTypeRelated)
                        return value.name;
                    return '';
                }
            },
            {
                id: "driverRelated", name: vehiclesTranslation.DRIVER, field: "driverRelated", sortable: true, width: 200, fieldFilter: 'displayName',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.driverRelated)
                        return value.displayName;
                    return '';
                }
            },
            {
                id: "isActive", name: vehiclesTranslation.ISACTIVE, field: "isActive", sortable: true, dataType: 'text', width: 100, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var icon = value ? "bowtie-icon bowtie-checkbox" : "bowtie-icon bowtie-checkbox-empty";
                    return '<div style="text-align:-webkit-center"> ' +
                        '<i class="' + icon + ' checkWI" style="font-size:17px;width:15.78px"></i >' +
                        '</div> ';
                }
            }
        ]
    };

    vehiclesSetting.required = ['name', 'brand', 'vehicleType'];
    vehiclesSetting.valuelist = {};
    vehiclesSetting.options = {};
    vehiclesSetting.validate = {
        name: { required: true },
        brand: { required: true },
        vehicleType: { required: true }
    };
}