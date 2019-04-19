var stationeryLimitSetting = {
    view: {
        module: 'pt',
        subModule:'stationeryLimit',
        formName: 'stationeryLimit',
        gridName: 'grvStationeryLimit',
    }
};

function stationeryLimitInitSetting() {
    stationeryLimitSetting.grid = {
        url: 'api/pt/stationeryLimit/get',
        options: {
            rowHeight: 40,
            topPanelHeight: 35,
            showHeaderRow: true,
            headerRowHeight: 0,

            allowOrder: false,
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
                id: "row", field: "row", name: stationeryLimitTranslation.NO, width: 40, minWidth: 40, sortable: false, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return row + 1;
                }
            },
            {
                id: "title", field: "title", name: stationeryLimitTranslation.TITLE, width: 350, minWidth: 30, sortable: true
            },
            {
                id: "limit", field: "limit", name: stationeryLimitTranslation.LIMIT, width: 200, minWidth: 30, sortable: true, dataType: 'number',formatter: Slick.Formatters.Money
            },
            {
                id: 'departmentRef', field: 'departmentRef', name: stationeryLimitTranslation.DEPARTMENT, width: 200, minWidth: 50, sortable: true, fieldFilter: 'name',
                formatter: function (a, b, value) {
                    if (value)
                        return value.name;
                    return;
                }
            },
            {
                id: 'approveRoleRef', field: 'approveRoleRef', name: stationeryLimitTranslation.APPROVE_ROLE, width: 200, minWidth: 50, sortable: true, fieldFilter: 'name',
                formatter: function (a, b, value) {
                    if (value)
                        return value.name;
                    return;
                }
            },
            {
                id: 'orderRoleRef', field: 'orderRoleRef', name: stationeryLimitTranslation.ORDER_ROLE, width: 200, minWidth: 50, sortable: true, fieldFilter: 'name',
                formatter: function (a, b, value) {
                    if (value)
                        return value.name;
                    return;
                }
            },
            {
                id: "note", field: "note", name: stationeryLimitTranslation.NOTE, width: 150, minWidth: 30, sortable: true, dataType: 'text',
            },
        ],
    };

    stationeryLimitSetting.valuelist = {};
    stationeryLimitSetting.listFilter = {};
    stationeryLimitSetting.required = ["title","department","limit"];
    
}
