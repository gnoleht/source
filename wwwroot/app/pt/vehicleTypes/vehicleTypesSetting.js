var vehicleTypesSetting = {
    view: {
        module: 'pt',
        subModule: 'vehicle',
        formName: 'vehicleTypes',
        gridName: 'grvVehicleTypes'
    }
};

function vehicleTypesInitSetting() {
    vehicleTypesSetting.grid = {
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
            { id: "name", name: vehicleTypesTranslation.NAME, field: "name", sortable: true, dataType: 'text', width: 200 },
            { id: "total", name: vehicleTypesTranslation.TOTAL, field: "total", sortable: true, dataType: 'text', width: 100, filterable: false },
            { id: "description", name: vehicleTypesTranslation.DESCRIPTION, field: "description", sortable: true, dataType: 'text', width: 300 },
            { id: "capacity", name: vehicleTypesTranslation.CAPACITY, field: "capacity", sortable: true, dataType: 'text', width: 100, filterable: false },
            { id: "sortOrder", name: vehicleTypesTranslation.SORTORDER, field: "sortOrder", sortable: true, dataType: 'text', width: 100, filterable: false },
            {
                id: "locationRelated", name: vehicleTypesTranslation.LOCATION, field: "locationRelated", sortable: true, width: 120, fieldFilter: 'name',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value)
                        return value.name;
                    return null;
                }
            },
            {
                id: "isActive", name: vehicleTypesTranslation.ISACTIVE, field: "isActive", sortable: true, dataType: 'text', width: 100, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var icon = value ? "bowtie-icon bowtie-checkbox" : "bowtie-icon bowtie-checkbox-empty";
                    return '<div style="text-align:-webkit-center"> ' +
                        '<i class="' + icon + ' checkWI" style="font-size:17px;width:15.78px"></i >' +
                        '</div> ';
                }
            }
        ]
    };

    vehicleTypesSetting.required = ['name', 'arrangers', 'sortOrder', 'category', 'viewers', 'approves'];
    vehicleTypesSetting.valuelist = {};
    vehicleTypesSetting.options = {};
    vehicleTypesSetting.validate = {
        name: { required: true },
        approves: { required: true },
        arrangers: { required: true },
        sortOrder: { required: true },
        category: { required: true },
        viewers: { required: true }
    };
}