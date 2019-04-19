var areasSetting = {
    view: {
        module: 'pm',
        formName: 'areas',
        gridName: 'grvAreas',
    },
};

function areasInitSetting() {
    areasSetting.grid = {
        url: 'api/pm/areas/getAreas',
        options: {
            rowHeight: 40,
            topPanelHeight: 35,

            showHeaderRow: true,
            headerRowHeight: 0,

            allowOrder: true,
            allowFilter: true,
            allowCustom: true,

            autoHeight: false,
            fullWidthRows: true,
            multiColumnSort: true,

            enableColumnReorder: true,
            enableCellNavigation: true,
            explicitInitialization: true

        },
        columns: [

            {
                id: 'code', field: "code", name: areasTranslation.CODE, width: 200, sortable: true,
            },
            {
                id: 'name', field: 'name', name: areasTranslation.NAME, width: 400, sortable: true, dataType: 'text',
            },
            {
                id: 'state', field: 'state', name: areasTranslation.STATE, width: 300, sortable: false, dataType: 'select', listName: 'state',
                formatter: function(row, cell, value, columnDef, dataContext) {
                    if (value && areasSetting && areasSetting.listFilter && areasSetting.listFilter.state) {
                        var itemList = areasSetting.listFilter.state[value];

                        if (itemList)
                            return gridItemRender(itemList);
                    }

                    return value;
                }
            },
            {
                id: 'client', field: 'client', name: areasTranslation.CLIENT, width: 300, sortable: true
            },
            {
                id: 'contractCode', field: 'contractCode', name: areasTranslation.CONTRACTCODE, width: 300,
            },
            {
                id: 'contractValue', field: 'contractValue', name: areasTranslation.CONTRACTVALUE, width: 300, sortable: true,
                formatter: function(row, cell, value, columnDef, dataContext) {
                    return parseInt(value).toLocaleString();
                }
            },
        ],
    };

    areasSetting.required = [
        "name", "code", "state", "owner", "sponser", "department"
    ];


    areasSetting.validate = {
        name: { required: true },
        code: { required: true },
        state: { required: true },
        owner: { required: true },
        sponser: { required: true },
        department: { required: true },
    };
    areasSetting.valuelist = {};
    areasSetting.options = {
        uploadSetting: [
            {
                acceptedFiles: 'image/*',
                maxFiles: 1,
                elementId: 'imgAvatarAreas',
            }],
    };
}