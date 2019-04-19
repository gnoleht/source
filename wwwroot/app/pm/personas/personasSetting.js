var personasSetting = {
    view: {
        module: 'pm',
        formName: 'personas',
        gridName: 'grvPersonas',
    }
};
function personasInitSetting() {
    personasSetting.grid = {
        url: 'api/Personas/get',
        defaultUrl: 'api/Personas/get',

        options: {
            rowHeight: 40,
            topPanelHeight: 35,

            showHeaderRow: true,
            headerRowHeight: 0,
            tableName: "PM_Personas",

            allowOrder: false,
            allowFilter: true,
            allowCustom: true,
            allowExport: true,
            allowImport: true,

            autoHeight: false,
            fullWidthRows: true,
            multiColumnSort: true,

            enableColumnReorder: true,
            enableCellNavigation: true,
            explicitInitialization: true
        },

        columns: [
            {
                id: "name", name: personasTranslation.NAME, field: "name", sortable: true, dataType: "text", width: 300, minWidth: 100,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return '<div style="display:block">' + firstCharImage(value) + '<span>' + value + '</span></div>';
                }
            },
            {
                id: 'detail', name: personasTranslation.DETAIL, field: "detail", sortable: true, dataType: "text", width: 300, minWidth: 100,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value == null) return "";
                    return value.replace(/<(.|\n)*?>/g, '');
                }
            },
            {
                id: 'frustrations', name: personasTranslation.FRUSTRATIONS, field: "frustrations", sortable: true, dataType: "text", width: 300, minWidth: 100,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value == null) return "";
                    return value.replace(/<(.|\n)*?>/g, '');
                }
            },
            {
                id: 'motivations', name: personasTranslation.MOTIVATIONS, field: "motivations", sortable: true, dataType: "text", width: 300, minWidth: 100,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value == null) return "";
                    return value.replace(/<(.|\n)*?>/g, '');
                }
            },
            {
                id: 'behaviouralMetrics', name: personasTranslation.BEHAVIOURAL_METRICS, field: "behaviouralMetrics", sortable: true, dataType: "text", width: 300, minWidth: 100,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value == null) return "";
                    return value.replace(/<(.|\n)*?>/g, '');
                }
            },
        ],
    };

    personasSetting.valuelist = {};

    personasSetting.options = {
        uploadSetting: [
            {
                acceptedFiles: 'image/*',
                maxFiles: 1,
                elementId: 'imgAvatar',
            }],
    };

    personasSetting.required = ["name"];
}