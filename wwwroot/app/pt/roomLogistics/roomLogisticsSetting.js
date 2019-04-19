var roomLogisticsSetting = {
    view: {
        module: 'pt',
        subModule: 'room',
        formName: 'roomLogistics',
        gridName: 'grvRoomLogistics'
    }
};

function roomLogisticsInitSetting() {
    roomLogisticsSetting.grid = {
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
            { id: "name", name: roomLogisticsTranslation.NAME, field: "name", sortable: true, dataType: 'text', width: 400 },
            {
                id: "isActive", name: roomLogisticsTranslation.ISACTIVE, field: "isActive", sortable: true, dataType: 'text', width: 100, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var icon = value ? "bowtie-icon bowtie-checkbox" : "bowtie-icon bowtie-checkbox-empty";
                    return '<div style="text-align:-webkit-center"> ' +
                        '<i class="' + icon + ' checkWI" style="font-size:17px;width:15.78px"></i >' +
                        '</div> ';
                }
            }
        ]
    };

    roomLogisticsSetting.required = ['name'];
    roomLogisticsSetting.valuelist = {};
    roomLogisticsSetting.options = {};
    roomLogisticsSetting.validate = {
        name: { required: true }
    };
}