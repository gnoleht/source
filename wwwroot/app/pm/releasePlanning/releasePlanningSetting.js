var releasePlanningSetting = {
    view: {
        module: 'pm',
        formName: 'releasePlanning',
        gridName: 'grvReleasePlanning',
    },
};

function releasePlanningInitSetting() {
    releasePlanningSetting.grid = {
        url: '',
        defaultUrl: '',
        options: {
            rowHeight: 40,
            topPanelHeight: 35,
            headerRowHeight: 0,
            showHeaderRow: true,

            createFooterRow: false,
            showFooterRow: false,
            footerRowHeight: 30,

            fullWidthRows: true,
            multiColumnSort: true,
            enableColumnReorder: true,
            enableCellNavigation: true,

            forceFitColumns: true,

            allowOrder: false,
            allowFilter: true,
            allowCustom: true,
            editable: true,
            enableAddRow: false,
            asyncEditorLoading: true,
            forceFitColumns: false,
            autoEdit: false,
        },
        columns: [
            {
                id: 'isShow', field: 'isShow', sortable: false,
                name: '',
                width: 40, minWidth: 40, maxWidth: 40, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (!dataContext.isPlan) return null;
                    var icon = dataContext.isShow ? "bowtie-checkbox" : "bowtie-checkbox-empty";
                    return '<span> ' +
                        '<i class="checkIsShow bowtie-icon ' + icon + '" style="font-size:18px;"></i >' +
                        '</span> ';
                }
            },
            {
                id: "name", field: "name", name: 'Name', width: 270, minWidth: 100, sortable: false, dataType: 'text',
            },
            {
                id: "velocity", field: "velocity", name: 'Velocity', width: 100, minWidth: 150, sortable: false,
            },
            {
                id: "startDate", field: "startDate", name: 'Start Date', width: 150, minWidth: 100, sortable: false, formatter: Slick.Formatters.Date
            },
            {
                id: 'endDate', field: 'endDate', name: 'End Date', width: 150, minWidth: 100, sortable: false, formatter: Slick.Formatters.Date
            },
            {
                id: 'workingDays', field: 'workingDays', name: 'Working Days', width: 140, minWidth: 140, sortable: false
            },
            {
                id: 'isPlan', field: 'isPlan', sortable: false,
                name: 'Plan',
                width: 30, minWidth: 50, maxWidth: 50, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var icon = dataContext.isPlan ? "bowtie-checkbox" : "bowtie-checkbox-empty";
                    return '<span> ' +
                        '<i class="bowtie-icon ' + icon + '" style="font-size:18px;"></i >' +
                        '</span> ';
                }
            },
        ],


    };

    releasePlanningSetting.options = {
        uploadSetting: [
            {
                acceptedFiles: 'image/*',
                maxFiles: 2,
                elementId: 'imgAvatar',
            }],
    };

    releasePlanningSetting.required = [
        "name", "velocity", "startDate", "endDate", "workingDays"
    ];

    releasePlanningSetting.readonly = [
        "workingDays"
    ];

    releasePlanningSetting.validate = {
        name: { required: true },
        velocity: { required: true },
        startDate: { required: true },
        endDate: { required: true },
        workingDays: { required: true },
    };

    releasePlanningSetting.valuelist = {};

    releasePlanningSetting.options = { loadButton: true };
}