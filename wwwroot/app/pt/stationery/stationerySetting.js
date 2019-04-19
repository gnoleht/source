var stationerySetting = {
    view: {
        module: 'pt',
        subModule:'stationery',
        formName: 'stationery',
        gridName: 'grvStationery',
    }
};

function stationeryInitSetting() {
    stationerySetting.grid = {
        url: 'api/pt/stationery/get',
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

            dataItemColumnValueExtractor: Slick.Editors.ObjectValue
        },
        columns: [
            {
                id: "id", field: "id", name: stationeryTranslation.NO, width: 40, minWidth: 40, sortable: false, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return row + 1;
                }
            },
            {
                id: "reason", field: "reason", name: stationeryTranslation.REASON, width: 300, minWidth: 30, sortable: true,
                formatter: Slick.Formatters.TextBox
            },
            {
                id: 'companyRef', field: 'companyRef.name', name: stationeryTranslation.COMPANY, width: 200, minWidth: 50, sortable: true, fieldFilter: 'name',
                formatter: Slick.Formatters.TextBox
            },
            {
                id: 'userRef', field: 'userRef.displayName', name: stationeryTranslation.CREATED_BY, width: 200, minWidth: 50, sortable: true,
               formatter: Slick.Formatters.TextBox
            },
            {
                id: 'createdTime', field: 'createdTime', name: stationeryTranslation.CREATED_DATE, width: 160, minWidth: 50, sortable: true, dataType: "datetime",
                formatter: Slick.Formatters.Date
            },
            {
                id: 'approvedByRef', field: 'approvedByRef.displayName', name: stationeryTranslation.APPROVED_BY, width: 200, minWidth: 50, sortable: true, fieldFilter: 'displayName',
                formatter: Slick.Formatters.TextBox
            },
            {
                id: 'departmentRef', field: 'departmentRef.name', name: stationeryTranslation.DEPARTMENT, width: 200, minWidth: 50, sortable: true, fieldFilter: 'name',
                formatter: Slick.Formatters.TextBox
            },
            {
                id: 'status', field: 'status', name: stationeryTranslation.STATUS, width: 200, minWidth: 50, sortable: true, dataType: 'select', listName: 'stationeryStatus',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var itemList = stationerySetting.listFilter.stationeryStatus[value];
                    if (itemList)
                        return gridItemRender(itemList);
                    return value;
                }
            },
            {
                id: 'stationeryStatus', field: 'stationeryStatus', name: stationeryTranslation.STATIONERY_STATUS, width: 250, minWidth: 200, sortable: true, dataType: 'select', listName: 'stationeryOrderStatus',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var itemList = stationerySetting.listFilter.stationeryOrderStatus[value];
                    if (itemList)
                        return gridItemRender(itemList);
                    return value;
                }
            }
            //{ id: 'period', field: 'period', name: stationeryTranslation.PERIOD, width: 200, minWidth: 50, sortable: true },
        ],
    };

    stationerySetting.valuelist = {};
    stationerySetting.listFilter = {};
    
}
