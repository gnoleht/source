var relatedWorkSetting = {
    view : {
    gridName: 'gridWorkItemLink'
}};

function relatedWorkInitSetting() {
    relatedWorkSetting.valuelist = {};
    relatedWorkSetting.listFilter = {};
    relatedWorkSetting.options = {};
    relatedWorkSetting.grid = {
        url: 'api/workitem/findlink',
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
                id: "id", field: "id", name: '', width: 30, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var icon = dataContext.isCheck ? "bowtie-icon bowtie-checkbox" : "bowtie-icon bowtie-checkbox-empty";
                    return '<div style="text-align:-webkit-center"> ' +
                        '<i class="' + icon + ' checkWI" style="cursor:pointer;font-size:17px;width:15.78px"></i >' +
                        '</div> ';
                }
            },
            {
                id: "name", field: "name", name: "Title", width: 380,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.no) value = dataContext.no + ': ' + value;
                    return value;
                }
            },
            {
                id: "type", field: "type", name: "Type", width: 110,
                formatter: function (row, cell, value) {
                    if (value) {
                        if (value == 'userstory') return "User story";
                        return capitalizeText(value);
                    }
                }
            },
            {
                id: "state", name: "State", field: "state", width: 100,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return '<i class=\"fa fa-circle status_' + value + '\"></i>&nbsp;' + capitalizeText(value);
                }
            }

        ],
    };
}