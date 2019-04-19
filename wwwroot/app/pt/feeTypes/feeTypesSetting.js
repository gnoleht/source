var feeTypesSetting = {
    view: {
        module: 'pt',
        subModule: 'vehicle',
        formName: 'feeTypes',
        gridName: 'grvFeeTypes'
    }
};

function feeTypesInitSetting() {
    feeTypesSetting.grid = {
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
            { id: "name", name: feeTypesTranslation.NAME, field: "name", sortable: true, dataType: 'text', width: 400 },
            { id: "sortOrder", name: feeTypesTranslation.SORTORDER, field: "sortOrder", sortable: true, dataType: 'text', width: 100, filterable: false }
        ]
    };

    feeTypesSetting.required = ['name', 'sortOrder'];
    feeTypesSetting.valuelist = {};
    feeTypesSetting.options = {};
    feeTypesSetting.validate = {
        name: { required: true },
        sortOrder: { required: true }
    };
}