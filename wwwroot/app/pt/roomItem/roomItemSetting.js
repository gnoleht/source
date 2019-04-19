var roomItemSetting = {
    view: {
        module: 'pt',
        subModule: 'room',
        formName: 'roomItem',
        gridName: 'grvRoomItem'
    }
};

function roomItemInitSetting() {
    roomItemSetting.grid = {
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
            { id: "name", name: roomItemTranslation.NAME, field: "name", sortable: true, dataType: 'text', width: 400 },
            { id: "capacity", name: roomItemTranslation.CAPACITY, field: "capacity", sortable: true, dataType: 'text', width: 100 },
            {
                id: "isActive", name: roomItemTranslation.ISACTIVE, field: "isActive", sortable: true, dataType: 'text', width: 90, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var icon = value ? "bowtie-icon bowtie-checkbox" : "bowtie-icon bowtie-checkbox-empty";
                    return '<div style="text-align:-webkit-center"> ' +
                        '<i class="' + icon + ' checkIsActive" style="font-size:17px;width:15.78px"></i >' +
                        '</div> ';
                }
            }
        ]
    };

    roomItemSetting.valuelist = {};
    roomItemSetting.options = {};
    roomItemSetting.required = ['name', 'capacity', 'approves'];
    roomItemSetting.validate = {
        name: { required: true },
        capacity: { required: true },
        approves: { required: true }
    };
}