var locationSetting = {
    view: {
        module: 'pt',
        subModule: 'vehicle',
        formName: 'location',
        gridName: 'grvLocation'
    }
};

function locationInitSetting() {
    locationSetting.grid = {
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
            { id: "name", name: locationTranslation.NAME, field: "name", sortable: true, dataType: 'text', width: 400 },
            { id: "sortOrder", name: locationTranslation.SORTORDER, field: "sortOrder", sortable: true, dataType: 'text', width: 100 }
        ]
    };

    locationSetting.required = ['name', 'sortOrder', 'viewers'];
    locationSetting.valuelist = {};
    locationSetting.options = {};
    locationSetting.validate = {
        name: { required: true },
        sortOrder: { required: true },
        viewers: { required: true }
    };
}