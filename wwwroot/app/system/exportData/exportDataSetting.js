var exportDataSetting = {
    view: {
        module: 'system',
        formName: 'exportData',
        gridName: 'grvExportData',
    }
};

function exportDataInitSetting() {
    exportDataSetting.grid = {
        url: 'api/sys/exportData/get',
        options: {
            rowHeight: 40,
            topPanelHeight: 35,
            showHeaderRow: true,
            headerRowHeight: 0,

            allowOrder: true,
            allowFilter: true,
            allowCustom: true,

            fullWidthRows: true,
            multiColumnSort: true,
            enableColumnReorder: true,
            enableCellNavigation: true,
            explicitInitialization: true,
        },
        columns: [
            {
                id: "name", field: "name", name: exportDataTranslation.NAME, width: 300, minWidth: 30, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return '<div style="display:block;padding-left:10px">' + firstCharImage(value) + '<span>' + value + '</span></div>';
                }
            },
            { id: 'description', field: 'description', name: exportDataTranslation.DESCRIPTION, width: 500, minWidth: 50, sortable: true, dataType: 'text' },
        ],
    };

    exportDataSetting.valuelist = {
        format: [
            {
                "id": "pdf",
                "text": "PDF"
            },
            {
                "id": "xlsx",
                "text": "Microsoft excel"
            }
        ]
    };


    exportDataSetting.readonly = ['fileName'];

    exportDataSetting.validate = {
        name: { required: true },
        description: { required: true }
    }
}
